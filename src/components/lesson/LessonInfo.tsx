
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChevronDown, BookOpen } from "lucide-react";
import { PlaybackSpeedControl } from "@/components/PlaybackSpeedControl";
import { Lesson } from "@/types/course";
import { useState } from "react";

interface LessonInfoProps {
  lesson: Lesson;
  duration: number;
  progressPercent: number;
  isCompleted: boolean;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
}

export const LessonInfo = ({ 
  lesson, 
  duration, 
  progressPercent, 
  isCompleted, 
  playbackSpeed, 
  onPlaybackSpeedChange 
}: LessonInfoProps) => {
  const [showDescription, setShowDescription] = useState(false);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "~15 min";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes} min`;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Always show progress bar, even at 0%
  const displayProgress = Math.max(progressPercent, 0);

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg lg:text-2xl font-bold text-foreground mb-3 line-clamp-2 leading-tight animate-scale-in">
            {lesson.Tema}
          </h1>
          
          {/* Area Badge */}
          {lesson.Area && lesson.Area !== 'Área não informada' && (
            <div className="mb-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs lg:text-sm px-3 py-1.5 animate-scale-in">
                <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5" />
                {lesson.Area}
              </Badge>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-sm lg:text-base text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5 lg:gap-2 bg-muted/50 px-2.5 lg:px-3 py-1.5 rounded-full animate-scale-in" style={{ animationDelay: '200ms' }}>
              <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span className="font-medium text-xs lg:text-sm">{formatDuration(duration)}</span>
            </div>
            {displayProgress > 0 && (
              <div className="flex items-center gap-1.5 lg:gap-2 bg-primary/10 px-2.5 lg:px-3 py-1.5 rounded-full animate-scale-in" style={{ animationDelay: '300ms' }}>
                <span className="font-medium text-primary text-xs lg:text-sm">{Math.round(displayProgress)}% assistido</span>
              </div>
            )}
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs lg:text-sm px-2.5 lg:px-3 py-1 lg:py-1.5 animate-scale-in" style={{ animationDelay: '400ms' }}>
                <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                Concluída
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Playback Speed Control */}
      <div className="mb-4 lg:mb-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <PlaybackSpeedControl
          currentSpeed={playbackSpeed}
          onSpeedChange={onPlaybackSpeedChange}
          className="justify-start"
        />
      </div>

      {/* Progress Bar - Always show, improved mobile visibility */}
      <div className="mb-4 lg:mb-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="flex justify-between items-center mb-2 lg:mb-3">
          <span className="text-sm lg:text-base text-muted-foreground font-medium">Progresso da aula</span>
          <span className="text-base lg:text-lg font-bold text-primary animate-scale-in">
            {Math.round(displayProgress)}%
          </span>
        </div>
        <Progress 
          value={displayProgress} 
          className="h-4 lg:h-4 animate-scale-in bg-secondary transition-all duration-500" 
          style={{ animationDelay: '700ms' }} 
        />
        {displayProgress === 0 && (
          <p className="text-xs text-muted-foreground mt-1 animate-fade-in">
            Comece a assistir para ver o progresso
          </p>
        )}
      </div>

      {/* Description - Expandable on mobile */}
      {lesson.conteudo && (
        <div className="mb-4 lg:mb-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <Button
            variant="ghost"
            className="p-0 h-auto font-semibold text-left lg:cursor-default text-base lg:text-lg hover:bg-transparent mb-2 lg:mb-3 transition-all duration-300 hover:text-primary"
            onClick={() => setShowDescription(!showDescription)}
          >
            <span>Sobre esta aula</span>
            <ChevronDown className={`ml-2 h-4 w-4 lg:hidden transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`} />
          </Button>
          <div className={`text-muted-foreground text-sm lg:text-base leading-relaxed transition-all duration-500 bg-muted/30 p-3 lg:p-4 rounded-lg ${
            showDescription ? 'block max-h-none opacity-100' : 'line-clamp-3 lg:block lg:max-h-none opacity-90'
          }`}>
            {lesson.conteudo}
          </div>
          {!showDescription && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mt-2 p-0 h-auto text-sm text-primary hover:bg-transparent font-medium transition-all duration-300 hover:scale-105"
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
