import { Prisma, Model, ModelVariation } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsString, IsBoolean, IsArray } from 'class-validator';
import { DatetimeService } from 'src/services/datetime/datetime.service';

class ModelCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  // Map from dto request to entity create input
  static toCreateInput(data: ModelCreateRequestDto): Prisma.ModelUncheckedCreateInput {
    return {
      ...data,
    };
  }
}

class ModelUpdateRequestDto {
  @IsString()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  label?: string[];

  @IsString()
  description?: string;

  @IsString()
  detail?: string;

  @IsBoolean()
  isPublic?: boolean;

  @IsNumber()
  votes?: number;

  @IsNumber()
  downloadCount?: number;

  // Map from dto request to entity update input
  static toUpdateInput(data: ModelUpdateRequestDto): Prisma.ModelUncheckedUpdateInput {
    return {
      ...data,
      updatedAt: new Date(),
    };
  }
}

class ModelResponseDto {
  id: number;
  title: string;
  labels: string[];
  description: string;
  detail?: string;
  userId: number;
  isPublic: boolean;
  updatedAt: string;
  modelVariations?: ModelVariation[];
  notebooks?: { notebookId: number }[];

  static fromModel(data: Model & { modelVariations?: ModelVariation[]; notebooks?: { notebookId: number }[] }): ModelResponseDto {
    return {
      ...data,
      updatedAt: DatetimeService.formatVNTime(data.updatedAt),
    };
  }
}

export { ModelResponseDto, ModelCreateRequestDto, ModelUpdateRequestDto };
