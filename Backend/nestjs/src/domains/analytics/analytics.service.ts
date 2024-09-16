import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { leanObject } from 'src/shared/prisma.helper';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHistoryUser(field: 'month' | 'week') {
    const result = await this.prismaService.$queryRawUnsafe(
      `SELECT count(*) AS count
            FROM history_login
            WHERE DATE_TRUNC('${field}', login_time) = DATE_TRUNC('${field}', CURRENT_DATE);`,
    );
    return { todayLogin: Number((result as any)[0].count) };
  }

  async getHistoryLog(field: 'month' | 'week') {
    const result = await this.prismaService.$queryRawUnsafe(
          `SELECT 
              count(*) as count
          FROM 
              learner_logs
          WHERE 
              DATE_TRUNC('${field}', created_at) = DATE_TRUNC('${field}', CURRENT_DATE);`,
    );
    return { todayLearnerLog: Number((result as any)[0].count) };
  }

  async getHistoryForum() {
    const thisMonthLearnerForum = await this.prismaService.$queryRawUnsafe(`
            SELECT
                forum_id,
                CAST(SUM(access_time) AS NUMERIC) AS total_access_time
            FROM
                history_access_forum
            WHERE
                EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()) AND
                EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())
            GROUP BY
                EXTRACT(YEAR FROM created_at),
                EXTRACT(MONTH FROM created_at),
                forum_id
            ORDER BY total_access_time DESC
            LIMIT 10`);

    return { thisMonthLearnerForum };
  }

  async getHistoryRegister(idInstructor: number, field: 'month' | 'week') {
    const result = await this.prismaService.$queryRawUnsafe(`
            SELECT count(*) AS count
            FROM register_courses r JOIN courses c on c.id = r."courseId" JOIN authenticated_user au on au.id = c.id_instructor
            WHERE register_date >= date_trunc('${field}', now()) AND au.id = ${idInstructor};`);
    return { historyRegister: Number((result as any)[0].count) };
  }

  async getHistoryRegisterCourse(idInstructor: number) {
    const courses = await this.prismaService.course.findMany({
      take: 10,
      where: { idInstructor: idInstructor },
      orderBy: { RegisterCourse: { _count: 'desc' } },
      select: { id: true, name: true, RegisterCourse: true },
    });

    const result = courses.map((c) => ({ id: c.id, name: c.name, numberOfRegister: c.RegisterCourse.length }));
    return result.filter((r) => r.numberOfRegister > 0);
  }
}
