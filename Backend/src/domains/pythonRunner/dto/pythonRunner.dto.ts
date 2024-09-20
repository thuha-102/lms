import { IsNotEmpty, IsString, IsArray } from 'class-validator';

class PythonRunnerRequestDto {
  @IsArray()
  @IsString({ each: true })
  inputModelFiles?: string[];

  @IsArray()
  @IsString({ each: true })
  inputDatasetFiles?: string[];

  @IsArray()
  @IsString({ each: true })
  inputTestFile?: string[];

  @IsNotEmpty()
  @IsString()
  code: string;
}

export { PythonRunnerRequestDto };
