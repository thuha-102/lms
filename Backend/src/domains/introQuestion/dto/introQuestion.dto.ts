import { IsNotEmpty, IsString, ArrayNotEmpty, IsNumber } from 'class-validator';

class IntroQuestionCreateRequestDto {
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  question: string;

  @ArrayNotEmpty()
  answers: string[];

  @ArrayNotEmpty()
  scores: number[];
}

class IntroQuestionUpdateRequestDto {
  @IsNumber()
  order?: number;

  @IsNotEmpty()
  @IsString()
  question?: string;

  @ArrayNotEmpty()
  answers?: string[];

  @ArrayNotEmpty()
  scores?: number[];
}

export { IntroQuestionCreateRequestDto, IntroQuestionUpdateRequestDto };
