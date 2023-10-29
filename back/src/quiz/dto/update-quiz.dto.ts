import { IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuizDto {
  @IsString()
  readonly title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionUpdateDto)
  readonly questions: QuestionUpdateDto[];
}

export class QuestionUpdateDto {
  @IsString()
  textQuestion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerUpdateDto)
  answers: AnswerUpdateDto[];
}

export class AnswerUpdateDto {
  @IsString()
  textAnswer: string;

  @IsBoolean()
  isCorrect: boolean;
}
