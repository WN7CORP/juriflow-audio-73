
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface LessonFooterProps {
  hasQuestions: boolean;
  onStartQuestions: () => void;
}

export const LessonFooter = ({ hasQuestions, onStartQuestions }: LessonFooterProps) => {
  if (!hasQuestions) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
      <div className="max-w-4xl mx-auto flex justify-center">
        <Button 
          onClick={onStartQuestions}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Responder Questões
        </Button>
      </div>
    </div>
  );
};
