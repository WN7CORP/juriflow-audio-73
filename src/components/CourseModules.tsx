
import { useState, useEffect } from "react";
import { ModuleCard } from "./ModuleCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Module, Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface CourseModulesProps {
  lessons: Lesson[];
  onDayClick: (day: string) => void;
}

export const CourseModules = ({ lessons, onDayClick }: CourseModulesProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(lessons);
  const { completedLessons } = useProgress();

  useEffect(() => {
    setFilteredLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    // Group lessons by Area (module name) instead of Dia
    const moduleMap = new Map<string, Lesson[]>();
    
    filteredLessons.forEach(lesson => {
      const moduleArea = lesson.Area || lesson.Modulo || `Módulo ${lesson.Modulo}`;
      if (!moduleMap.has(moduleArea)) {
        moduleMap.set(moduleArea, []);
      }
      moduleMap.get(moduleArea)!.push(lesson);
    });

    // Convert to Module array
    const moduleList: Module[] = Array.from(moduleMap.entries())
      .sort((a, b) => {
        // Sort by Modulo number if available, otherwise alphabetically
        const moduloA = parseInt(a[1][0]?.Modulo || '0');
        const moduloB = parseInt(b[1][0]?.Modulo || '0');
        return moduloA - moduloB;
      })
      .map(([moduleArea, moduleUserLessons]) => {
        const completedCount = moduleUserLessons.filter(lesson => 
          completedLessons.has(lesson.id?.toString() || '')
        ).length;

        // Sort lessons by Aula number within each module
        const sortedLessons = moduleUserLessons.sort((a, b) => {
          const aulaA = parseInt(a.Aula) || 0;
          const aulaB = parseInt(b.Aula) || 0;
          return aulaA - aulaB;
        });

        // Use the first lesson's Modulo as the module identifier for navigation
        const moduleId = sortedLessons[0]?.Modulo || moduleArea;

        // Get the first available capa-modulos from any lesson in this module
        const moduleCover = sortedLessons.find(lesson => lesson.capaModulos)?.capaModulos || 
                           sortedLessons[0]?.capa || 
                           '/placeholder.svg';

        return {
          day: moduleId, // Use Modulo as day for navigation compatibility
          lessons: sortedLessons,
          totalLessons: moduleUserLessons.length,
          completedLessons: completedCount,
          coverImage: moduleCover,
          duration: moduleUserLessons.length * 15, // 15 min per lesson estimate
          isNew: completedCount === 0,
          moduleArea: moduleArea // Add module area name for display
        };
      });

    setModules(moduleList);
  }, [filteredLessons, completedLessons]);

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced with animations */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 pt-2 pb-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2 animate-scale-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Sua Jornada de Aprendizado
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
              Seus Módulos de Estudo
            </h1>
            
            <p className="text-base text-muted-foreground mb-3 leading-relaxed animate-fade-in" style={{ animationDelay: '400ms' }}>
              Selecione um módulo para começar ou continuar seus estudos
            </p>

            {/* Stats Section - Enhanced animations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="text-center transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '700ms' }}>
                <div className="text-xl font-bold text-primary mb-1 transition-all duration-300 hover:text-primary/80">
                  {modules.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Módulos
                </div>
              </div>
              <div className="text-center transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '800ms' }}>
                <div className="text-xl font-bold text-primary mb-1 transition-all duration-300 hover:text-primary/80">
                  {lessons.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Aulas Totais
                </div>
              </div>
              <div className="text-center transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '900ms' }}>
                <div className="text-xl font-bold text-primary mb-1 transition-all duration-300 hover:text-primary/80">
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

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <SearchAndFilter 
          lessons={lessons}
          onFilteredLessons={setFilteredLessons}
        />

        {/* Results Count */}
        {filteredLessons.length !== lessons.length && (
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando {modules.length} módulos com {filteredLessons.length} aulas de {lessons.length} total
            </p>
          </div>
        )}

        {/* Modules Grid - Enhanced with staggered animations */}
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {modules.map((module, index) => (
              <div 
                key={module.day} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ModuleCard
                  module={module}
                  onClick={() => onDayClick(module.day)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum módulo encontrado com os filtros aplicados.
            </p>
          </div>
        )}

        {/* Progress Summary - Enhanced animations */}
        {modules.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <div className="bg-card border border-border rounded-xl p-6 transition-all duration-500 hover:shadow-lg hover:border-primary/30">
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center transition-colors duration-300 hover:text-primary">
                Progresso Geral
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-accent/20 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-accent/30 animate-scale-in" style={{ animationDelay: '1100ms' }}>
                  <div className="text-xl font-bold text-primary mb-1 transition-all duration-300 hover:scale-110">
                    {Math.round((completedLessons.size / lessons.length) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Concluído
                  </div>
                </div>
                
                <div className="text-center p-3 bg-accent/20 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-accent/30 animate-scale-in" style={{ animationDelay: '1200ms' }}>
                  <div className="text-xl font-bold text-green-500 mb-1 transition-all duration-300 hover:scale-110">
                    {modules.filter(m => m.completedLessons === m.totalLessons).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Finalizados
                  </div>
                </div>
                
                <div className="text-center p-3 bg-accent/20 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-accent/30 animate-scale-in" style={{ animationDelay: '1300ms' }}>
                  <div className="text-xl font-bold text-amber-500 mb-1 transition-all duration-300 hover:scale-110">
                    {modules.filter(m => m.completedLessons > 0 && m.completedLessons < m.totalLessons).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Em Andamento
                  </div>
                </div>
                
                <div className="text-center p-3 bg-accent/20 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-accent/30 animate-scale-in" style={{ animationDelay: '1400ms' }}>
                  <div className="text-xl font-bold text-blue-500 mb-1 transition-all duration-300 hover:scale-110">
                    {modules.filter(m => m.completedLessons === 0).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Novos
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
