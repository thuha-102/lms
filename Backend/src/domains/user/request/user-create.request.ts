import { AccountType, BackgroundKnowledgeType, GenderType, Prisma, QualificationType } from '@prisma/client';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { timeEponch } from 'src/shared/date.helper';
import { leanObject } from 'src/shared/prisma.helper';

export class UserCreateREQ {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(GenderType)
  gender: GenderType;

  @IsString()
  birth: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  refeshToken: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsOptional()
  @IsBoolean()
  priorTest: boolean = false;

  @IsOptional()
  @IsArray()
  learningStyleQA: string[] = null;

  @IsOptional()
  @IsEnum(BackgroundKnowledgeType)
  backgroundKnowledge: BackgroundKnowledgeType = BackgroundKnowledgeType.BASIC;

  @IsOptional()
  @IsEnum(QualificationType)
  qualification: QualificationType = QualificationType.HIGHSCHOOL;

  static toCreateInput(body: UserCreateREQ): Prisma.AuthenticatedUserCreateInput {
    return {
      email: body.email,
      name: body.name,
      birth: body.birth ? timeEponch(body.birth) : null,
      gender: body.gender ? body.gender : GenderType.UNKNOWN,
      language: body.language,
      lastLogin: Date.now(),
      lastLogout: Date.now(),
      password: body.password,
      username: body.username,
      refeshToken: body.refeshToken,
      accountType: body.accountType,
    };
  }
}
