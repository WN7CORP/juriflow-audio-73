
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, CheckCircle2, Circle, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface LessonListProps {
  day: string;
  onBack: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

export const LessonList = ({ day, onBack, onLessonClick }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { completedLessons, getCompletionRate } = useProgress();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .eq("Dia", day)
          .order("Aula", { ascending: true });

        if (data) {
          // Map Supabase data to Lesson interface
          const mappedLessons: Lesson[] = data.map(item => ({
            ...item,
            Nome: item.Tema || `Aula ${item.Aula}`,
            Link: item.video || '',
            Descricao: item.conteudo || 'Conteúdo não disponível'
          }));
          setLessons(mappedLessons);
        }
      } catch (error) {
        console.error("Erro ao carregar aulas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [day]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedCount = lessons.filter(lesson => 
    completedLessons.has(lesson.id?.toString() || '')
  ).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Enhanced with animations */}
      <div className="sticky top-0 z-40 bg-surface-glass/95 backdrop-blur border-b border-border animate-fade-in">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-accent transition-all duration-300 hover:scale-110 animate-scale-in"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Módulo - Dia {day}
              </h1>
            </div>
          </div>

          {/* Progress Bar - Enhanced */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {completedCount} de {lessons.length} aulas concluídas
              </span>
              <span className="text-foreground font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Lessons List - Enhanced with staggered animations */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id?.toString() || '');
            const progressPercent = getCompletionRate(lesson.id?.toString() || '');
            const isWatching = progressPercent > 0 && progressPercent < 100;

            return (
              <div 
                key={lesson.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:scale-[1.01] animate-scale-in"
                  onClick={() => onLessonClick(lesson)}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail - Enhanced */}
                    <div className="relative w-full sm:w-48 aspect-video sm:aspect-square overflow-hidden flex-shrink-0">
                      <img
                        src={lesson.capa || '/placeholder.svg'}
                        alt={lesson.Nome}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent transition-all duration-500" />
                      
                      {/* Play Button - Enhanced */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3 sm:p-4 transform transition-all duration-500 group-hover:scale-125 group-hover:bg-primary group-hover:shadow-lg">
                          <Play className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground fill-current" />
                        </div>
                      </div>

                      {/* Status Icon - Enhanced */}
                      <div className="absolute top-3 right-3 transition-all duration-300 group-hover:scale-110">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400 animate-scale-in" />
                        ) : isWatching ? (
                          <div className="relative">
                            <Circle className="h-5 w-5 text-primary" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      {/* Progress Bar on thumbnail */}
                      {progressPercent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content - Enhanced */}
                    <div className="flex-1 p-4 sm:p-6 transition-all duration-300 group-hover:bg-accent/5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs transition-all duration-300 group-hover:border-primary group-hover:text-primary">
                            Aula {lesson.Aula}
                          </Badge>
                          {lesson.Area && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                              {lesson.Area}
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-scale-in">
                              Concluída
                            </Badge>
                          )}
                          {isWatching && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs animate-scale-in">
                              Em andamento
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-all duration-300">
                        {lesson.Nome}
                      </h3>

                      {lesson.Descricao && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3 transition-colors duration-300 group-hover:text-foreground">
                          {lesson.Descricao}
                        </p>
                      )}

                      {/* Meta info - Enhanced */}
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-3 transition-colors duration-300 group-hover:text-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>~15 min</span>
                        </div>
                        {progressPercent > 0 && (
                          <div className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            <span>{Math.round(progressPercent)}% assistido</span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar for desktop - Enhanced */}
                      {progressPercent > 0 && (
                        <div className="hidden sm:block">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">Progresso</span>
                            <span className="text-xs text-foreground font-medium">
                              {Math.round(progressPercent)}%
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-1.5 transition-all duration-500 group-hover:h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA - Enhanced */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: `${lessons.length * 100}ms` }}>
          <Card className="p-6 max-w-md mx-auto transition-all duration-500 hover:shadow-lg hover:scale-105">
            <h3 className="font-semibold mb-2">Continue Aprendendo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {completedCount === lessons.length 
                ? "🎉 Parabéns! Você concluiu este módulo."
                : `Faltam ${lessons.length - completedCount} aulas para concluir.`
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
