
import { useState, useEffect } from 'react';
import { CourseProgress, LessonProgress } from '@/types/course';

const STORAGE_KEY = 'course-progress';
const LESSON_PROGRESS_KEY = 'lesson-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<CourseProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? {
      ...JSON.parse(saved),
      completedLessons: new Set(JSON.parse(saved).completedLessons || []),
      watchTime: new Map(JSON.parse(saved).watchTime || []),
      completedModules: new Set(JSON.parse(saved).completedModules || [])
    } : { 
      completedLessons: new Set(),
      watchTime: new Map(),
      totalWatchTime: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedModules: new Set()
    };
  });

  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgress>>(() => {
    const saved = localStorage.getItem(LESSON_PROGRESS_KEY);
    return saved ? new Map(JSON.parse(saved)) : new Map();
  });

  const saveProgress = (newProgress: CourseProgress) => {
    const serializable = {
      ...newProgress,
      completedLessons: Array.from(newProgress.completedLessons),
      watchTime: Array.from(newProgress.watchTime),
      completedModules: Array.from(newProgress.completedModules)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  };

  const saveLessonProgress = (progressMap: Map<string, LessonProgress>) => {
    const serializable = Array.from(progressMap.entries());
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(serializable));
  };

  const updateWatchTime = (lessonKey: string, watchedTime: number, totalDuration: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setProgress(prev => {
      const newProgress = {
        ...prev,
        totalWatchTime: prev.totalWatchTime + watchedTime,
        lastActiveDate: today
      };
      
      const newWatchTime = new Map(prev.watchTime);
      newWatchTime.set(lessonKey, (newWatchTime.get(lessonKey) || 0) + watchedTime);
      newProgress.watchTime = newWatchTime;

      // Auto-complete lesson if watched 90% or more
      const completionRate = (newWatchTime.get(lessonKey) || 0) / totalDuration;
      if (completionRate >= 0.9 && !prev.completedLessons.has(lessonKey)) {
        newProgress.completedLessons = new Set([...prev.completedLessons, lessonKey]);
      }

      // Update streak
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (prev.lastActiveDate === yesterdayStr) {
          newProgress.streak = prev.streak + 1;
        } else {
          newProgress.streak = 1;
        }
      }

      saveProgress(newProgress);
      return newProgress;
    });

    setLessonProgress(prev => {
      const newMap = new Map(prev);
      const lessonProg: LessonProgress = {
        lessonId: lessonKey,
        watchTime: (prev.get(lessonKey)?.watchTime || 0) + watchedTime,
        totalDuration,
        completed: ((prev.get(lessonKey)?.watchTime || 0) + watchedTime) / totalDuration >= 0.9,
        lastPosition: watchedTime,
        completedAt: ((prev.get(lessonKey)?.watchTime || 0) + watchedTime) / totalDuration >= 0.9 ? new Date() : prev.get(lessonKey)?.completedAt
      };
      newMap.set(lessonKey, lessonProg);
      saveLessonProgress(newMap);
      return newMap;
    });
  };

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

  const markModuleAsCompleted = (moduleKey: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        completedModules: new Set([...prev.completedModules, moduleKey])
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

  const getLessonProgress = (lessonKey: string): LessonProgress | null => {
    return lessonProgress.get(lessonKey) || null;
  };

  const getCompletionRate = (lessonKey: string): number => {
    const lesson = lessonProgress.get(lessonKey);
    if (!lesson) return 0;
    return Math.min((lesson.watchTime / lesson.totalDuration) * 100, 100);
  };

  return {
    completedLessons: progress.completedLessons,
    completedModules: progress.completedModules,
    currentLesson: progress.currentLesson,
    totalWatchTime: progress.totalWatchTime,
    streak: progress.streak,
    watchTime: progress.watchTime,
    markAsCompleted,
    markModuleAsCompleted,
    setCurrentLesson,
    updateWatchTime,
    getLessonProgress,
    getCompletionRate,
    lessonProgress
  };
};
