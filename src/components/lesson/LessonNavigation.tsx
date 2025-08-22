
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
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-surface-elevated border-t lg:border-l lg:border-t-0 border-border">
      <div className="p-4 lg:p-6">
        {/* Navigation Controls - Mobile Optimized */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex-1 h-10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="flex-1 h-10"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Auto-advance notification */}
        {isCompleted && hasNext && autoAdvanceTimer && (
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
            <Progress value={progressPercent} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              Continue assistindo para desbloquear o próximo conteúdo
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
