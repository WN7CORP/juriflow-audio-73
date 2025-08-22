import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, CheckCircle, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface LessonListProps {
  day: string;
  onBack: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

export const LessonList = ({ day, onBack, onLessonClick }: LessonListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { completedLessons } = useProgress();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Módulo {day}
          </h1>
          <p className="text-muted-foreground">
            {completedCount}/{lessons.length} aulas concluídas
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progresso do Módulo</span>
          <span className="text-sm text-muted-foreground">
            {Math.round((completedCount / lessons.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.has(`${lesson.Dia}-${lesson.Aula}`);
          const isNext = !isCompleted && (index === 0 || completedLessons.has(`${lessons[index - 1].Dia}-${lessons[index - 1].Aula}`));
          
          return (
            <Card 
              key={lesson.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-card border-border ${
                isNext ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:bg-accent/50'
              }`}
              onClick={() => onLessonClick(lesson)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Lesson Number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isNext 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{lesson.Aula}</span>
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">
                      Aula {lesson.Aula}: {lesson.Tema}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        <span>Vídeo aula</span>
                      </div>
                      {isNext && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Próxima aula</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={isCompleted ? "secondary" : isNext ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isCompleted ? 'Revisar' : 'Assistir'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};