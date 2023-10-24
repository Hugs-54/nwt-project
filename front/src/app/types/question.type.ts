export type Quiz = {
    title: string;
    questions: Question[];
};

export type Question = {
    textQuestion: string;
    answers: Answer[];
};

export type Answer = {
    textAnswer: string;
    isCorrect: boolean;
    isSelected?: boolean;
};