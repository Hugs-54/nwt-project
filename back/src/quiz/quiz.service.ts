import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizSubmission } from './schemas/quiz-sub.schema';
import { QuizSubmissionDto } from './dto/quiz-sub.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('QuizSubmission')
    private readonly quizSubmissionModel: Model<QuizSubmission>,
  ) {}

  async create(userId: string, data: Partial<Quiz>): Promise<Quiz> {
    const createdQuiz = new this.quizModel({
      ...data, // Spreading the existing data
      user: userId, // Adding the userId to the quiz data
    });
    return createdQuiz.save();
  }

  async findAll(userId: string): Promise<Quiz[]> {
    return this.quizModel.find({ user: { $ne: userId } }).exec();
  }

  async findAllByUser(userId: string): Promise<Quiz[]> {
    return this.quizModel.find({ user: userId }).exec(); // Find quizzes where the user field matches the userId
  }

  async findById(id: string): Promise<Quiz> {
    try {
      return await this.quizModel.findById(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    try {
      return await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
        new: true,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Quiz> {
    try {
      return await this.quizModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new NotFoundException(`Quiz with ID ${id} not found`);
      }
      throw error;
    }
  }

  async saveSubmission(
    userId: string,
    quizSubmissionDto: QuizSubmissionDto,
    score: number,
  ): Promise<QuizSubmission> {
    const submission = new this.quizSubmissionModel({
      user: userId,
      quiz: quizSubmissionDto.quizId,
      answers: quizSubmissionDto.questions.map((questionSubmission) => ({
        questionId: questionSubmission.questionId,
        selectedAnswers: questionSubmission.selectedAnswers,
      })),
      score: score,
    });
    return submission.save();
  }

  async evaluateSubmission(
    userId: string,
    quizSubmissionDto: QuizSubmissionDto,
  ): Promise<number> {
    // Récupérer le quiz original à partir de quizId
    const originalQuiz = await this.findById(quizSubmissionDto.quizId);

    let totalCorrect = 0;

    // Parcourir chaque soumission de question par l'utilisateur
    for (const userQuestionSubmission of quizSubmissionDto.questions) {
      // Trouver la question originale correspondante
      const originalQuestion = originalQuiz.questions.find(
        (q) => q._id.toString() === userQuestionSubmission.questionId,
      );

      if (
        this.evaluateQuestion(
          originalQuestion,
          userQuestionSubmission.selectedAnswers,
        )
      ) {
        totalCorrect++;
      }
    }

    return totalCorrect;
  }

  evaluateQuestion(originalQuestion, selectedAnswerIds: string[]): boolean {
    // Obtenir toutes les bonnes réponses pour la question originale
    const correctAnswerIds = originalQuestion.answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer._id.toString()); // convertir en chaîne pour la comparaison

    // Vérifier que l'utilisateur a sélectionné toutes les bonnes réponses (et seulement les bonnes réponses)
    return this.arraysEqual(correctAnswerIds, selectedAnswerIds);
  }

  arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;

    // Tri et comparaison
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }

    return true;
  }

  async findUserQuizScore(
    userId: string,
    quizId: string,
  ): Promise<{ userScore: number | null; totalScore: number }> {
    console.log(
      `Recherche de la soumission pour l'utilisateur ${userId} et le quiz ${quizId}`,
    );

    const quizSubmission = await this.quizSubmissionModel
      .findOne({ user: userId, quiz: quizId }, 'score')
      .exec();

    if (!quizSubmission) {
      console.log('Aucune soumission trouvée pour cet utilisateur et ce quiz');
    } else {
      console.log(`Score trouvé pour l'utilisateur: ${quizSubmission.score}`);
    }

    const originalQuiz = await this.quizModel.findById(quizId);
    const totalScore = originalQuiz.questions.length;

    console.log(`Score total pour le quiz: ${totalScore}`);

    return {
      userScore: quizSubmission ? quizSubmission.score : null,
      totalScore: totalScore,
    };
  }

  async getTotalQuizScore(quizId: string): Promise<number> {
    // Récupérer le quiz original à partir de quizId
    const originalQuiz = await this.findById(quizId);

    // Le score total possible est le nombre de questions dans le quiz
    return originalQuiz.questions.length;
  }
}
