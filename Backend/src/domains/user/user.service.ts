import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserCreateREQ } from './request/user-create.request';
import { UserUpdateREQ } from './request/user-update.request';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: UserCreateREQ) {
    const user = await this.prismaService.user.create({ data: UserCreateREQ.toCreateInput(body), select: { id: true } });
    return { id: user.id };
  }

  async update(id: number, body: UserUpdateREQ) {
    if (body.username) {
      const existUser = await this.prismaService.user.findFirst({ where: { username: body.username } });
      if (existUser) throw new ConflictException('Username is exist');
    }

    return await this.prismaService.user.update({ where: { id }, data: UserUpdateREQ.toUpdateInput(body) });
  }
}
