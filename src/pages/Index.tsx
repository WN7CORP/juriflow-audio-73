import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModules } from "@/components/CourseModules";
import { LessonList } from "@/components/LessonList";
import { LessonDetail } from "@/components/LessonDetail";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { Header } from "@/components/Header";
import { Lesson } from "@/types/course";
const Index = () => {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentView, setCurrentView] = useState<'modules' | 'lessons' | 'lesson' | 'dashboard'>('modules');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    const fetchLessons = async () => {
      const {
        data
      } = await supabase.from("VIDEO-AULAS-DIAS").select("*").order("Dia", {
        ascending: true
      }).order("Aula", {
        ascending: true
      });
      if (data) {
        // Map Supabase data to Lesson interface
        const mappedLessons: Lesson[] = data.map(item => ({
          ...item,
          Nome: item.Tema || `Aula ${item.Aula}`,
          Link: item.video || '',
          Descricao: item.conteudo || 'Conteúdo não disponível'
        }));
        setAllLessons(mappedLessons);
      }
    };
    fetchLessons();
  }, []);
  const handleDayClick = (day: string) => {
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
    } else if (currentView === 'dashboard') {
      setCurrentView('modules');
    }
  };
  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentDayLessons = allLessons.filter(l => l.Dia === selectedLesson.Dia);
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < currentDayLessons.length - 1) {
      setSelectedLesson(currentDayLessons[currentIndex + 1]);
    }
  };
  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentDayLessons = allLessons.filter(l => l.Dia === selectedLesson.Dia);
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(currentDayLessons[currentIndex - 1]);
    }
  };
  const getHasNext = () => {
    if (!selectedLesson) return false;
    const currentDayLessons = allLessons.filter(l => l.Dia === selectedLesson.Dia);
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex < currentDayLessons.length - 1;
  };
  const getHasPrevious = () => {
    if (!selectedLesson) return false;
    const currentDayLessons = allLessons.filter(l => l.Dia === selectedLesson.Dia);
    const currentIndex = currentDayLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex > 0;
  };
  return <div className="min-h-screen bg-background">
      <Header currentView={currentView} onDashboardClick={() => setCurrentView('dashboard')} />
      
      <main className="pt-16 px-0 mx-0 my-0 py-0">
        {currentView === 'modules' && <CourseModules lessons={allLessons} onDayClick={handleDayClick} />}
        
        {currentView === 'lessons' && <LessonList day={selectedDay} onBack={handleBack} onLessonClick={handleLessonClick} />}
        
        {currentView === 'lesson' && selectedLesson && <LessonDetail lesson={selectedLesson} onBack={handleBack} onNextLesson={handleNextLesson} onPreviousLesson={handlePreviousLesson} hasNext={getHasNext()} hasPrevious={getHasPrevious()} />}
        
        {currentView === 'dashboard' && <ProgressDashboard onBack={handleBack} />}
      </main>
    </div>;
};
export default Index;