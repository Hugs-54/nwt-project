import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './schemas/quiz.schema';
import { UpdateQuizDto } from './Dto/update-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() quizDto: Partial<Quiz>): Promise<Quiz> {
    return this.quizService.create(quizDto);
  }

  @Get()
  async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.delete(id);
  }
}
