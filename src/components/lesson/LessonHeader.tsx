
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Lesson } from "@/types/course";

interface LessonHeaderProps {
  lesson: Lesson;
  onBack: () => void;
  isMobile?: boolean;
}

export const LessonHeader = ({ lesson, onBack, isMobile = false }: LessonHeaderProps) => {
  if (isMobile) {
    return (
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border animate-slide-in-right">
        <div className="flex items-center justify-between p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-1 animate-fade-in">
              Dia {lesson.Dia} - Aula {lesson.Aula}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 lg:p-6 border-b border-border bg-background/80 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="p-2 hover:bg-muted/80 transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 animate-fade-in">
        <BookOpen className="h-5 w-5 text-primary" />
        <Badge variant="outline" className="animate-scale-in">
          Dia {lesson.Dia} - Aula {lesson.Aula}
        </Badge>
      </div>
    </div>
  );
};
