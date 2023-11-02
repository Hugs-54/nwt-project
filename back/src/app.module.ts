import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    QuizModule,
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/nwt'),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
