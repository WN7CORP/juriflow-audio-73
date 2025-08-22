import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ModuleCard } from "./ModuleCard";
import { Lesson, Module } from "@/types/course";
import { Loader2, BookOpen, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export const CourseModules = ({ onModuleClick }: { onModuleClick: (day: string) => void }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const { completedLessons } = useProgress();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .order("Dia", { ascending: true })
          .order("Aula", { ascending: true });

        if (error) {
          console.error("Error fetching lessons:", error);
          return;
        }

        // Group lessons by day
        const groupedByDay = (data || []).reduce((acc: Record<string, Lesson[]>, lesson: Lesson) => {
          if (!acc[lesson.Dia]) {
            acc[lesson.Dia] = [];
          }
          acc[lesson.Dia].push(lesson);
          return acc;
        }, {});

        // Create modules with progress
        const moduleList: Module[] = Object.entries(groupedByDay).map(([day, lessons]) => {
          const completedCount = lessons.filter(lesson => 
            completedLessons.has(`${lesson.Dia}-${lesson.Aula}`)
          ).length;

          return {
            day,
            lessons,
            totalLessons: lessons.length,
            completedLessons: completedCount
          };
        });

        setModules(moduleList);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [completedLessons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando módulos...</span>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum módulo encontrado
        </h3>
        <p className="text-muted-foreground">
          Aguarde a disponibilização do conteúdo do curso
        </p>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + module.totalLessons, 0);
  const totalCompleted = modules.reduce((acc, module) => acc + module.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Curso por Módulos
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Aprenda de forma estruturada através de módulos organizados
        </p>
        
        {/* Overall Progress */}
        <div className="max-w-md mx-auto bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso Geral</span>
            <span className="text-sm text-muted-foreground">{totalCompleted}/{totalLessons}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{overallProgress}% concluído</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.day}
            module={module}
            onClick={() => onModuleClick(module.day)}
          />
        ))}
      </div>
    </div>
  );
};