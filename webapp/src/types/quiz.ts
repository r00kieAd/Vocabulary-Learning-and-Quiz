export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  vocabId: number;
  word: string;
  wordType: string;
  correctAnswer: string;
  options: QuizOption[];
}
