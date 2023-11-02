import { Document, Schema, Types } from 'mongoose';

export interface QuizSubmission extends Document {
  quiz: Types.ObjectId;
  answers: {
    questionId: Types.ObjectId;
    selectedAnswers: Types.ObjectId[];
  }[];
  score?: number;
  timestamp: Date;
}

export const QuizSubmissionSchema = new Schema({
  quiz: { type: Types.ObjectId, ref: 'Quiz', required: true },
  answers: [
    {
      questionId: { type: Types.ObjectId, required: true },
      selectedAnswers: [{ type: Types.ObjectId, required: true }],  // Note this change
    },
  ],
  score: { type: Number },
  timestamp: { type: Date, default: Date.now },
});
