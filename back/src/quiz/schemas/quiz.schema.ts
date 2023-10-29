import { Document, Schema } from 'mongoose';

export interface Answer extends Document {
  textAnswer: string;
  isCorrect: boolean;
}

export const AnswerSchema = new Schema({
  textAnswer: { type: String, required: true, minlength: 1, maxlength: 300 },
  isCorrect: { type: Boolean, required: true },
});

export interface Question extends Document {
  textQuestion: string;
  answers: Answer[];
}

export const QuestionSchema = new Schema({
  textQuestion: { type: String, required: true, minlength: 1, maxlength: 500 },
  answers: [AnswerSchema],
});

export interface Quiz extends Document {
  title: string;
  questions: Question[];
}

export const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
      index: true,
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  },
);
