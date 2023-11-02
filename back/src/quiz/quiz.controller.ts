import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './schemas/quiz.schema';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateQuizDto } from './dto/quiz.dto';
import { QuizSubmissionDto } from './dto/quiz-sub.dto';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Le quiz a été créé avec succès.' })
  @ApiBadRequestResponse({ description: 'La demande est mal formée.' })
  @ApiBody({
    type: CreateQuizDto,
    description: 'Données pour créer un nouveau quiz.',
  })
  async create(@Body() quizDto: Partial<Quiz>): Promise<Quiz> {
    return this.quizService.create(quizDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Liste de tous les quizz.' })
  async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @ApiOkResponse({ description: 'Retourne le quiz par ID.' })
  @ApiNotFoundResponse({ description: 'Aucun quiz trouvé pour cet ID.' })
  @ApiParam({ name: 'id', description: 'ID du quiz' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findById(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Le quiz a été mis à jour avec succès.' })
  @ApiNotFoundResponse({ description: 'Aucun quiz trouvé pour cet ID.' })
  @ApiBadRequestResponse({ description: 'La demande est mal formée.' })
  @ApiUnprocessableEntityResponse({
    description: 'Les données fournies sont invalides.',
  })
  @ApiParam({ name: 'id', description: 'ID du quiz à mettre à jour.' })
  @ApiBody({
    type: UpdateQuizDto,
    description: 'Données pour mettre à jour le quiz.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Le quiz a été supprimé avec succès.' })
  @ApiNotFoundResponse({ description: 'Aucun quiz trouvé pour cet ID.' })
  @ApiParam({ name: 'id', description: 'ID du quiz à supprimer.' })
  async delete(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-quiz')
  async submitQuiz(
    @Request() req,
    @Body() quizSubmissionDto: QuizSubmissionDto,
  ): Promise<any> {
    const userId = req.user.userId; // Récupération de l'ID utilisateur à partir du token
    const result = await this.quizService.evaluateSubmission(
      userId,
      quizSubmissionDto,
    );
    await this.quizService.saveSubmission(userId, quizSubmissionDto);
    return result;
  }
}
