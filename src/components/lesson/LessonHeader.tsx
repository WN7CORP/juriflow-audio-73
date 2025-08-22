
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
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted/80 transition-all duration-200 hover:scale-105 animate-fade-in"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Badge variant="outline" className="text-sm px-3 py-1.5 font-medium">
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
        className="p-2 hover:bg-muted/80 transition-all duration-200 hover:scale-105 animate-fade-in"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <BookOpen className="h-6 w-6 text-primary animate-scale-in" style={{ animationDelay: '200ms' }} />
        <Badge variant="outline" className="text-base px-4 py-2 font-medium animate-scale-in" style={{ animationDelay: '300ms' }}>
          Dia {lesson.Dia} - Aula {lesson.Aula}
        </Badge>
      </div>
    </div>
  );
};
