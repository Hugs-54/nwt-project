import { QuizSubmissionSchema } from './schemas/quiz-sub.schema';
import { QuizSchema } from './schemas/quiz.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'QuizSubmission', schema: QuizSubmissionSchema },
    ]),
    AuthModule,
  ],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
