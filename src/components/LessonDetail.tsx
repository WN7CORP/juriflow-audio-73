
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/types/course";
import { useProgress } from "@/hooks/useProgress";

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const LessonDetail = ({
  lesson,
  onBack,
  onNextLesson,
  onPreviousLesson,
  hasNext,
  hasPrevious,
}: LessonDetailProps) => {
  const { completedLessons, getLessonProgress, updateLessonProgress } = useProgress();
  const [currentTime, setCurrentTime] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  
  const isCompleted = completedLessons.has(lesson.id?.toString() || '');
  const progress = getLessonProgress(lesson.id?.toString() || '');

  const handleVideoProgress = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      updateLessonProgress(lesson.id?.toString() || '', progressPercent, currentTime);
    }
  };

  const handleVideoComplete = () => {
    updateLessonProgress(lesson.id?.toString() || '', 100, currentTime);
  };

  // Auto-advance to next lesson when completed
  useEffect(() => {
    if (isCompleted && hasNext) {
      const timer = setTimeout(() => {
        onNextLesson();
      }, 3000); // Wait 3 seconds before auto-advancing

      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasNext, onNextLesson]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-surface-glass/95 backdrop-blur border-b border-border lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Dia {lesson.Dia} - Aula {lesson.Aula}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Video Section - Mobile First */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-4 p-6 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <Badge variant="outline">
                Dia {lesson.Dia} - Aula {lesson.Aula}
              </Badge>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative bg-black">
            <EnhancedVideoPlayer
              url={lesson.Link}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
              startTime={currentTime}
              className="w-full aspect-video"
            />
          </div>

          {/* Video Info - Mobile Optimized */}
          <div className="p-4 lg:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2 line-clamp-2">
                  {lesson.Nome}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~15 min</span>
                  </div>
                  {progress > 0 && (
                    <div className="flex items-center gap-1">
                      <span>{Math.round(progress)}% assistido</span>
                    </div>
                  )}
                  {isCompleted && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Concluída
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Seu progresso</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Description - Expandable on mobile */}
            {lesson.Descricao && (
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-semibold text-left lg:cursor-default"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  Sobre esta aula
                </Button>
                <div className={`mt-2 text-muted-foreground text-sm leading-relaxed ${
                  showDescription || window.innerWidth >= 1024 ? 'block' : 'line-clamp-3'
                }`}>
                  {lesson.Descricao}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden mt-2 p-0 h-auto text-xs text-primary"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  {showDescription ? 'Ver menos' : 'Ver mais'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Mobile Bottom Sheet Style */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-surface-elevated border-t lg:border-l lg:border-t-0 border-border">
          <div className="p-4 lg:p-6">
            {/* Navigation Controls - Mobile Optimized */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousLesson}
                disabled={!hasPrevious}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onNextLesson}
                disabled={!hasNext}
                className="flex-1"
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Auto-advance notification */}
            {isCompleted && hasNext && (
              <Card className="p-4 mb-6 bg-primary/10 border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-foreground">
                    Próxima aula em 3 segundos...
                  </span>
                </div>
              </Card>
            )}

            {/* Course Progress Summary */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Progresso do Módulo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dia {lesson.Dia}</span>
                  <span className="font-medium">Aula {lesson.Aula}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-muted-foreground text-center">
                  Continue assistindo para desbloquear o próximo conteúdo
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
