
import { useState } from 'react';
import { Question } from '@/types/question';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { HelpCircle, CheckCircle, Lock, X } from 'lucide-react';
import { Progress } from './ui/progress';

interface QuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  answeredQuestions: Set<number>;
  canAnswerQuestions: boolean;
  onQuestionSelect: (questionId: number) => boolean;
}

export const QuestionsModal = ({
  isOpen,
  onClose,
  questions,
  answeredQuestions,
  canAnswerQuestions,
  onQuestionSelect
}: QuestionsModalProps) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const handleQuestionClick = (questionId: number) => {
    if (!canAnswerQuestions || answeredQuestions.has(questionId)) return;
    
    const success = onQuestionSelect(questionId);
    if (success) {
      setSelectedQuestionId(questionId);
      onClose(); // Close modal when question is selected
    }
  };

  const getQuestionStatus = (questionId: number) => {
    if (answeredQuestions.has(questionId)) return 'answered';
    if (!canAnswerQuestions) return 'locked';
    return 'available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <HelpCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const progressPercent = questions.length > 0 ? (answeredQuestions.size / questions.length) * 100 : 0;

  if (questions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Questões da Aula
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma questão disponível para esta aula</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              <span>Questões da Aula</span>
              <Badge variant="outline">
                {answeredQuestions.size}/{questions.length} respondidas
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso das questões</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {!canAnswerQuestions && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">
                    Assista pelo menos 80% do vídeo para desbloquear as questões
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {questions.map((question, index) => {
            const status = getQuestionStatus(question.id);
            const isClickable = canAnswerQuestions && status !== 'answered';

            return (
              <Card 
                key={question.id}
                className={`transition-all duration-200 ${
                  isClickable 
                    ? 'cursor-pointer hover:shadow-md hover:border-primary' 
                    : 'opacity-60'
                } ${status === 'answered' ? 'bg-green-50 border-green-200' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            Questão {index + 1}
                          </span>
                          <Badge variant={status === 'answered' ? 'default' : 'secondary'}>
                            {status === 'answered' ? 'Respondida' : 
                             status === 'locked' ? 'Bloqueada' : 'Disponível'}
                          </Badge>
                        </div>
                        
                        {isClickable && (
                          <Button
                            onClick={() => handleQuestionClick(question.id)}
                            size="sm"
                          >
                            Responder
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {question.pergunta}
                      </p>
                      
                      {status === 'answered' && (
                        <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-lg p-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Questão já respondida</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {answeredQuestions.size} de {questions.length} questões respondidas
          </div>
          
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
