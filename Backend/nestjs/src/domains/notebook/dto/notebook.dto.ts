import { Prisma, Notebook } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsString, IsBoolean, IsArray, IsInt } from 'class-validator';
import { create } from 'domain';
import { DatetimeService } from 'src/services/datetime/datetime.service';

class NotebookCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string[];

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @IsString({ each: true })
  label?: string[];

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  @IsInt({ each: true })
  modelVariationIds: number[];

  @IsArray()
  @IsInt({ each: true })
  datasetIds: number[];

  // Map from dto request to entity create input
  static toCreateInput(data: NotebookCreateRequestDto): Prisma.NotebookUncheckedCreateInput {
    const { modelVariationIds, datasetIds, ...rest } = data;
    return {
      ...rest,
      modelVariations: modelVariationIds
        ? {
            create: modelVariationIds.map((id) => ({
              modelVariation: { connect: { id: id } },
            })),
          }
        : undefined,
      datasets: datasetIds
        ? {
            create: datasetIds.map((id) => ({
              dataset: { connect: { id: id } },
            })),
          }
        : undefined,
    };
  }
}

class NotebookUpdateRequestDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string[];

  @IsBoolean()
  isPublic?: boolean;

  @IsArray()
  @IsString({ each: true })
  label?: string[];

  @IsArray()
  @IsInt({ each: true })
  modelVariationIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  datasetIds?: number[];

  @IsNumber()
  votes?: number;

  // Map from dto request to entity update input
  static toUpdateInput(data: NotebookUpdateRequestDto): Prisma.NotebookUncheckedUpdateInput {
    const { modelVariationIds, datasetIds, ...rest } = data;
    return {
      ...rest,
      ...(modelVariationIds
        ? {
            modelVariations: {
              create: modelVariationIds.map((id) => ({
                modelVariation: { connect: { id: id } },
              })),
            },
          }
        : {}),
      ...(datasetIds
        ? {
            datasets: {
              create: datasetIds.map((id) => ({
                dataset: { connect: { id: id } },
              })),
            },
          }
        : {}),
      updatedAt: new Date(),
    };
  }
}

class NotebookResponseDto {
  id: number;
  title: string;
  labels: string[];
  content?: string[];
  userId: number;
  isPublic: boolean;
  updatedAt: string;
  modelVariations?: any;
  datasets?: any;

  static fromNotebook(
    data: Notebook & { modelVariations?: any; datasets?: any },
  ): NotebookResponseDto {
    return {
      ...data,
      updatedAt: DatetimeService.formatVNTime(data.updatedAt),
    };
  }
}

export { NotebookResponseDto, NotebookCreateRequestDto, NotebookUpdateRequestDto };
