
import { useState, useEffect } from "react";
import { ModuleCard } from "./ModuleCard";
import { Module, Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface CourseModulesProps {
  lessons: Lesson[];
  onDayClick: (day: string) => void;
}

export const CourseModules = ({ lessons, onDayClick }: CourseModulesProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const { completedLessons } = useProgress();

  useEffect(() => {
    // Group lessons by day and create modules
    const moduleMap = new Map<string, Lesson[]>();
    
    lessons.forEach(lesson => {
      const day = lesson.Dia;
      if (!moduleMap.has(day)) {
        moduleMap.set(day, []);
      }
      moduleMap.get(day)!.push(lesson);
    });

    // Convert to Module array
    const moduleList: Module[] = Array.from(moduleMap.entries())
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([day, dayLessons]) => {
        const completedCount = dayLessons.filter(lesson => 
          completedLessons.has(lesson.id?.toString() || '')
        ).length;

        // Sort lessons by Aula number
        const sortedLessons = dayLessons.sort((a, b) => {
          const aulaA = parseInt(a.Aula) || 0;
          const aulaB = parseInt(b.Aula) || 0;
          return aulaA - aulaB;
        });

        return {
          day,
          lessons: sortedLessons,
          totalLessons: dayLessons.length,
          completedLessons: completedCount,
          // Use the modulo column as cover image, fallback to first lesson's capa
          coverImage: sortedLessons[0]?.modulo || sortedLessons[0]?.capa || '/placeholder.svg',
          duration: dayLessons.length * 15, // 15 min per lesson estimate
          isNew: completedCount === 0
        };
      });

    setModules(moduleList);
  }, [lessons, completedLessons]);

  if (modules.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6 shadow-lg"></div>
          <p className="text-muted-foreground text-lg animate-pulse">Carregando módulos...</p>
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Hero Section - Minimal padding */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-accent/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 pt-4 pb-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-bold mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
              🚀 Sua Jornada de Aprendizado
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight animate-scale-in">
              Seus Módulos de Estudo
            </h1>
            
            <p className="text-base text-muted-foreground mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              📚 Selecione um módulo para começar ou continuar seus estudos
            </p>

            {/* Stats Section - Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="text-center bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '300ms' }}>
                <div className="text-2xl font-bold text-primary mb-2 animate-pulse">
                  {modules.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  📖 Módulos
                </div>
              </div>
              <div className="text-center bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '400ms' }}>
                <div className="text-2xl font-bold text-primary mb-2 animate-pulse">
                  {lessons.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  🎯 Aulas Totais
                </div>
              </div>
              <div className="text-center bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '500ms' }}>
                <div className="text-2xl font-bold text-green-500 mb-2 animate-bounce">
                  {completedLessons.size}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  ✅ Concluídas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid - Reduced top padding */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((module, index) => (
            <div
              key={module.day}
              className="animate-fade-in hover:animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ModuleCard
                module={module}
                onClick={() => onDayClick(module.day)}
              />
            </div>
          ))}
        </div>

        {/* Progress Summary - Enhanced but more compact */}
        <div className="mt-12 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center animate-scale-in">
              📊 Progresso Geral
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary/10 rounded-xl animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '900ms' }}>
                <div className="text-2xl font-bold text-primary mb-2 animate-pulse">
                  {Math.round((completedLessons.size / lessons.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  🎯 Concluído
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-500/10 rounded-xl animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '1000ms' }}>
                <div className="text-2xl font-bold text-green-500 mb-2 animate-bounce">
                  {modules.filter(m => m.completedLessons === m.totalLessons).length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  ✅ Finalizados
                </div>
              </div>
              
              <div className="text-center p-4 bg-amber-500/10 rounded-xl animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '1100ms' }}>
                <div className="text-2xl font-bold text-amber-500 mb-2 animate-pulse">
                  {modules.filter(m => m.completedLessons > 0 && m.completedLessons < m.totalLessons).length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  ⏳ Em Andamento
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-500/10 rounded-xl animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '1200ms' }}>
                <div className="text-2xl font-bold text-blue-500 mb-2 animate-pulse">
                  {modules.filter(m => m.completedLessons === 0).length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  🆕 Novos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
