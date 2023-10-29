import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://0.0.0.0:27017/nwt'), QuizModule],
})
export class AppModule {}
