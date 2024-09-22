import { IsNotEmpty, IsString, ArrayNotEmpty, IsInt, IsNumber } from 'class-validator';

class SequenceCoursesCreateRequestDto {
  @ArrayNotEmpty()
  courseIds: number[];

  @IsString()
  @IsNotEmpty()
  typeLearnerName: string;

  @IsNumber()
  typeLearnerStartScore: number;
}

class SequenceCoursesUpdateRequestDto {
  @ArrayNotEmpty()
  courseIds?: number[];

  @IsString()
  @IsNotEmpty()
  typeLearnerName?: string;

  @IsNumber()
  typeLearnerStartScore?: number;
}

class SequenceCoursesResponseDto {
  courses: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
  }[];
  typeLearnerId: number;
  typeLearnerName: string;
  typeLearnerStartScore: number;
}

export { SequenceCoursesCreateRequestDto, SequenceCoursesUpdateRequestDto, SequenceCoursesResponseDto };