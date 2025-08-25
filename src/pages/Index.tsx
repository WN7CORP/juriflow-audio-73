
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModules } from "@/components/CourseModules";
import { LessonList } from "@/components/LessonList";
import { LessonDetail } from "@/components/LessonDetail";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { Header } from "@/components/Header";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { LegalProfessorChat } from "@/components/LegalProfessorChat";
import { Lesson } from "@/types/course";

const Index = () => {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentView, setCurrentView] = useState<'modules' | 'lessons' | 'lesson' | 'dashboard'>('modules');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');

  useEffect(() => {
    const fetchLessons = async () => {
      console.log("Fetching lessons from VIDEO-AULAS-DIAS...");
      
      const { data, error } = await supabase
        .from("VIDEO-AULAS-DIAS")
        .select("*")
        .order("Modulo", { ascending: true })
        .order("Aula", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error);
        return;
      }

      console.log("Raw data from Supabase:", data);

      if (data) {
        // Use type assertion para acessar as propriedades reais da base de dados
        const mappedLessons: Lesson[] = data.map((item: any, index) => ({
          id: item.id,
          Dia: String(index + 1), // Keep for backward compatibility but not used for grouping
          Aula: item.Aula || '',
          Tema: item.Tema || `Aula ${item.Aula}`,
          conteudo: item.conteudo || '',
          video: item.video || '',
          capa: item.capa || '',
          modulo: item.Modulo || 'Módulo não informado',
          Modulo: item.Modulo || 'Módulo não informado',
          Nome: item.Tema || `Aula ${item.Aula}`,
          Link: item.video || '',
          Descricao: item.conteudo || 'Conteúdo não disponível',
          Area: item.Area || 'Área não informada',
          capaModulos: item["capa-modulos"] || '',
          material: item.material || '' // Added material field
        }));
        
        console.log("Mapped lessons:", mappedLessons);
        setAllLessons(mappedLessons);
      }
    };
    
    fetchLessons();
  }, []);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
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
      setSearchTerm(''); // Reset search when going back to modules
      setSelectedArea('Todas'); // Reset area filter
    } else if (currentView === 'dashboard') {
      setCurrentView('modules');
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    
    // Get all lessons sorted by Modulo and Aula
    const sortedLessons = [...allLessons].sort((a, b) => {
      const moduloA = parseInt(a.Modulo || '0');
      const moduloB = parseInt(b.Modulo || '0');
      if (moduloA !== moduloB) return moduloA - moduloB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < sortedLessons.length - 1) {
      const nextLesson = sortedLessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      setSelectedModule(nextLesson.Modulo || nextLesson.Dia); // Use Modulo for navigation
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    
    // Get all lessons sorted by Modulo and Aula
    const sortedLessons = [...allLessons].sort((a, b) => {
      const moduloA = parseInt(a.Modulo || '0');
      const moduloB = parseInt(b.Modulo || '0');
      if (moduloA !== moduloB) return moduloA - moduloB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      const previousLesson = sortedLessons[currentIndex - 1];
      setSelectedLesson(previousLesson);
      setSelectedModule(previousLesson.Modulo || previousLesson.Dia); // Use Modulo for navigation
    }
  };

  const getHasNext = () => {
    if (!selectedLesson) return false;
    
    const sortedLessons = [...allLessons].sort((a, b) => {
      const moduloA = parseInt(a.Modulo || '0');
      const moduloB = parseInt(b.Modulo || '0');
      if (moduloA !== moduloB) return moduloA - moduloB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex < sortedLessons.length - 1;
  };

  const getHasPrevious = () => {
    if (!selectedLesson) return false;
    
    const sortedLessons = [...allLessons].sort((a, b) => {
      const moduloA = parseInt(a.Modulo || '0');
      const moduloB = parseInt(b.Modulo || '0');
      if (moduloA !== moduloB) return moduloA - moduloB;
      return parseInt(a.Aula) - parseInt(b.Aula);
    });
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLesson.id);
    return currentIndex > 0;
  };

  // Filter lessons for the selected module with search and area filters
  const getFilteredLessons = () => {
    if (!selectedModule || selectedModule === '') return [];
    
    let filtered = allLessons.filter(lesson => 
      lesson.Modulo === selectedModule || lesson.Dia === selectedModule
    );

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(lesson => 
        lesson.Tema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.conteudo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply area filter
    if (selectedArea !== 'Todas') {
      filtered = filtered.filter(lesson => lesson.Area === selectedArea);
    }

    return filtered;
  };

  // Get unique areas from lessons for the current module
  const getAvailableAreas = () => {
    const moduleLessons = allLessons.filter(lesson => 
      lesson.Modulo === selectedModule || lesson.Dia === selectedModule
    );
    const areas = [...new Set(moduleLessons.map(lesson => lesson.Area).filter(area => area && area !== 'Área não informada'))];
    return ['Todas', ...areas];
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
            <CourseModules lessons={allLessons} onDayClick={handleModuleClick} />
          )}
          
          {currentView === 'lessons' && (
            <div className="container mx-auto px-4 py-8">
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedArea={selectedArea}
                onAreaChange={setSelectedArea}
                availableAreas={getAvailableAreas()}
                onBack={handleBack}
                totalLessons={getFilteredLessons().length}
              />
              <LessonList 
                lessons={getFilteredLessons()}
                searchTerm={searchTerm}
                selectedArea={selectedArea}
                onLessonSelect={handleLessonClick}
              />
            </div>
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
