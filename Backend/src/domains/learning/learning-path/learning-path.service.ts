import { ForbiddenException, GatewayTimeoutException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LearningPathCreateREQ, GetRecommendedLearningPathREQ } from './request/learning-path-create.request';
import { LearningMaterialRESP } from '../learning-material/response/learning-material-detail.response';
import { getStartEnd } from 'src/shared/contants.helper';
import { UserLearnerDTO } from 'src/domains/user/dto/user-learner.dto';
import { LearningLogDTO } from '../learner-log/dto/learning-log.dto';
import { TopicDTO } from 'src/domains/topic/dto/topic.dto';
import { connectRelation, leanObject } from 'src/shared/prisma.helper';
import { BackgroundKnowledgeType, QualificationType } from '@prisma/client';

@Injectable()
export class LearningPathService {
  constructor(private readonly prismaService: PrismaService) {}

  async calculateRecommendedOnes(learnerId: number, body: GetRecommendedLearningPathREQ) {
    await this.prismaService.learningPath.deleteMany({ where: { learnerId: learnerId } });

    const { start, end } = getStartEnd(body.goal);
    const style = UserLearnerDTO.learningStyle(body.learningStyleQA);

    const learner = await this.prismaService.learner.update({
      where: { id: learnerId },
      data: leanObject({
        backgroundKnowledge: body.backgroundKnowledge,
        qualification: body.qualification,
        activeReflective: style.activeReflective,
        sensitiveIntuitive: style.sensitiveIntuitive,
        visualVerbal: style.visualVerbal,
        sequentialGlobal: style.sequentialGlobal,
      }),
      select: {
        backgroundKnowledge: true,
        qualification: true,
        activeReflective: true,
        sensitiveIntuitive: true,
        visualVerbal: true,
        sequentialGlobal: true,
      },
    });

    let temp: number[][] = [];

    const learnerIds = (
      await this.prismaService.learner.findMany({
        where: {
          qualification: body.qualification ? body.qualification : learner.qualification,
          backgroundKnowledge: body.backgroundKnowledge ? body.backgroundKnowledge : learner.backgroundKnowledge,
          activeReflective: style.activeReflective ? style.activeReflective : learner.activeReflective,
          visualVerbal: style.visualVerbal ? style.visualVerbal : learner.visualVerbal,
          sequentialGlobal: style.sequentialGlobal ? style.sequentialGlobal : learner.sequentialGlobal,
          sensitiveIntuitive: style.sensitiveIntuitive ? style.sensitiveIntuitive : learner.sensitiveIntuitive,
        },
        select: { id: true },
      })
    ).map((l) => l.id);

    const logs = (
      await this.prismaService.learnerLog.findMany({
        where: { learnerId: { in: learnerIds } },
        select: { learningMaterial: true, attempts: true, score: true, time: true },
      })
    ).map((log) => LearningLogDTO.fromEntity(log as any));

    const topicLink = await this.prismaService.topicLink.findMany({
      where: { state: true },
      select: { startId: true, endId: true },
    });
    const paths = TopicDTO.getTopicPath(topicLink, start, end);

    for (let i = 0; i < paths.length; i++) {
      temp.push([]);
      for (let j = 0; j < paths[i].length; j++) {
        const topicLogs = logs.filter((log) => log.topicId === paths[i][j]);
        let recommendLM = TopicDTO.getSimilarityLM(topicLogs);

        if (recommendLM.lmID === -1) {
          const lm = await this.prismaService.learningMaterial.findFirst({
            where: { topicId: paths[i][j] },
            orderBy: { rating: 'desc' },
            select: { id: true },
          });
          if (lm) recommendLM.lmID = lm.id;
        }
        temp[i].push(recommendLM.lmID);
      }
    }

    const result = temp.map((p) =>
      p.reduce((unique, currentId) => {
        const existingItem = unique.find((existId) => existId === currentId);
        if (!existingItem) unique.push(currentId);
        return unique;
      }, []),
    );

    return result;
  }

  async create(learnerId: number, body: LearningPathCreateREQ) {
    const result = await this.prismaService.$transaction(async (tx) => {
      await Promise.all(
        body.LOs.map(
          async (id, index) =>
            await tx.learningPath.create({
              data: LearningPathCreateREQ.toCreateInput(learnerId, id, index),
            }),
        ),
      ).catch((error) => {
        throw new error();
      });
    });

    return result;
  }

  async detail(learnerId: number) {
    const paths = await this.prismaService.learningPath.findMany({
      where: { learnerId: learnerId },
      orderBy: { learningMaterialOrder: 'asc' },
      select: {
        // learningMaterialOrder: true,
        learningMaterialId: true,
      },
    });
    const lmIds = paths.map((p) => p.learningMaterialId);

    const lms = await this.prismaService.learningMaterial.findMany({
      where: { id: { in: lmIds } },
      orderBy: { topicId: 'asc' },
      select: {
        id: true,
        name: true,
        difficulty: true,
        percentOfPass: true,
        type: true,
        rating: true,
        score: true,
        time: true,
        Topic: true,
      },
    });

    let result = [];
    for (let i = 0; i < lmIds.length; i++) {
      const log = await this.prismaService.learnerLog.findFirst({
        where: { learningMaterialId: lms[i].id, learnerId: learnerId, state: true },
        select: {
          learningMaterial: { include: { Topic: true } },
          score: true,
          attempts: true,
          time: true,
        },
      });

      if (!log) result.push({ ...lms[i], score: 0, attempts: 0, time: 0 });
      else {
        result.push({
          id: log.learningMaterial.id,
          name: log.learningMaterial.name,
          percentOfPass: log.learningMaterial.percentOfPass,
          difficulty: log.learningMaterial.difficulty,
          Topic: log.learningMaterial.Topic,
          score: Math.floor((log.score * 100) / lms[i].score),
          attempts: log.attempts,
          time: log.time,
        });
      }
    }

    result = result.filter((item, index, self) => index === self.findIndex((t) => t.Topic.id === item.Topic.id));

    return result;
  }

  async generateGraph(paths: number[][], learnerId: number) {
    let graphNodes = [], exist = [];
    
    await this.prismaService.learningGraphNode.deleteMany({where: {learnerId: learnerId}})

    const maxLength = paths.reduce((max, subarray) => {
        return Math.max(max, subarray.length);
    }, 0);

    for (let i = 0; i < maxLength; i++) {
        graphNodes.push([]);
    }

    paths.forEach(subarray => {
        // subarray.forEach((num, index) => {
        //   if (!graphNodes[index].includes(num) && !exist.includes(num)) {
        //     graphNodes[index].push({
        //       id: num,
        //       prio: index === 0 ? null : index - 1
        //     });
        //     exist.push(num)
        //   }
        // });

        for (let i = 0; i < subarray.length; i++) {
          const num = subarray[i]
          if (!graphNodes[i].includes(num) && !exist.includes(num)) {
            graphNodes[i].push({
              id: num,
              prio: i === 0 ? null : subarray[i - 1]
            });
            exist.push(num)
          }
        }
    });

    for(let i = 0; i < graphNodes.length; i++) {
      if (graphNodes[i].length === 0) continue;

      for (let j = 0; j < graphNodes[i].length; j++) {
          if (graphNodes[i][j].id !== -1)
            await this.prismaService.learningGraphNode.create({
              data: {
                Learner: connectRelation(learnerId),
                LearningMaterial: connectRelation(graphNodes[i][j].id),
                prioLearningMaterialId: graphNodes[i][j].prio,
                layer: i
              }
            })
      }
    }
  }

  async getLearningNodes(learnerId: number) {
    const nodes = await this.prismaService.learningGraphNode.findMany({where: {learnerId: learnerId}, orderBy: {layer: 'asc'}, select: {layer: true, prioLearningMaterialId: true, LearningMaterial: {include: {Topic: true}}}})
    if (nodes.length === 0) return []
    
    let result = [[]];
    for (let i = 0; i < nodes[nodes.length - 1].layer; i++) result.push([])

    for (let i = 0; i < nodes.length; i++) {
      const layer = nodes[i].layer
      const log = await this.prismaService.learnerLog.findFirst({where: {learnerId: learnerId, learningMaterialId: nodes[i].LearningMaterial.id, state: true}, select: {score: true}})

      result[layer].push({
        id: nodes[i].LearningMaterial.id,
        name: nodes[i].LearningMaterial.name,
        difficulty: nodes[i].LearningMaterial.difficulty,
        type: nodes[i].LearningMaterial.type,
        rating: nodes[i].LearningMaterial.rating,
        score: log ? Math.round(log.score*100/nodes[i].LearningMaterial.score) : 0,
        time: nodes[i].LearningMaterial.time,
        topic: {
            id: nodes[i].LearningMaterial.topicId,
            title: nodes[i].LearningMaterial.Topic.title
        },
        prioId: nodes[i].prioLearningMaterialId,
        percentOfPass: nodes[i].LearningMaterial.percentOfPass,
      })
    }

    return result
  }
}
