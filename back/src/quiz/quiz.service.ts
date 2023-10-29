import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel('Quiz') private readonly quizModel: Model<Quiz>) {}

  async create(data: Partial<Quiz>): Promise<Quiz> {
    const createdQuiz = new this.quizModel(data);
    return createdQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
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
}
