import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserCreateREQ } from './request/user-create.request';
import { UserUpdateREQ } from './request/user-update.request';
import { UserRegisterCourseCreateREQ } from './request/user-register-course-create.request';
import { connectRelation } from 'src/shared/prisma.helper';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  // async create(body: UserCreateREQ) {
  //   const user = await this.prismaService.user.create({ data: UserCreateREQ.toCreateInput(body), select: { id: true } });
  //   const learner = await this.prismaService.learner.create({ data: { User: connectRelation(user.id)}, select: {id:  true} });

  //   return { id: user.id };
  // }

  async update(id: number, body: UserUpdateREQ) {
    if (body.username) {
      const existUser = await this.prismaService.user.findFirst({ where: { username: body.username } });
      if (existUser) throw new ConflictException('Username is exist');
    }

    await this.prismaService.user.update({ where: { id }, data: UserUpdateREQ.toUpdateInput(body) });
    return;
  }

  async registerCourse(learnerId: number, courseId: number) {
    return await this.prismaService.registerCourse.create({
      data: UserRegisterCourseCreateREQ.toCreateInput(learnerId, courseId),
    });
  }
}
