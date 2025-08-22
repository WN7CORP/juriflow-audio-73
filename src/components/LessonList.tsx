
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
  const { completedLessons, getLessonProgress } = useProgress();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .eq("Dia", day)
          .order("Aula", { ascending: true });

        if (data) {
          setLessons(data);
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
      {/* Header - Mobile Optimized */}
      <div className="sticky top-0 z-40 bg-surface-glass/95 backdrop-blur border-b border-border">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Módulo - Dia {day}
              </h1>
            </div>
          </div>

          {/* Progress Bar - Mobile */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {completedCount} de {lessons.length} aulas concluídas
              </span>
              <span className="text-foreground font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Lessons List - Mobile Optimized */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id?.toString() || '');
            const progress = getLessonProgress(lesson.id?.toString() || '');
            const isWatching = progress > 0 && progress < 100;

            return (
              <Card
                key={lesson.id}
                className="group cursor-pointer overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => onLessonClick(lesson)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail - Mobile Optimized */}
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-square overflow-hidden flex-shrink-0">
                    <img
                      src={lesson.capa || '/placeholder.svg'}
                      alt={lesson.Nome}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3 sm:p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                        <Play className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground fill-current" />
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="absolute top-3 right-3">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : isWatching ? (
                        <div className="relative">
                          <Circle className="h-5 w-5 text-primary" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Progress Bar on thumbnail for mobile */}
                    {progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content - Mobile Optimized */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Aula {lesson.Aula}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Concluída
                          </Badge>
                        )}
                        {isWatching && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            Em andamento
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {lesson.Nome}
                    </h3>

                    {lesson.Descricao && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3">
                        {lesson.Descricao}
                      </p>
                    )}

                    {/* Meta info - Mobile friendly */}
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>~15 min</span>
                      </div>
                      {progress > 0 && (
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          <span>{Math.round(progress)}% assistido</span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar for desktop */}
                    {progress > 0 && (
                      <div className="hidden sm:block">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Progresso</span>
                          <span className="text-xs text-foreground font-medium">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center">
          <Card className="p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Continue Aprendendo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {completedCount === lessons.length 
                ? "Parabéns! Você concluiu este módulo."
                : `Faltam ${lessons.length - completedCount} aulas para concluir.`
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
