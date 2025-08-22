
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/types/course";

interface LessonNavigationProps {
  lesson: Lesson;
  progressPercent: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isCompleted: boolean;
  autoAdvanceTimer: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const LessonNavigation = ({
  lesson,
  progressPercent,
  hasNext,
  hasPrevious,
  isCompleted,
  autoAdvanceTimer,
  onNext,
  onPrevious
}: LessonNavigationProps) => {
  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-background/80 backdrop-blur border-t lg:border-l lg:border-t-0 border-border animate-slide-in-right">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Progress Section - Always visible on mobile */}
        <Card className="p-3 lg:p-4 animate-fade-in bg-card/90 backdrop-blur">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm lg:text-base font-medium text-foreground">
                Seu progresso
              </span>
              <span className="text-lg lg:text-xl font-bold text-primary">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-3 lg:h-4 animate-scale-in bg-secondary" 
              style={{ animationDelay: '200ms' }} 
            />
            <div className="flex justify-between items-center text-xs lg:text-sm text-muted-foreground">
              <span>Dia {lesson.Dia}</span>
              <span>Aula {lesson.Aula}</span>
            </div>
          </div>
        </Card>

        {/* Navigation Controls - Mobile Optimized */}
        <div className="flex gap-2 lg:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex-1 h-12 lg:h-11 text-sm lg:text-base font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">Ant</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="flex-1 h-12 lg:h-11 text-sm lg:text-base font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 bg-primary hover:bg-primary/90 animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            <span className="hidden sm:inline">Próxima</span>
            <span className="sm:hidden">Prox</span>
            <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 ml-1 lg:ml-2" />
          </Button>
        </div>

        {/* Auto-advance notification */}
        {isCompleted && hasNext && autoAdvanceTimer && (
          <Card className="p-3 lg:p-4 bg-primary/10 border-primary/20 animate-fade-in animate-pulse">
            <div className="flex items-center gap-2 text-sm lg:text-base">
              <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-green-400 animate-pulse" />
              <span className="text-foreground font-medium">
                Próxima aula em 3 segundos...
              </span>
            </div>
          </Card>
        )}

        {/* Study Tips Card - Mobile Optimized */}
        <Card className="p-3 lg:p-4 bg-secondary/50 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h4 className="font-medium mb-2 text-sm lg:text-base text-secondary-foreground">💡 Dica de Estudo</h4>
          <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
            Assista cada aula até o final para garantir melhor absorção do conteúdo e desbloqueio automático da próxima aula.
          </p>
        </Card>
      </div>
    </div>
  );
};
