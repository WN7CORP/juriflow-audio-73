
import { useState, useEffect } from "react";
import { Lesson } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Play, BookOpen, Clock, Target } from "lucide-react";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import { useProgress } from "@/hooks/useProgress";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const LessonDetail = ({ 
  lesson, 
  onBack, 
  onNextLesson, 
  onPreviousLesson,
  hasNext,
  hasPrevious 
}: LessonDetailProps) => {
  const { completedLessons, markAsCompleted, getCompletionRate, setCurrentLesson } = useProgress();
  
  const lessonKey = `${lesson.Dia}-${lesson.Aula}`;
  const isCompleted = completedLessons.has(lessonKey);
  const hasVideo = lesson.video && lesson.video.trim() !== '';
  const completionRate = getCompletionRate(lessonKey);

  // Set current lesson when component mounts
  useEffect(() => {
    setCurrentLesson(lesson.Dia, lesson.Aula);
  }, [lesson.Dia, lesson.Aula, setCurrentLesson]);

  const handleVideoStart = () => {
    console.log('Video started:', lesson.Tema);
  };

  const handleVideoEnd = () => {
    if (!isCompleted) {
      markAsCompleted(lessonKey);
    }
    // Auto-advance to next lesson after 3 seconds
    setTimeout(() => {
      if (hasNext && onNextLesson) {
        onNextLesson();
      }
    }, 3000);
  };

  const handleMarkCompleted = () => {
    markAsCompleted(lessonKey);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {lesson.Tema}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Aula {lesson.Aula}</span>
                <span>•</span>
                <span>Módulo {lesson.Dia}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~8 minutos
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 gap-2">
                <CheckCircle className="h-4 w-4" />
                Concluída
              </Badge>
            )}
            
            {completionRate > 0 && completionRate < 100 && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 gap-2">
                <Target className="h-4 w-4" />
                {Math.round(completionRate)}% assistido
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {completionRate > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progresso da Aula</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        )}
      </div>

      {/* Enhanced Video Player */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            {hasVideo ? (
              <EnhancedVideoPlayer
                videoUrl={lesson.video}
                lessonKey={lessonKey}
                onVideoEnd={handleVideoEnd}
                onVideoStart={handleVideoStart}
                title={lesson.Tema}
                autoPlay={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="h-8 w-8 text-muted-foreground ml-1" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Vídeo não disponível
                  </h3>
                  <p className="text-muted-foreground">
                    Este conteúdo será disponibilizado em breve
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      {lesson.conteudo && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Material de Apoio
              </h2>
            </div>
            <div 
              className="prose prose-invert max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: lesson.conteudo.replace(/\n/g, '<br />') 
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Enhanced Navigation */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {hasPrevious && (
                <Button variant="outline" onClick={onPreviousLesson} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Aula Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {!isCompleted && (
                <Button variant="secondary" onClick={handleMarkCompleted} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Concluída
                </Button>
              )}
              
              {hasNext && (
                <Button onClick={onNextLesson} className="gap-2 bg-primary hover:bg-primary/90">
                  Próxima Aula
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Navigation Hints */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                <span>Aula anterior</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                <span>Próxima aula</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Espaço</kbd>
                <span>Play/Pause</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-advance notification */}
      {isCompleted && hasNext && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Parabéns! Você concluiu esta aula.
                </p>
                <p className="text-xs text-muted-foreground">
                  A próxima aula será carregada automaticamente em alguns segundos.
                </p>
              </div>
              <Button size="sm" onClick={onNextLesson} className="gap-2">
                Ir Agora
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
