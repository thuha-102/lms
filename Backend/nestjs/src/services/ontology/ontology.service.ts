import { BackgroundKnowledgeType, GenderType, Prisma, QualificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { parseEponch } from 'src/shared/date.helper';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
class Learner {
  id: number;
  activeReflective: number;
  sensitiveIntuitive: number;
  visualVerbal: number;
  sequentialGlobal: number;
  backgroundKnowledge: BackgroundKnowledgeType;
  qualification: QualificationType;
  name: string;
  age: number;
  gender: GenderType;

  static fromEntity(e: Prisma.LearnerGetPayload<{ include: { user: true } }>): Learner {
    return {
      id: e.id,
      activeReflective: e.activeReflective,
      sensitiveIntuitive: e.sensitiveIntuitive,
      visualVerbal: e.visualVerbal,
      sequentialGlobal: e.sequentialGlobal,
      backgroundKnowledge: e.backgroundKnowledge,
      qualification: e.qualification,
      name: e.user.name,
      age: parseEponch(Date.now()).year - parseEponch(e.user.birth).year,
      gender: e.user.gender,
    };
  }
}
@Injectable()
export class OntologyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getLearners() {
    const learners = await this.prismaService.learner.findMany({
      select: {
        id: true,
        activeReflective: true,
        sensitiveIntuitive: true,
        visualVerbal: true,
        sequentialGlobal: true,
        backgroundKnowledge: true,
        qualification: true,
        user: {
          select: {
            name: true,
            birth: true,
            gender: true,
          },
        },
      },
    });

    return learners.map((learner) => Learner.fromEntity(learner as any));
  }

  async getLMs() {
    return await this.prismaService.learningMaterial.findMany({
      select: {
        name: true,
        difficulty: true,
        type: true,
        rating: true,
        score: true,
        time: true,
        Topic: true,
      },
    });
  }

  async getLogs() {
    return await this.prismaService.learnerLog.findMany({
      select: {
        learnerId: true,
        learningMaterialId: true,
        score: true,
        time: true,
        attempts: true,
      },
    });
  }
}
