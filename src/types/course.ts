
export interface Lesson {
  id?: number;
  Dia: string;
  Aula: string;
  Tema: string;
  conteudo?: string;
  video?: string;
  capa?: string;
  modulo?: string;
  Modulo?: string;
  Nome: string;
  Link: string;
  Descricao: string;
  Area?: string;
  capaModulos?: string;
}

export interface Module {
  day: string;
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
