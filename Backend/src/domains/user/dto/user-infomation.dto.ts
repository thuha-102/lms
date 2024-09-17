import { AccountType, BackgroundKnowledgeType, GenderType, Prisma, QualificationType, SubjectType } from '@prisma/client';
import { parseEponch } from 'src/shared/date.helper';
import { leanObject } from 'src/shared/prisma.helper';

export class UserInfoDTO {
  id: number;
  email: string;
  age: bigint;
  gender: GenderType;
  language: string;
  name: string;
  username: string;
  state: boolean;
  accountType: AccountType;

  static selectUser(): Prisma.AuthenticatedUserSelect {
    return {
      id: true,
      avatar: true,
      name: true,
      email: true,
      birth: true,
      gender: true,
      language: true,
      username: true,
      state: true,
      accountType: true,
    };
  }

  static fromEntity(
    e: Prisma.AuthenticatedUserGetPayload<{ include: { Course: true; Learner: true } }>,
    registerCourseIds?: number[],
  ) {
    const courseIds = e.Course ? e.Course.map((c) => c.id) : [];
    const qualification =
      e.Learner?.qualification === QualificationType.HIGHSCHOOL
        ? 'Phổ thông'
        : e.Learner?.qualification === QualificationType.UNDERGRADUATE
          ? 'Đại học'
          : e.Learner?.qualification === QualificationType.GRADUATE
            ? 'Sau đại học'
            : null;

    const backgroundKnowledge =
      e.Learner?.backgroundKnowledge === BackgroundKnowledgeType.BASIC
        ? 'Mới bắt đầu'
        : e.Learner?.backgroundKnowledge === BackgroundKnowledgeType.INTERMEDIATE
          ? 'Trình độ trung cấp'
          : e.Learner?.backgroundKnowledge === BackgroundKnowledgeType.EXPERT
            ? 'Chuyên gia'
            : null;

    return leanObject({
      id: e.id,
      avatar: e.avatar,
      email: e.email,
      name: e.name,
      age: parseEponch(Date.now()).year - parseEponch(e.birth).year,
      gender: e.gender,
      language: e.language,
      username: e.username,
      state: e.state,
      backgroundKnowledge: backgroundKnowledge,
      qualification: qualification,
      accountType: e.accountType,
      createdCourseIds: courseIds,
      registerCourseIds: registerCourseIds ? registerCourseIds : null,
    });
  }
}
