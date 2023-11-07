import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

class QuestionSubmissionDto {
  @IsString()
  @ApiProperty({ description: 'Id de la question' })
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Liste des id des réponses sélectionné de la question' })
  selectedAnswers: string[];
}

export class QuizSubmissionDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Id du quiz' })
  quizId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionSubmissionDto)
  @ApiProperty({ description: 'Liste des réponses' })
  questions: QuestionSubmissionDto[];
}
