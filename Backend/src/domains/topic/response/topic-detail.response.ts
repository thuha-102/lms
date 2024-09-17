import { Prisma } from '@prisma/client';

export class TopicDetailRESP {
  title: string;
  preTopics: {
    id: number;
    title: string;
  }[];
  postTopics: {
    id: number;
    title: string;
  }[];

  static fromEntity(
    e: Prisma.TopicGetPayload<{ include: { StartLink: { include: { start: true } }; EndLink: { include: { end: true } } } }>,
  ) {
    return {
      title: e.title,
      preTopics: e.StartLink.map((link) => ({ id: link.start.id, title: link.start.title })),
      postTopics: e.EndLink.map((link) => ({ id: link.end.id, title: link.end.title })),
    };
  }
}
