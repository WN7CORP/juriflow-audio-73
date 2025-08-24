
import { useState } from 'react';
import { Question } from '@/types/question';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { HelpCircle, Lock, CheckCircle, Clock } from 'lucide-react';

interface QuestionsListProps {
  questions: Question[];
  answeredQuestions: Set<number>;
  canAnswerQuestions: boolean;
  onQuestionSelect: (questionId: number) => boolean;
}

export const QuestionsList = ({ 
  questions, 
  answeredQuestions, 
  canAnswerQuestions, 
  onQuestionSelect 
}: QuestionsListProps) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const handleQuestionClick = (questionId: number) => {
    if (!canAnswerQuestions) return;
    
    const success = onQuestionSelect(questionId);
    if (success) {
      setSelectedQuestionId(questionId);
    }
  };

  const getQuestionStatus = (questionId: number) => {
    if (answeredQuestions.has(questionId)) {
      return 'answered';
    }
    if (!canAnswerQuestions) {
      return 'locked';
    }
    return 'available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Respondida</Badge>;
      case 'locked':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Bloqueada</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Disponível</Badge>;
    }
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma questão disponível para esta aula</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Questões da Aula
          </CardTitle>
          {!canAnswerQuestions && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
              <Clock className="h-4 w-4" />
              <span>Assista pelo menos 80% do vídeo para desbloquear as questões</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
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
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status)}
                        <span className="font-medium text-sm">
                          Questão {index + 1}
                        </span>
                        {getStatusBadge(status)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {question.pergunta}
                      </p>
                    </div>
                    
                    {isClickable && (
                      <Button
                        size="sm"
                        onClick={() => handleQuestionClick(question.id)}
                        className="ml-3"
                      >
                        Responder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        {answeredQuestions.size} de {questions.length} questões respondidas
      </div>
    </div>
  );
};
