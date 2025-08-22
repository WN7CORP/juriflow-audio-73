import { useState, useEffect } from 'react';
import { CourseProgress } from '@/types/course';

const STORAGE_KEY = 'course-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { completedLessons: new Set() };
  });

  // Convert Set to Array for JSON serialization
  const saveProgress = (newProgress: CourseProgress) => {
    const serializable = {
      ...newProgress,
      completedLessons: Array.from(newProgress.completedLessons)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  };

  // Load progress from localStorage and convert Array back to Set
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProgress({
        ...parsed,
        completedLessons: new Set(parsed.completedLessons || [])
      });
    }
  }, []);

  const markAsCompleted = (lessonKey: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        completedLessons: new Set([...prev.completedLessons, lessonKey])
      };
      saveProgress(newProgress);
      return newProgress;
    });
  };

  const markAsIncomplete = (lessonKey: string) => {
    setProgress(prev => {
      const newCompleted = new Set(prev.completedLessons);
      newCompleted.delete(lessonKey);
      const newProgress = {
        ...prev,
        completedLessons: newCompleted
      };
      saveProgress(newProgress);
      return newProgress;
    });
  };

  const setCurrentLesson = (day: string, lesson: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        currentLesson: { day, lesson }
      };
      saveProgress(newProgress);
      return newProgress;
    });
  };

  return {
    completedLessons: progress.completedLessons,
    currentLesson: progress.currentLesson,
    markAsCompleted,
    markAsIncomplete,
    setCurrentLesson
  };
};