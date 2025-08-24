
export interface Question {
  id: number;
  pergunta: string;
  resposta: string; // Número da alternativa correta (a, b, c, d)
  'Alternativa a': string;
  'Alternativa b': string;
  'Alternativa c': string;
  'Alternativa d': string;
  Aula: string;
}

export interface QuestionAttempt {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface QuestionProgress {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  questionsAnswered: Set<number>;
}
