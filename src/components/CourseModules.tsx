
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
      {/* Hero Section - Enhanced */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Sua Jornada de Aprendizado
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Domine Seus Estudos
              <span className="block text-primary">Dia Após Dia</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Transforme seu conhecimento com nosso método estruturado. 
              Cada módulo foi cuidadosamente desenvolvido para maximizar seu aprendizado.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {modules.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Módulos Disponíveis
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {lessons.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Aulas Totais
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {completedLessons.size}
                </div>
                <div className="text-sm text-muted-foreground">
                  Aulas Concluídas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid - Enhanced */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Seus Módulos de Estudo
          </h2>
          <p className="text-muted-foreground">
            Selecione um módulo para começar ou continuar seus estudos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((module) => (
            <ModuleCard
              key={module.day}
              module={module}
              onClick={() => onDayClick(module.day)}
            />
          ))}
        </div>

        {/* Progress Summary - Enhanced */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Resumo do Seu Progresso
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {Math.round((completedLessons.size / lessons.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Progresso Geral
                </div>
              </div>
              
              <div className="text-center p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {modules.filter(m => m.completedLessons === m.totalLessons).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Módulos Concluídos
                </div>
              </div>
              
              <div className="text-center p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-500 mb-2">
                  {modules.filter(m => m.completedLessons > 0 && m.completedLessons < m.totalLessons).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Em Andamento
                </div>
              </div>
              
              <div className="text-center p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-500 mb-2">
                  {modules.filter(m => m.completedLessons === 0).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Novos Módulos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
