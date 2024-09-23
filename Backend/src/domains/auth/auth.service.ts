import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthREQ } from './request/auth-login.request';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthLoginRESP } from './response/auth-login.response';
import { AuthDTO } from './dto/auth.dto';
import { connectRelation } from 'src/shared/prisma.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(body: AuthREQ) {
    const user = await this.prismaService.user.findFirst({
      where: { username: body.username },
    });
    if (!user) {
      throw new UnauthorizedException('Username or password incorrect');
    }

    // const isMatch = await bcrypt.compare(body.password, user.password);
    const isMatch = body.password == user.password;

    if (!isMatch) throw new UnauthorizedException('Username or password incorrect');
    const registerCourseIds = (
      await this.prismaService.registerCourse.findMany({ where: { learnerId: user.id }, select: { courseId: true } })
    ).map((register) => register.courseId);

    const jwtToken = await this.jwtService.signAsync({ user: AuthDTO.fromEntity(user as any, registerCourseIds) });
    return AuthLoginRESP.fromEntity(user as any, registerCourseIds, jwtToken);
  }

  async signup(body: AuthREQ) {
    const existUser = await this.prismaService.user.findFirst({
      where: { username: body.username },
    });
    if (existUser) throw new UnauthorizedException('Username is exist');
    const user = await this.prismaService.user.create({ data: body });
    await this.prismaService.learner.create({ data: { User: connectRelation(user.id) } });

    const jwtToken = await this.jwtService.signAsync({ user: AuthDTO.fromEntity(user as any, []) });
    return AuthLoginRESP.fromEntity(user as any, [], jwtToken);
  }
}
