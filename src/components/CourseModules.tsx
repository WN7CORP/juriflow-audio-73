
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Reduced padding to fix top spacing */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Sua Jornada de Aprendizado
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              Seus Módulos de Estudo
            </h1>
            
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Selecione um módulo para começar ou continuar seus estudos
            </p>

            {/* Stats Section - Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">
                  {modules.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Módulos
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">
                  {lessons.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Aulas Totais
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">
                  {completedLessons.size}
                </div>
                <div className="text-xs text-muted-foreground">
                  Concluídas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid - Reduced top padding */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((module) => (
            <ModuleCard
              key={module.day}
              module={module}
              onClick={() => onDayClick(module.day)}
            />
          ))}
        </div>

        {/* Progress Summary - Enhanced but more compact */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Progresso Geral
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-xl font-bold text-primary mb-1">
                  {Math.round((completedLessons.size / lessons.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Concluído
                </div>
              </div>
              
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-xl font-bold text-green-500 mb-1">
                  {modules.filter(m => m.completedLessons === m.totalLessons).length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Finalizados
                </div>
              </div>
              
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-xl font-bold text-amber-500 mb-1">
                  {modules.filter(m => m.completedLessons > 0 && m.completedLessons < m.totalLessons).length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Em Andamento
                </div>
              </div>
              
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-xl font-bold text-blue-500 mb-1">
                  {modules.filter(m => m.completedLessons === 0).length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Novos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
