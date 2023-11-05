import { IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @IsString()
  @ApiProperty({ description: 'Texte de la réponse' })
  textAnswer: string;

  @IsBoolean()
  @ApiProperty({ description: 'Indique si la réponse est correcte ou non' })
  isCorrect: boolean;
}

export class QuestionDto {
  @IsString()
  @ApiProperty({ description: 'Texte de la question' })
  textQuestion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @ApiProperty({ type: [AnswerDto], description: 'Liste des réponses' })
  answers: AnswerDto[];
}

export class CreateQuizDto {
  @IsString()
  @ApiProperty({ description: 'Titre du quiz' })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto], description: 'Liste des questions' })
  questions: QuestionDto[];
}
