import { IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateQuizDto {
  @IsString()
  @ApiProperty({ description: 'Titre du quiz' })
  readonly title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionUpdateDto)
  @ApiProperty({ description: 'Liste de questions du quiz' })
  readonly questions: QuestionUpdateDto[];
}

export class QuestionUpdateDto {
  @IsString()
  @ApiProperty({ description: 'Texte de la question' })
  textQuestion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerUpdateDto)
  @ApiProperty({ description: 'Liste de réponses de la question' })
  answers: AnswerUpdateDto[];
}

export class AnswerUpdateDto {
  @IsString()
  @ApiProperty({ description: 'Texte de la réponse' })
  textAnswer: string;

  @IsBoolean()
  @ApiProperty({ description: 'Validité de la réponse' })
  isCorrect: boolean;
}
