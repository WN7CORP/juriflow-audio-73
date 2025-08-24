
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OptimizedLessonFooterProps {
  hasQuestions: boolean;
  onStartQuestions: () => void;
  questionCount?: number;
  completedQuestions?: number;
  loading?: boolean;
}

export const OptimizedLessonFooter = ({ 
  hasQuestions, 
  onStartQuestions, 
  questionCount = 0,
  completedQuestions = 0,
  loading = false
}: OptimizedLessonFooterProps) => {
  if (!hasQuestions && !loading) return null;

  const progressPercent = questionCount > 0 ? (completedQuestions / questionCount) * 100 : 0;
  const isCompleted = completedQuestions === questionCount && questionCount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-40 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Question info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm">
                Questões desta aula
              </span>
            </div>
            
            {loading ? (
              <Badge variant="outline">Carregando...</Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant={isCompleted ? "default" : "secondary"}>
                  {completedQuestions}/{questionCount}
                </Badge>
                
                {isCompleted && (
                  <Badge variant="default" className="bg-green-600">
                    <Award className="h-3 w-3 mr-1" />
                    Completo
                  </Badge>
                )}
                
                {progressPercent > 0 && progressPercent < 100 && (
                  <Badge variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    {Math.round(progressPercent)}%
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          <Button 
            onClick={onStartQuestions}
            disabled={loading || questionCount === 0}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold min-w-[200px]"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            {loading 
              ? 'Carregando...' 
              : isCompleted 
                ? 'Revisar Questões' 
                : completedQuestions > 0 
                  ? 'Continuar Questões' 
                  : 'Responder Questões'
            }
          </Button>
        </div>

        {/* Progress bar for mobile */}
        {questionCount > 0 && (
          <div className="mt-3 sm:hidden">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso das questões</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
