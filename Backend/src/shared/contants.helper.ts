import { SubjectType } from '@prisma/client';

export const FUNDAMENTALS = {
  type: SubjectType.FUNDAMENTALS,
  start: 1,
  end: 35,
};

export const DATA_SCIENTIST = {
  type: SubjectType.DATA_SCIENTIST,
  start: 36,
  end: 83,
};

export const MACHINE_LEARNING = {
  type: SubjectType.MACHINE_LEARNING,
  start: 84,
  end: 127,
};

export const DEEP_LEARNING = {
  type: SubjectType.DEEP_LEARNING,
  start: 128,
  end: 174,
};

export const DATA_ENGINEER = {
  type: SubjectType.DATA_ENGINEER,
  start: 175,
  end: 186,
};

export const BIG_DATA_ENGINEER = {
  type: SubjectType.BIG_DATA_ENGINEER,
  start: 187,
  end: 217,
};

export const getStartEnd = (type: SubjectType): { start: number; end: number } => {
  if (type === SubjectType.FUNDAMENTALS) return { start: FUNDAMENTALS.start, end: FUNDAMENTALS.end };
  if (type === SubjectType.DATA_SCIENTIST) return { start: 1, end: DATA_SCIENTIST.end };
  if (type === SubjectType.MACHINE_LEARNING) return { start: 1, end: MACHINE_LEARNING.end };
  if (type === SubjectType.DEEP_LEARNING) return { start: 1, end: DEEP_LEARNING.end };
  if (type === SubjectType.DATA_ENGINEER) return { start: 1, end: DATA_ENGINEER.end };
  if (type === SubjectType.BIG_DATA_ENGINEER) return { start: 1, end: BIG_DATA_ENGINEER.end };
  throw new Error('Invalid SubjectType');
};
