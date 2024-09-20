import { Prisma, ModelVariation, Framework } from '@prisma/client';
import { ArrayNotEmpty, IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { DatetimeService } from 'src/services/datetime/datetime.service';

class ModelVariationCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  framework: Framework;

  @IsNotEmpty()
  @IsString()
  slugName: string;

  @IsNotEmpty()
  @IsNumber()
  version: number;

  @IsNotEmpty()
  @IsNumber()
  modelId: number;

  files: any;

  // Map from dto request to entity create input
  static toCreateInput(data: ModelVariationCreateRequestDto): Prisma.ModelVariationUncheckedCreateInput {
    const { files, ...rest } = data;
    return {
      ...rest,
      filesType: [],
    };
  }
}

class ModelVariationUpdateRequestDto {
  @IsString()
  description?: string;

  @IsString()
  exampleUse?: string;

  // Map from dto request to entity update input
  static toUpdateInput(data: ModelVariationUpdateRequestDto): Prisma.ModelVariationUncheckedUpdateInput {
    return {
      ...data,
      updatedAt: new Date(),
    };
  }
}

class ModelVariationResponseDto {
  id: number;
  filesType: string[];
  framework: Framework;
  slugName: string;
  version: number;
  description: string;
  modelId: number;
  exampleUse: string;
  updatedAt: string;

  // Map from Forum entity to dto
  static fromModelVariation(data: ModelVariation): ModelVariationResponseDto {
    return {
      ...data,
      updatedAt: DatetimeService.formatVNTime(data.updatedAt),
    };
  }
}

export { ModelVariationResponseDto, ModelVariationCreateRequestDto, ModelVariationUpdateRequestDto };
