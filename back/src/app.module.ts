import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [QuizModule, MongooseModule.forRoot('mongodb://0.0.0.0:27017/nwt')],
})
export class AppModule {}
