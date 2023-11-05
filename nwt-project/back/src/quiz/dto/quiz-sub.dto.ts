import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionSubmissionDto {
  @IsString()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  selectedAnswers: string[];
}

export class QuizSubmissionDto {
  @IsNotEmpty()
  quizId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionSubmissionDto)
  questions: QuestionSubmissionDto[];
}
