import { IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

class IntroQuestionCreateRequestDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @ArrayNotEmpty()
  answers: string[];

  @ArrayNotEmpty()
  scores: number[];
}

class IntroQuestionUpdateRequestDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @ArrayNotEmpty()
  answers: string[];

  @ArrayNotEmpty()
  scores: number[];
}

export { IntroQuestionCreateRequestDto, IntroQuestionUpdateRequestDto };
