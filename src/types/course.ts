
export interface Lesson {
  id?: number;
  Dia: string;
  Aula: string;
  Tema: string;
  conteudo?: string;
  video?: string;
  capa?: string;
  Area?: string;
  Modulo?: string;
  modulo?: string; // Mantendo compatibilidade
}

export interface Question {
  id: number;
  pergunta: string;
  resposta: string;
  'Alternativa a': string;
  'Alternativa b': string;
  'Alternativa c': string;
  'Alternativa d': string;
  Aula: string;
}

export interface Module {
  area: string;
  modulo: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  coverImage?: string;
  duration?: number;
  isNew?: boolean;
}

export interface CourseProgress {
  completedLessons: Set<string>;
  watchTime: Map<string, number>;
  currentLesson?: {
    day: string;
    lesson: string;
  };
  totalWatchTime: number;
  streak: number;
  lastActiveDate: string;
  completedModules: Set<string>;
}

export interface LessonProgress {
  lessonId: string;
  watchTime: number;
  totalDuration: number;
  completed: boolean;
  lastPosition: number;
  completedAt?: Date;
}

export interface UserStats {
  totalWatchTime: number;
  lessonsCompleted: number;
  currentStreak: number;
  totalLessons: number;
  completionRate: number;
  weeklyGoal: number;
  weeklyProgress: number;
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
