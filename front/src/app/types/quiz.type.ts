export type Quiz = {
    title: string;
    questions: Question[];
    _id?: string;
};

export type Question = {
    textQuestion: string;
    answers: Answer[];
    _id?: string;
};

export type Answer = {
    textAnswer: string;
    isCorrect: boolean;
    _id?: string;
};

export type SubmitQuiz = {
    quizId: string;
    questions: SubmitQuestion[];
};

export type SubmitQuestion = {
    questionId: string;
    selectedAnswers: string[];
};