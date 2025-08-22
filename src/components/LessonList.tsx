
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, CheckCircle, Clock, Star, BookOpen } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LessonListProps {
  day: string;
  onBack: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

export const LessonList = ({ day, onBack, onLessonClick }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { completedLessons, getCompletionRate } = useProgress();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from("VIDEO-AULAS-DIAS")
          .select("*")
          .eq("Dia", day)
          .order("Aula", { ascending: true });

        if (error) {
          console.error("Error fetching lessons:", error);
          return;
        }

        setLessons(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [day]);

  useEffect(() => {
    // Auto-scroll to next lesson when page loads
    const nextLesson = lessons.find(lesson => 
      !completedLessons.has(`${lesson.Dia}-${lesson.Aula}`)
    );
    
    if (nextLesson) {
      setTimeout(() => {
        const element = document.getElementById(`lesson-${nextLesson.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [lessons, completedLessons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando aulas...</span>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(lesson => 
    completedLessons.has(`${lesson.Dia}-${lesson.Aula}`)
  ).length;

  const moduleProgress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Módulo {day}
              </h1>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {completedCount}/{lessons.length} aulas concluídas • {Math.round(moduleProgress)}% completo
            </p>

            <div className="max-w-md">
              <Progress value={moduleProgress} className="h-3" />
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                  }`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Avaliação do módulo
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Play className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{lessons.length}</div>
                <div className="text-sm text-muted-foreground">Total de Aulas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Concluídas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{lessons.length * 8}min</div>
                <div className="text-sm text-muted-foreground">Tempo Estimado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Lessons List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Aulas do Módulo</h2>
        
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(`${lesson.Dia}-${lesson.Aula}`);
          const completionRate = getCompletionRate(`${lesson.Dia}-${lesson.Aula}`);
          const isNext = !isCompleted && (index === 0 || completedLessons.has(`${lessons[index - 1].Dia}-${lessons[index - 1].Aula}`));
          const isLocked = !isNext && !isCompleted && index > 0 && !completedLessons.has(`${lessons[index - 1].Dia}-${lessons[index - 1].Aula}`);
          
          return (
            <Card 
              key={lesson.id}
              id={`lesson-${lesson.id}`}
              className={`group cursor-pointer transition-all duration-200 hover:shadow-card border-border overflow-hidden ${
                isNext ? 'ring-2 ring-primary/30 bg-primary/5 hover:bg-primary/10' : 
                isCompleted ? 'bg-green-500/5 hover:bg-green-500/10' :
                isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-accent/50'
              }`}
              onClick={() => !isLocked && onLessonClick(lesson)}
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 flex-shrink-0">
                    {lesson.capa ? (
                      <img 
                        src={lesson.capa} 
                        alt={lesson.Tema}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Play className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/90 rounded-full p-2">
                        <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      ~8min
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isNext 
                                ? 'bg-primary text-primary-foreground' 
                                : isLocked
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{lesson.Aula}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isNext && (
                              <Badge variant="default" className="text-xs">
                                Próxima
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                                Concluída
                              </Badge>
                            )}
                            {isLocked && (
                              <Badge variant="secondary" className="text-xs">
                                Bloqueada
                              </Badge>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {lesson.Tema}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          Aula {lesson.Aula} • Módulo {lesson.Dia}
                        </p>

                        {/* Progress Bar for Partially Watched */}
                        {completionRate > 0 && completionRate < 100 && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Progresso</span>
                              <span className="text-xs text-primary">{Math.round(completionRate)}%</span>
                            </div>
                            <Progress value={completionRate} className="h-1" />
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant={isCompleted ? "secondary" : isNext ? "default" : "ghost"}
                        size="sm"
                        className="gap-2 flex-shrink-0"
                        disabled={isLocked}
                      >
                        <Play className="h-4 w-4" />
                        {isCompleted ? 'Revisar' : isNext ? 'Continuar' : 'Assistir'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
