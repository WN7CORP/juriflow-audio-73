
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/types/course";
import { useState } from "react";

interface LessonInfoProps {
  lesson: Lesson;
  duration: number;
  progressPercent: number;
  isCompleted: boolean;
}

export const LessonInfo = ({ lesson, duration, progressPercent, isCompleted }: LessonInfoProps) => {
  const [showDescription, setShowDescription] = useState(false);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "~15 min";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes} min`;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2 line-clamp-2">
            {lesson.Tema}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(duration)}</span>
            </div>
            {progressPercent > 0 && (
              <div className="flex items-center gap-1">
                <span>{Math.round(progressPercent)}% assistido</span>
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
      {progressPercent > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Seu progresso</span>
            <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Description - Expandable on mobile */}
      {lesson.conteudo && (
        <div className="mb-6">
          <Button
            variant="ghost"
            className="p-0 h-auto font-semibold text-left lg:cursor-default"
            onClick={() => setShowDescription(!showDescription)}
          >
            Sobre esta aula
          </Button>
          <div className={`mt-2 text-muted-foreground text-sm leading-relaxed ${
            showDescription ? 'block' : 'line-clamp-3 lg:block'
          }`}>
            {lesson.conteudo}
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
  );
};
