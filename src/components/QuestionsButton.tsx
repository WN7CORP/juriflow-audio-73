
import { HelpCircle, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface QuestionsButtonProps {
  canAnswerQuestions: boolean;
  totalQuestions: number;
  answeredQuestions: number;
  onOpenQuestions: () => void;
  videoProgress: number;
}

export const QuestionsButton = ({
  canAnswerQuestions,
  totalQuestions,
  answeredQuestions,
  onOpenQuestions,
  videoProgress
}: QuestionsButtonProps) => {
  const isLocked = !canAnswerQuestions;
  const progressNeeded = Math.max(0, 80 - videoProgress);
  
  const getButtonContent = () => {
    if (isLocked) {
      return (
        <>
          <Lock className="h-4 w-4" />
          <span>Resolver Questões</span>
          <Badge variant="secondary" className="bg-gray-200 text-gray-600 ml-2">
            {progressNeeded.toFixed(0)}% restantes
          </Badge>
        </>
      );
    }

    if (answeredQuestions === totalQuestions && totalQuestions > 0) {
      return (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span>Questões Completas</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
            {answeredQuestions}/{totalQuestions}
          </Badge>
        </>
      );
    }

    return (
      <>
        <HelpCircle className="h-4 w-4" />
        <span>Resolver Questões</span>
        {totalQuestions > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-2">
            {answeredQuestions}/{totalQuestions}
          </Badge>
        )}
      </>
    );
  };

  const getTooltipText = () => {
    if (isLocked) {
      return `Assista ${progressNeeded.toFixed(0)}% do vídeo para desbloquear as questões`;
    }
    if (totalQuestions === 0) {
      return "Nenhuma questão disponível para esta aula";
    }
    if (answeredQuestions === totalQuestions) {
      return "Todas as questões foram respondidas!";
    }
    return "Clique para resolver as questões da aula";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpenQuestions}
            disabled={isLocked || totalQuestions === 0}
            className={`
              relative transition-all duration-300 
              ${isLocked 
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed border-gray-200' 
                : canAnswerQuestions && answeredQuestions < totalQuestions
                  ? 'bg-primary hover:bg-primary/90 animate-pulse shadow-lg' 
                  : 'bg-primary hover:bg-primary/90'
              }
            `}
            size="lg"
          >
            {getButtonContent()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
