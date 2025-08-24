
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle, Play, Filter } from "lucide-react";
import { Lesson, Module } from "@/types/course";

interface OptimizedCourseModulesProps {
  lessons: Lesson[];
  onDayClick: (day: string) => void;
}

export const OptimizedCourseModules = ({ lessons, onDayClick }: OptimizedCourseModulesProps) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Group lessons by Area and Module
  const organizedContent = useMemo(() => {
    const grouped = lessons.reduce((acc, lesson) => {
      const area = lesson.Area || 'Outras Áreas';
      const modulo = lesson.Modulo || lesson.modulo || 'Módulo Geral';
      
      if (!acc[area]) {
        acc[area] = {};
      }
      
      if (!acc[area][modulo]) {
        acc[area][modulo] = [];
      }
      
      acc[area][modulo].push(lesson);
      return acc;
    }, {} as Record<string, Record<string, Lesson[]>>);

    return grouped;
  }, [lessons]);

  // Get unique areas and modules for filters
  const areas = Object.keys(organizedContent);
  const modules = useMemo(() => {
    const allModules = new Set<string>();
    Object.values(organizedContent).forEach(areaModules => {
      Object.keys(areaModules).forEach(module => allModules.add(module));
    });
    return Array.from(allModules);
  }, [organizedContent]);

  // Filter content based on selections
  const filteredContent = useMemo(() => {
    let filtered = { ...organizedContent };
    
    if (selectedArea !== 'all') {
      filtered = { [selectedArea]: filtered[selectedArea] };
    }
    
    if (selectedModule !== 'all') {
      Object.keys(filtered).forEach(area => {
        const areaModules = filtered[area];
        filtered[area] = Object.keys(areaModules)
          .filter(module => module === selectedModule)
          .reduce((acc, module) => {
            acc[module] = areaModules[module];
            return acc;
          }, {} as Record<string, Lesson[]>);
      });
    }
    
    return filtered;
  }, [organizedContent, selectedArea, selectedModule]);

  const handleModuleClick = (lessons: Lesson[]) => {
    if (lessons.length > 0) {
      // Navigate to first lesson's day
      onDayClick(lessons[0].Dia);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Academia Jurídica Digital
        </h1>
        <p className="text-muted-foreground text-lg">
          Conteúdo organizado por área e módulo para seu aprendizado
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-center bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-3 py-1 border rounded-md bg-background"
        >
          <option value="all">Todas as Áreas</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="px-3 py-1 border rounded-md bg-background"
        >
          <option value="all">Todos os Módulos</option>
          {modules.map(module => (
            <option key={module} value={module}>{module}</option>
          ))}
        </select>
      </div>

      {/* Content Grid */}
      <div className="space-y-8">
        {Object.entries(filteredContent).map(([area, areaModules]) => (
          <div key={area} className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">{area}</h2>
              <Badge variant="secondary">
                {Object.values(areaModules).reduce((acc, lessons) => acc + lessons.length, 0)} aulas
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(areaModules).map(([module, moduleLessons]) => (
                <Card 
                  key={`${area}-${module}`}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary"
                  onClick={() => handleModuleClick(moduleLessons)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{module}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {moduleLessons.length} aulas
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress simulation */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>

                    {/* Module stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>~{moduleLessons.length * 15} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>0/{moduleLessons.length}</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Módulo
                    </Button>

                    {/* Preview of first lessons */}
                    <div className="space-y-1 pt-2 border-t">
                      <p className="text-xs text-muted-foreground font-medium">Primeiras aulas:</p>
                      {moduleLessons.slice(0, 3).map((lesson, idx) => (
                        <p key={lesson.id} className="text-xs text-muted-foreground truncate">
                          {idx + 1}. {lesson.Tema}
                        </p>
                      ))}
                      {moduleLessons.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          ... e mais {moduleLessons.length - 3} aulas
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{areas.length}</p>
          <p className="text-sm text-muted-foreground">Áreas Jurídicas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{modules.length}</p>
          <p className="text-sm text-muted-foreground">Módulos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{lessons.length}</p>
          <p className="text-sm text-muted-foreground">Total de Aulas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">~{Math.round(lessons.length * 15 / 60)}h</p>
          <p className="text-sm text-muted-foreground">Tempo Estimado</p>
        </div>
      </div>
    </div>
  );
};
