import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {Model, Types} from 'mongoose';
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

    const quizSubmission = await this.quizSubmissionModel
      .findOne({ user: userId, quiz: quizId }, 'score')
      .exec();

    const originalQuiz = await this.quizModel.findById(quizId);
    const totalScore = originalQuiz.questions.length;

    return {
      userScore: quizSubmission ? quizSubmission.score : null,
      totalScore: totalScore,
    };
  }

  async getLeaderboard(quizId: string): Promise<{ leaderboard: any[], totalScore: number }> {
    // Récupérer le quiz pour obtenir le score total (nombre de questions)
    const originalQuiz = await this.quizModel.findById(quizId);
    if (!originalQuiz) {
      throw new Error('Quiz not found');
    }
    const totalScore = originalQuiz.questions.length;

    // Construire le leaderboard sans répéter le score total
    const leaderboard = await this.quizSubmissionModel.aggregate([
      { $match: { quiz: new Types.ObjectId(quizId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 0,
          user: '$userInfo.username',
          score: 1
        }
      },
      { $sort: { score: -1, user: -1 } } // Trie par score descendant, puis par nom d'utilisateur descendant
    ]);

    // Renvoyer le leaderboard avec le score total en tant que propriété distincte
    return {
      leaderboard,
      totalScore
    };
  }

  async getQuizDetailsWithResponses(quizId: string): Promise<any[]> {
    const quiz = await this.quizModel.findById(quizId).lean(); // Utilisez `.lean()` pour obtenir un objet JavaScript simple

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return Promise.all(quiz.questions.map(async (question) => {
      const answersWithUsersPromises = question.answers.map(async (answer) => {
        // Ici, nous devons définir le type retourné par la requête après population
        interface User {
          _id: string;
          username: string; // ou tout autre champ approprié pour l'identification de l'utilisateur
        }

        interface QuizSubmissionWithUser {
          user: User;
        }

        // Effectuez la recherche et la population
        const submissions: QuizSubmissionWithUser[] = await this.quizSubmissionModel.find(
            {
              'quiz': quiz._id,
              'answers.questionId': question._id,
              'answers.selectedAnswers': answer._id,
            },
        ).populate('user', 'username').lean(); // .lean() pour obtenir des objets JavaScript simples

        // Utilisez le résultat en mappant sur le tableau `submissions`
        return {
          answerText: answer.textAnswer,
          isCorrect: answer.isCorrect,
          users: submissions.map(sub => sub.user.username), // Maintenant TypeScript devrait être content
        };
      });

      const answersWithUsers = await Promise.all(answersWithUsersPromises);

      return {
        questionText: question.textQuestion,
        answers: answersWithUsers,
      };
    }));
  }
}
