import { Prisma, Dataset } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsString, IsBoolean, IsArray } from 'class-validator';
import { DatetimeService } from 'src/services/datetime/datetime.service';

class DatasetCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean | string;

  files: File[] | Blob[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  // Map from dto request to entity create input
  static toCreateInput(data: DatasetCreateRequestDto): Prisma.DatasetUncheckedCreateInput {
    const { files, ...rest } = data;
    return {
      ...rest,
      isPublic: data.isPublic === 'true' || data.isPublic === true ? true : false,
      filesType: [],
    };
  }
}

class DatasetUpdateRequestDto {
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
  static toUpdateInput(data: DatasetUpdateRequestDto): Prisma.DatasetUncheckedUpdateInput {
    return {
      ...data,
      updatedAt: new Date(),
    };
  }
}

class DatasetResponseDto {
  id: number;
  title: string;
  labels: string[];
  description: string;
  detail?: string;
  userId: number;
  isPublic: boolean;
  updatedAt: string;
  notebooks?: { notebookId: number }[];

  static fromDataset(data: Dataset & { notebooks?: { notebookId: number }[] }): DatasetResponseDto {
    return {
      ...data,
      updatedAt: DatetimeService.formatVNTime(data.updatedAt),
    };
  }
}

export { DatasetResponseDto, DatasetCreateRequestDto, DatasetUpdateRequestDto };
