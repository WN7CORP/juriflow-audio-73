export interface Lesson {
  id: number;
  Dia: string;
  Aula: string;
  Tema: string;
  video: string;
  conteudo: string;
}

export interface Module {
  day: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
}

export interface CourseProgress {
  completedLessons: Set<string>;
  currentLesson?: {
    day: string;
    lesson: string;
  };
}