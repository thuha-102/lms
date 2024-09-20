import { Prisma, Statement } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

class StatementCreateRequestDto {
  @IsNumber()
  statementId?: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  forumId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  // Map from dto request to entity create input
  static toCreateInput(data: StatementCreateRequestDto): Prisma.StatementUncheckedCreateInput {
    return {
      ...data,
    };
  }
}

class StatementUpdateRequestDto {
  @IsString()
  content: string;

  // Map from dto request to entity update input
  static toUpdateInput(data: StatementUpdateRequestDto): Prisma.StatementUncheckedUpdateInput {
    return {
      ...data,
      updatedAt: new Date(),
    };
  }
}

class StatementResponseDto {
  id: number;
  content: string;
  updatedAt: Date;
  userId: number;
  statementId: number;
  forumId: number;

  // Map from Forum entity to dto
  static fromForum(data: Statement): StatementResponseDto {
    return {
      ...data,
    };
  }
}

export { StatementResponseDto, StatementCreateRequestDto, StatementUpdateRequestDto };
