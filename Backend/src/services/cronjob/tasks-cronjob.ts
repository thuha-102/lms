import { flatten, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly prismaService = new PrismaService();

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async statisticsLearningMaterial() {
    const learningMaterials = await this.prismaService.learningMaterial.findMany({ select: { id: true, Lesson: true } });
    const updatePromises = learningMaterials.map((lesson): Promise<any> => {
      return this.prismaService.learningMaterial.update({ where: { id: lesson.id }, data: { usedCount: lesson.Lesson.length } });
    });
    await Promise.all(updatePromises);

    this.logger.debug('Usage Statistics for Learning Materials');
  }


  @Cron(CronExpression.EVERY_12_HOURS)
  async updateStateOfReceipt() {

    const [registeredCourse, unpaidReceipts] = await Promise.all([
      this.prismaService.registerCourse.findMany({select: {learnerId: true, courseId: true}}),
      this.prismaService.receipt.findMany({where: {isPayment: false}, select: {id: true, learnerId: true, Course: {select: {id: true}}}})
    ]);

    if (registeredCourse.length === 0 || unpaidReceipts.length === 0) {
      this.logger.debug('Nothing when updated state of payment');
      return;
    }

    const paidLearnerRecipients: {[key: number]: number[]} = registeredCourse.reduce((acc, { learnerId, courseId }) => {
      if (!acc[learnerId]) acc[learnerId] = [];
      acc[learnerId].push(courseId);
      return acc;
    }, {});

    const unPaidLearnerRecipients: {[key: number]: {id: number, courses: number[]}} = unpaidReceipts.reduce((acc, { id, learnerId, Course }) => {
      if (!acc[learnerId]) acc[learnerId] = [];
      acc[learnerId].push({
        id: id,
        courses: [...Course.map(course => course.id)]
      });
      return acc;
    }, {});

    const promisCancel: Promise<any>[] = []
    for (const [key, value] of Object.entries(paidLearnerRecipients)) {
      if (!unPaidLearnerRecipients[key]) continue;

      const willCancelReceipt = (unPaidLearnerRecipients[key] as {id: number, courses: number[]} [] ).filter(unPaid => unPaid.courses.some(id => value.includes(id)));

      promisCancel.push(...willCancelReceipt.map(receipt => this.prismaService.receipt.update({where: {id: receipt.id}, data: {isPayment: true, note: "Payment failed because one or more courses are already registered."}})))
    }

    await Promise.all(promisCancel);
    this.logger.debug('Updated state of payment');
  }
}
