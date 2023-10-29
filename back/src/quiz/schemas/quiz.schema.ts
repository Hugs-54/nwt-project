import { Document, Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Answer extends Document {
    textAnswer: string;
    isCorrect: boolean;
}

export const AnswerSchema = new Schema({
    textAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});

export interface Question extends Document {
    textQuestion: string;
    answers: Answer[];
}

export const QuestionSchema = new Schema({
    textQuestion: { type: String, required: true },
    answers: [AnswerSchema],
});

export interface Quiz extends Document {
    title: string;
    questions: Question[];
}

export const QuizSchema = new Schema({
    title: { type: String, required: true },
    questions: [QuestionSchema],
});