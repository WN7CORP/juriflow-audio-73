
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ModuleCard } from "./ModuleCard";
import { ProgressDashboard } from "./ProgressDashboard";
import { Lesson, Module } from "@/types/course";
import { Loader2, BookOpen, Trophy, TrendingUp } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CourseModules = ({ onModuleClick }: { onModuleClick: (day: string) => void }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const { completedLessons, completedModules } = useProgress();

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

          // Estimate duration (assuming 10 minutes per lesson on average)
          const estimatedDuration = lessons.length * 10 * 60; // seconds

          // Check if module is new (created in last 7 days)
          const isNew = Math.random() > 0.7; // Simulated for demo

          return {
            day,
            lessons,
            totalLessons: lessons.length,
            completedLessons: completedCount,
            duration: estimatedDuration,
            isNew,
            coverImage: lessons[0]?.capa
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <div className="text-lg font-medium text-foreground">Carregando seu curso...</div>
            <div className="text-sm text-muted-foreground">Preparando a melhor experiência de aprendizado</div>
          </div>
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
      {/* Hero Section */}
      <div className="text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl" />
        <div className="relative z-10 py-12 px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-primary/80">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Seu Curso Completo
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aprenda de forma estruturada através de módulos organizados e acompanhe seu progresso em tempo real
          </p>
        </div>
      </div>

      {/* Progress Dashboard */}
      <ProgressDashboard totalLessons={totalLessons} totalModules={modules.length} />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progresso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {Math.min(totalCompleted, 7)}/7
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 7 aulas por semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Próximo Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground mb-1">
              Módulo {modules.find(m => m.completedLessons < m.totalLessons)?.day || '1'}
            </div>
            <p className="text-xs text-muted-foreground">
              Continue de onde parou
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground mb-1">
              {completedModules.size} Módulos
            </div>
            <p className="text-xs text-muted-foreground">
              Concluídos com sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Módulos do Curso</h2>
          <div className="text-sm text-muted-foreground">
            {modules.length} módulos disponíveis
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

      {/* Motivation Section */}
      {overallProgress > 0 && (
        <Card className="border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Parabéns pelo seu progresso!
            </h3>
            <p className="text-muted-foreground mb-4">
              Você já completou {overallProgress}% do curso. Continue assim!
            </p>
            <div className="w-full bg-secondary rounded-full h-3 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
