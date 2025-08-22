import { useState, useEffect } from "react";
import { CourseModules } from "@/components/CourseModules";
import { LessonList } from "@/components/LessonList";
import { LessonDetail } from "@/components/LessonDetail";
import { Header } from "@/components/Header";
import { Lesson } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentView, setCurrentView] = useState<'modules' | 'lessons' | 'lesson'>('modules');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchAllLessons = async () => {
      const { data } = await supabase
        .from("VIDEO-AULAS-DIAS")
        .select("*")
        .order("Dia", { ascending: true })
        .order("Aula", { ascending: true });
      
      if (data) {
        setAllLessons(data);
      }
    };

    fetchAllLessons();
  }, []);

  const handleModuleClick = (day: string) => {
    setSelectedDay(day);
    setCurrentView('lessons');
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
  };

  const handleBack = () => {
    if (currentView === 'lesson') {
      setCurrentView('lessons');
    } else if (currentView === 'lessons') {
      setCurrentView('modules');
    }
  };

  const getCurrentDayLessons = () => {
    return allLessons.filter(lesson => lesson.Dia === selectedDay);
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    
    const currentDayLessons = getCurrentDayLessons();
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    
    if (currentIndex < currentDayLessons.length - 1) {
      setSelectedLesson(currentDayLessons[currentIndex + 1]);
    } else {
      // Next day's first lesson
      const nextDay = String(Number(selectedLesson.Dia) + 1);
      const nextDayLessons = allLessons.filter(lesson => lesson.Dia === nextDay);
      if (nextDayLessons.length > 0) {
        setSelectedDay(nextDay);
        setSelectedLesson(nextDayLessons[0]);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    
    const currentDayLessons = getCurrentDayLessons();
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    
    if (currentIndex > 0) {
      setSelectedLesson(currentDayLessons[currentIndex - 1]);
    } else {
      // Previous day's last lesson
      const prevDay = String(Number(selectedLesson.Dia) - 1);
      const prevDayLessons = allLessons.filter(lesson => lesson.Dia === prevDay);
      if (prevDayLessons.length > 0) {
        setSelectedDay(prevDay);
        setSelectedLesson(prevDayLessons[prevDayLessons.length - 1]);
      }
    }
  };

  const hasNext = () => {
    if (!selectedLesson) return false;
    const currentDayLessons = getCurrentDayLessons();
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    
    // Has next in current day or next day exists
    return currentIndex < currentDayLessons.length - 1 || 
           allLessons.some(lesson => lesson.Dia === String(Number(selectedLesson.Dia) + 1));
  };

  const hasPrevious = () => {
    if (!selectedLesson) return false;
    const currentDayLessons = getCurrentDayLessons();
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    
    // Has previous in current day or previous day exists
    return currentIndex > 0 || 
           allLessons.some(lesson => lesson.Dia === String(Number(selectedLesson.Dia) - 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {currentView === 'modules' && (
          <CourseModules onModuleClick={handleModuleClick} />
        )}
        
        {currentView === 'lessons' && (
          <LessonList 
            day={selectedDay}
            onBack={handleBack}
            onLessonClick={handleLessonClick}
          />
        )}
        
        {currentView === 'lesson' && selectedLesson && (
          <LessonDetail
            lesson={selectedLesson}
            onBack={handleBack}
            onNextLesson={handleNextLesson}
            onPreviousLesson={handlePreviousLesson}
            hasNext={hasNext()}
            hasPrevious={hasPrevious()}
          />
        )}
      </main>
    </div>
  );
};

export default Index;