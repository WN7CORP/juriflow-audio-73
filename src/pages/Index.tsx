
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModules } from "@/components/CourseModules";
import { LessonList } from "@/components/LessonList";
import { LessonDetail } from "@/components/LessonDetail";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { Header } from "@/components/Header";
import { LegalProfessorChat } from "@/components/LegalProfessorChat";
import { Lesson } from "@/types/course";

const Index = () => {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentView, setCurrentView] = useState<'modules' | 'lessons' | 'lesson' | 'dashboard'>('modules');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data } = await supabase
        .from("VIDEO-AULAS-DIAS")
        .select("*")
        .order("Dia", { ascending: true })
        .order("Aula", { ascending: true });

      if (data) {
        const mappedLessons: Lesson[] = data.map(item => ({
          id: item.id,
          Dia: item.Dia || '',
          Aula: item.Aula || '',
          Tema: item.Tema || `Aula ${item.Aula}`,
          conteudo: item.conteudo || '',
          video: item.video || '',
          capa: item.capa || '',
          modulo: item.modulo || 'Módulo não informado',
          Nome: item.Tema || `Aula ${item.Aula}`,
          Link: item.video || '',
          Descricao: item.conteudo || 'Conteúdo não disponível',
          Area: item.Area || 'Área não informada'
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
    
    // Get all lessons sorted by Day and Aula
    const sortedLessons = [...allLessons].sort((a, b) => {
      const dayA = parseInt(a.Dia);
      const dayB = parseInt(b.Dia);
      if (dayA !== dayB) return dayA - dayB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < sortedLessons.length - 1) {
      const nextLesson = sortedLessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      setSelectedDay(nextLesson.Dia); // Update selected day if needed
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    
    // Get all lessons sorted by Day and Aula
    const sortedLessons = [...allLessons].sort((a, b) => {
      const dayA = parseInt(a.Dia);
      const dayB = parseInt(b.Dia);
      if (dayA !== dayB) return dayA - dayB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      const previousLesson = sortedLessons[currentIndex - 1];
      setSelectedLesson(previousLesson);
      setSelectedDay(previousLesson.Dia); // Update selected day if needed
    }
  };

  const getHasNext = () => {
    if (!selectedLesson) return false;
    
    const sortedLessons = [...allLessons].sort((a, b) => {
      const dayA = parseInt(a.Dia);
      const dayB = parseInt(b.Dia);
      if (dayA !== dayB) return dayA - dayB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex < sortedLessons.length - 1;
  };

  const getHasPrevious = () => {
    if (!selectedLesson) return false;
    
    const sortedLessons = [...allLessons].sort((a, b) => {
      const dayA = parseInt(a.Dia);
      const dayB = parseInt(b.Dia);
      if (dayA !== dayB) return dayA - dayB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView} 
        onDashboardClick={() => setCurrentView('dashboard')} 
      />
      
      <main className={`${currentView === 'lesson' ? 'pt-0' : 'pt-16'} transition-all duration-300`}>
        <div className="animate-fade-in">
          {currentView === 'modules' && (
            <CourseModules lessons={allLessons} onDayClick={handleDayClick} />
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
              hasNext={getHasNext()} 
              hasPrevious={getHasPrevious()} 
            />
          )}
          
          {currentView === 'dashboard' && (
            <ProgressDashboard onBack={handleBack} />
          )}
        </div>
      </main>

      <LegalProfessorChat currentLesson={selectedLesson} />
    </div>
  );
};

export default Index;
