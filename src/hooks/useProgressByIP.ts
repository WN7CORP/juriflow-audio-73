
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LessonProgressByIP {
  id?: string;
  user_ip: string;
  lesson_id: number;
  progress_percent: number;
  last_position: number;
  watch_time: number;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useProgressByIP = () => {
  const [userIP, setUserIP] = useState<string>('');
  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgressByIP>>(new Map());

  // Get user IP address
  useEffect(() => {
    const getIP = async () => {
      try {
        // Try to get IP from ipify API
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip || 'unknown');
      } catch (error) {
        console.error('Error getting IP:', error);
        // Fallback to a random identifier stored in localStorage
        let fallbackIP = localStorage.getItem('fallback_user_id');
        if (!fallbackIP) {
          fallbackIP = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('fallback_user_id', fallbackIP);
        }
        setUserIP(fallbackIP);
      }
    };

    getIP();
  }, []);

  const updateLessonProgress = async (
    lessonId: string, 
    progressPercent: number, 
    currentTime: number, 
    totalDuration: number
  ) => {
    if (!userIP || !lessonId) return;

    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) return;

    const watchTime = (progressPercent / 100) * totalDuration;
    const completed = progressPercent >= 90;

    const progressData: Partial<LessonProgressByIP> = {
      user_ip: userIP,
      lesson_id: lessonIdNum,
      progress_percent: Math.round(progressPercent * 100) / 100, // Round to 2 decimals
      last_position: Math.round(currentTime * 100) / 100,
      watch_time: Math.round(watchTime * 100) / 100,
      completed
    };

    try {
      const { data, error } = await supabase
        .from('lesson_progress_by_ip')
        .upsert(progressData, {
          onConflict: 'user_ip,lesson_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return;
      }

      if (data) {
        setLessonProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(lessonId, data);
          return newMap;
        });
      }
    } catch (error) {
      console.error('Error in updateLessonProgress:', error);
    }
  };

  const getLessonProgress = async (lessonId: string): Promise<LessonProgressByIP | null> => {
    if (!userIP || !lessonId) return null;

    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) return null;

    // Check cache first
    const cached = lessonProgress.get(lessonId);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('lesson_progress_by_ip')
        .select('*')
        .eq('user_ip', userIP)
        .eq('lesson_id', lessonIdNum)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching progress:', error);
        return null;
      }

      if (data) {
        setLessonProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(lessonId, data);
          return newMap;
        });
        return data;
      }
    } catch (error) {
      console.error('Error in getLessonProgress:', error);
    }

    return null;
  };

  const getCompletionRate = (lessonId: string): number => {
    const progress = lessonProgress.get(lessonId);
    return progress ? progress.progress_percent : 0;
  };

  const isCompleted = (lessonId: string): boolean => {
    const progress = lessonProgress.get(lessonId);
    return progress ? progress.completed : false;
  };

  return {
    userIP,
    updateLessonProgress,
    getLessonProgress,
    getCompletionRate,
    isCompleted,
    lessonProgress
  };
};
