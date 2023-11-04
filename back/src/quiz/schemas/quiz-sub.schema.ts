import { Document, Schema, Types } from 'mongoose';

export interface QuizSubmission extends Document {
  user: Types.ObjectId;
  quiz: Types.ObjectId;
  answers: {
    questionId: Types.ObjectId;
    selectedAnswers: Types.ObjectId[];
  }[];
  score: number;
  timestamp: Date;
}

export const QuizSubmissionSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  quiz: { type: Types.ObjectId, ref: 'Quiz', required: true },
  answers: [
    {
      questionId: { type: Types.ObjectId, required: true },
      selectedAnswers: [{ type: Types.ObjectId, required: true }],
    },
  ],
  score: { type: Number },
  timestamp: { type: Date, default: Date.now },
});
