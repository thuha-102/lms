import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { leanObject } from 'src/shared/prisma.helper';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  // async getHistoryUser(field: 'month' | 'week') {
  //   const result = await this.prismaService.$queryRawUnsafe(
  //     `SELECT count(*) AS count
  //           FROM history_login
  //           WHERE DATE_TRUNC('${field}', login_time) = DATE_TRUNC('${field}', CURRENT_DATE);`,
  //   );
  //   return { todayLogin: Number((result as any)[0].count) };
  // }

  // async getHistoryLog(field: 'month' | 'week') {
  //   const result = await this.prismaService.$queryRawUnsafe(
  //     `SELECT
  //             count(*) as count
  //         FROM
  //             learner_logs
  //         WHERE
  //             DATE_TRUNC('${field}', created_at) = DATE_TRUNC('${field}', CURRENT_DATE);`,
  //   );
  //   return { todayLearnerLog: Number((result as any)[0].count) };
  // }

  // async getHistoryForum() {
  //   const thisMonthLearnerForum = await this.prismaService.$queryRawUnsafe(`
  //           SELECT
  //               forum_id,
  //               CAST(SUM(access_time) AS NUMERIC) AS total_access_time
  //           FROM
  //               history_access_forum
  //           WHERE
  //               EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()) AND
  //               EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW())
  //           GROUP BY
  //               EXTRACT(YEAR FROM created_at),
  //               EXTRACT(MONTH FROM created_at),
  //               forum_id
  //           ORDER BY total_access_time DESC
  //           LIMIT 10`);

  //   return { thisMonthLearnerForum };
  // }

  // async getHistoryRegister(idInstructor: number, field: 'month' | 'week') {
  //   const result = await this.prismaService.$queryRawUnsafe(`
  //           SELECT count(*) AS count
  //           FROM register_courses r JOIN courses c on c.id = r."courseId" JOIN authenticated_user au on au.id = c.id_instructor
  //           WHERE register_date >= date_trunc('${field}', now()) AND au.id = ${idInstructor};`);
  //   return { historyRegister: Number((result as any)[0].count) };
  // }

  // async getHistoryRegisterCourse(idInstructor: number) {
  //   const courses = await this.prismaService.course.findMany({
  //     take: 10,
  //     where: { idInstructor: idInstructor },
  //     orderBy: { RegisterCourse: { _count: 'desc' } },
  //     select: { id: true, name: true, RegisterCourse: true },
  //   });

  //   const result = courses.map((c) => ({ id: c.id, name: c.name, numberOfRegister: c.RegisterCourse.length }));
  //   return result.filter((r) => r.numberOfRegister > 0);
  // }

  async getGroupRate() {
    const group_rate: { id: number, name: string, type_learner_id: number, num_of_learners: number }[] = await this.prismaService.$queryRawUnsafe(`
        SELECT 
            tl.id, 
            tl.name, 
            t.type_learner_id, 
            t.num_of_learners 
        FROM type_learners tl
        JOIN (
            SELECT 
                COUNT(id) AS num_of_learners, 
                type_learner_id 
            FROM learners 
            GROUP BY type_learner_id
        ) AS t ON tl.id = t.type_learner_id
    `);

    // console.log(group_rate)
    const total_num_of_learners = group_rate.reduce((sum, t) => {
      const learnersCount = t.num_of_learners !== null ? Number(t.num_of_learners) : 0;
      return sum + learnersCount;
    }, 0);
    // console.log(total_num_of_learners)

    const result = group_rate.map((t) => ({
        name: t.name,
        percent_of_group: Number(t.num_of_learners)/total_num_of_learners || 0 
    }));

    return {
        total_num_of_learners,
        group_rates: result
    };
}

  async getGroupProgress() {
    const group_progress: {sequence_progress: number, type_learner_id: number, name: string }[] = await this.prismaService.$queryRawUnsafe(`
      SELECT 
          ROUND(AVG(COALESCE(ex.avg_progress, 0))::numeric, 2) AS sequence_progress, 
          ex.type_learner_id,
          type_learners.name
      FROM (
          SELECT 
              AVG(t.progress) AS avg_progress,
              sc.type_learner_id,
              sc.order,
              sc.course_id
          FROM (
              SELECT 
                  a.num_of_lessons, 
                  a.course_id, 
                  b.learner_id, 
                  b.studied_lessons, 
                  (b.studied_lessons::float / a.num_of_lessons) AS progress
              FROM (
                  SELECT 
                      COUNT(id) AS num_of_lessons, 
                      course_id
                  FROM 
                      topics
                  GROUP BY 
                      course_id
              ) AS a
              JOIN (
                  SELECT 
                      hsc.learner_id, 
                      COUNT(hsc."lessonId") AS studied_lessons, 
                      t.course_id
                  FROM 
                      history_studied_course hsc
                  JOIN 
                      topics t ON hsc."lessonId" = t.id
                  GROUP BY 
                      hsc.learner_id, 
                      t.course_id
              ) AS b ON a.course_id = b.course_id
          ) AS t
          RIGHT JOIN sequence_course sc ON t.course_id = sc.course_id
          GROUP BY 
              sc.type_learner_id, 
              sc.order, 
              sc.course_id
      ) AS ex
      JOIN type_learners
      ON ex.type_learner_id = type_learners.id
      GROUP BY 
          ex.type_learner_id, type_learners.name;
    `);
    // console.log(group_progress)
    return group_progress;
  }
}
