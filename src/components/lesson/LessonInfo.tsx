
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
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
    <div className="p-3 lg:p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-base lg:text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight">
            {lesson.Tema}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>{formatDuration(duration)}</span>
            </div>
            {progressPercent > 0 && (
              <div className="flex items-center gap-1">
                <span>{Math.round(progressPercent)}% assistido</span>
              </div>
            )}
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-scale-in">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Concluída
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {progressPercent > 0 && (
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Seu progresso</span>
            <span className="text-xs font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 lg:h-2" />
        </div>
      )}

      {/* Description - Expandable on mobile */}
      {lesson.conteudo && (
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button
            variant="ghost"
            className="p-0 h-auto font-semibold text-left lg:cursor-default text-sm hover:bg-transparent"
            onClick={() => setShowDescription(!showDescription)}
          >
            <span>Sobre esta aula</span>
            <ChevronDown className={`ml-1 h-3 w-3 lg:hidden transition-transform duration-200 ${showDescription ? 'rotate-180' : ''}`} />
          </Button>
          <div className={`mt-2 text-muted-foreground text-xs lg:text-sm leading-relaxed transition-all duration-300 ${
            showDescription ? 'block max-h-none' : 'line-clamp-2 lg:block lg:max-h-none'
          }`}>
            {lesson.conteudo}
          </div>
          {!showDescription && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mt-1 p-0 h-auto text-xs text-primary hover:bg-transparent"
              onClick={() => setShowDescription(true)}
            >
              Ver mais
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
