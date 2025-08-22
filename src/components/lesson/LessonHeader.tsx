
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
      <div className="sticky top-0 z-50 bg-surface-glass/95 backdrop-blur border-b border-border">
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
    );
  }

  return (
    <div className="flex items-center gap-4 p-6 border-b border-border">
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
  );
};
