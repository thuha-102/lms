import { BackgroundKnowledgeType, Prisma, QualificationType } from '@prisma/client';
import { connectRelation } from 'src/shared/prisma.helper';

export class UserLearnerDTO {
  activeReflective: number;
  sensitiveIntuitive: number;
  visualVerbal: number;
  sequentialGlobal: number;
  backgroundKnowledge: BackgroundKnowledgeType;
  qualification: QualificationType;

  static convertScore(st: number, answer: string[]) {
    let a = 0,
      b = 0;
    while (st <= 44) {
      if (answer[st] === 'A' || answer[st] === 'a') a++;
      else b++;
      st += 4;
    }

    const dist = Math.abs(a - b);
    if (dist === 1 || dist === 3) return 0;
    if (dist === 5 || dist === 7) return a > b ? -1 : 1;
    return a > b ? -2 : 2;
  }

  static learningStyle(answer: string[]): {
    activeReflective: number;
    sensitiveIntuitive: number;
    visualVerbal: number;
    sequentialGlobal: number;
  } {
    const activeReflective = answer.length !== 0 ? this.convertScore(1, answer) : null,
      sensitiveIntuitive = answer.length !== 0 ? this.convertScore(2, answer) : null,
      visualVerbal = answer.length !== 0 ? this.convertScore(3, answer) : null,
      sequentialGlobal = answer.length !== 0 ? this.convertScore(4, answer) : null;

    return {
      activeReflective,
      sensitiveIntuitive,
      visualVerbal,
      sequentialGlobal,
    };
  }

  static selectLearner(): Prisma.LearnerSelect {
    return {
      id: true,
      qualification: true,
      backgroundKnowledge: true,
      activeReflective: true,
      sensitiveIntuitive: true,
      visualVerbal: true,
      sequentialGlobal: true,
    };
  }

  static toCreateInput(
    userId: number,
    learningStyleQA: string[] = null,
    backgroundKnowledge: BackgroundKnowledgeType = null,
    qualification: QualificationType = null,
  ): Prisma.LearnerCreateInput {
    const style = learningStyleQA
      ? this.learningStyle(learningStyleQA)
      : { activeReflective: null, sensitiveIntuitive: null, visualVerbal: null, sequentialGlobal: null };

    return {
      activeReflective: style.activeReflective,
      sensitiveIntuitive: style.sensitiveIntuitive,
      visualVerbal: style.visualVerbal,
      sequentialGlobal: style.sequentialGlobal,
      backgroundKnowledge: backgroundKnowledge,
      qualification: qualification,
      user: connectRelation(userId),
    };
  }
}
