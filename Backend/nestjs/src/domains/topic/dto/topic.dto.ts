import { Prisma } from '@prisma/client';
import { LearningLogDTO } from 'src/domains/learning/learner-log/dto/learning-log.dto';

const DFS = (
  stack: number[],
  currentPath: number[],
  topicLink: { start: number; link: number[] }[],
  start?: number,
  end?: number,
): number[][] => {
  const result: number[][] = [];

  if (stack.length === 0) {
    stack.push(start);
    currentPath.push(start);
    result.push(...DFS(stack, currentPath, topicLink, start, end));
  } else {
    if (currentPath.length !== 0 && currentPath[currentPath.length - 1] === end) {
      result.push([...currentPath]);
      return result;
    }

    for (let i = 0; i < topicLink.length; i++) {
      if (topicLink[i].start !== stack[stack.length - 1]) continue;
      for (let j = 0; j < topicLink[i].link.length; j++) {
        const index = topicLink[i].link[j];
        if (index === null) continue;
        stack.push(index);
        currentPath.push(index);
        result.push(...DFS(stack, currentPath, topicLink, start, end));
        stack.pop();
        currentPath.pop();
      }
    }
  }

  return result;
};

function transformData(data: { startId: number; endId: number }[]): { start: number; link: number[] }[] {
  const transformedData: { [startId: number]: number[] } = {};

  for (const item of data) {
    if (!(item.startId in transformedData)) {
      transformedData[item.startId] = [];
    }
    transformedData[item.startId].push(item.endId);
  }
  const result: { start: number; link: number[] }[] = [];
  for (const startId in transformedData) {
    if (Object.prototype.hasOwnProperty.call(transformedData, startId)) {
      result.push({ start: parseInt(startId), link: transformedData[startId] });
    }
  }
  return result;
}

export class TopicDTO {
  id: number;
  title: string;
  subject: string;
  preTopicIds: number[];
  postTopicIds: number[];

  static getSimilarityLM(logs: LearningLogDTO[]) {
    let result: { rating: number; similarity: number; lmID: number; name: string; score: number } = {
      rating: -1,
      similarity: -1,
      lmID: -1,
      name: '',
      score: -1,
    };
    let travel = [];
    let lms: {
      [key: number]: {
        lmID: number;
        name: string;
        score: number;
        time: number;
        attempt: number;
        difficulty: number;
        rating: number;
        topicId: number;
        maxScore: number;
        maxTime: number;
        repeat: number;
      };
    } = {};

    for (let i = 0; i < logs.length; i++) {
      if (!lms[logs[i].lmID]) {
        lms[logs[i].lmID] = { ...logs[i], repeat: 1 };
        travel.push(logs[i].lmID);
        continue;
      }
      lms[logs[i].lmID].score += logs[i].score;
      lms[logs[i].lmID].time += logs[i].time;
      lms[logs[i].lmID].attempt += logs[i].attempt;
      lms[logs[i].lmID].repeat += 1;
    }

    for (const lmID in lms) {
      const aScore = lms[lmID].score / lms[lmID].repeat;
      const aTime = lms[lmID].time / lms[lmID].repeat;
      const aAttempt = lms[lmID].attempt / lms[lmID].repeat;

      const similarity = Math.abs(
        0.4 * (aScore / lms[lmID].maxScore) +
          0.3 * (1.0 - aTime / lms[lmID].maxTime) +
          0.3 * (1.0 - aAttempt) -
          lms[lmID].difficulty,
      );

      if (similarity > result.similarity)
        result = {
          rating: lms[lmID].rating,
          similarity: similarity,
          lmID: lms[lmID].lmID,
          name: lms[lmID].name,
          score: lms[lmID].score,
        };
    }

    return result;
  }

  static getTopicPath(topicLink: { startId: number; endId: number }[], start: number, end: number): number[][] {
    return DFS([], [], transformData(topicLink), start, end);
  }

  static fromEntity(entity: Prisma.TopicGetPayload<{ include: { StartLink: true; EndLink: true } }>): TopicDTO {
    const preTopicIds = entity.EndLink.map((l) => l.startId);
    const postTopicIds = entity.StartLink.map((l) => l.endId);

    return {
      id: entity.id,
      title: entity.title,
      subject: entity.subject,
      preTopicIds,
      postTopicIds,
    };
  }
}
