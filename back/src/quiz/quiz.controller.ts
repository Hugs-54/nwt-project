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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateQuizDto } from './dto/quiz.dto';
import { QuizSubmissionDto } from './dto/quiz-sub.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ description: 'Le quiz a été créé avec succès.' })
  @ApiBadRequestResponse({ description: 'La demande est mal formée.' })
  @ApiBody({
    type: CreateQuizDto,
    description: 'Données pour créer un nouveau quiz.',
  })
  async create(@Request() req, @Body() quizDto: Partial<Quiz>): Promise<Quiz> {
    return this.quizService.create(req.user._id, quizDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Liste de tous les quizz.' })
  async findAll(@Request() req): Promise<Quiz[]> {
    const userId = req.user._id;
    return this.quizService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-quiz')
  async getUserQuizzes(@Request() req): Promise<Quiz[]> {
    const userId = req.user._id;
    return this.quizService.findAllByUser(userId);
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
  @ApiOkResponse({ description: 'Le quiz a été supprimé avec succès.' })
  @ApiNotFoundResponse({ description: 'Aucun quiz trouvé pour cet ID.' })
  @ApiParam({ name: 'id', description: 'ID du quiz à supprimer.' })
  async delete(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Le réponse au quiz a été enregistrer avec succès.',
  })
  @Post('submit-quiz')
  async submitQuiz(
    @Request() req,
    @Body() quizSubmissionDto: QuizSubmissionDto,
  ): Promise<any> {
    const userId = req.user._id;
    const result = await this.quizService.evaluateSubmission(
      userId,
      quizSubmissionDto,
    );
    await this.quizService.saveSubmission(userId, quizSubmissionDto, result);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: "Le score de l'utilisation pour un quiz",
  })
  @ApiParam({ name: 'id', description: 'ID du quiz.' })
  @Get('/:quizId/score')
  async getUserQuizScore(
    @Request() req,
    @Param('quizId') quizId: string,
  ): Promise<{ userScore: number | null; totalScore: number }> {
    const userId = req.user._id;
    return this.quizService.findUserQuizScore(userId, quizId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Le classement pour un quiz',
  })
  @ApiParam({ name: 'id', description: 'ID du quiz.' })
  @Get('/:quizId/leaderboard')
  async getQuizLeaderboard(
    @Param('quizId') quizId: string,
  ): Promise<{ leaderboard: any[]; totalScore: number }> {
    return await this.quizService.getLeaderboard(quizId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Le détails des réponses données pour un quiz',
  })
  @ApiParam({ name: 'id', description: 'ID du quiz.' })
  @Get('/:quizId/details')
  async getQuizDetailsWithResponses(
    @Param('quizId') quizId: string,
  ): Promise<any> {
    return this.quizService.getQuizDetailsWithResponses(quizId);
  }
}
