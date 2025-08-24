
import { useState } from 'react';
import { Question } from '@/types/question';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface VideoQuestionModalProps {
  question: Question | null;
  onAnswer: (answer: string) => boolean;
  isVisible: boolean;
}

export const VideoQuestionModal = ({ question, onAnswer, isVisible }: VideoQuestionModalProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!isVisible || !question) return null;

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    
    const correct = onAnswer(selectedAnswer);
    setIsCorrect(correct);
    setAnswered(true);
  };

  const alternatives = [
    { key: 'a', text: question['Alternativa a'] },
    { key: 'b', text: question['Alternativa b'] },
    { key: 'c', text: question['Alternativa c'] },
    { key: 'd', text: question['Alternativa d'] }
  ].filter(alt => alt.text && alt.text.trim() !== '');

  const getAlternativeStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key 
        ? 'border-primary bg-primary/10 text-primary' 
        : 'border-border hover:border-primary/50 hover:bg-accent';
    }

    if (key === question.resposta.toLowerCase()) {
      return 'border-green-500 bg-green-50 text-green-700';
    }

    if (key === selectedAnswer && key !== question.resposta.toLowerCase()) {
      return 'border-red-500 bg-red-50 text-red-700';
    }

    return 'border-border bg-muted text-muted-foreground opacity-60';
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-2">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-lg lg:text-xl">
            Questão da Aula {question.Aula}
          </CardTitle>
          <div className="w-full bg-primary/20 h-1 rounded-full">
            <div className="bg-primary h-full w-4/5 rounded-full"></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-accent p-4 rounded-lg">
            <p className="text-sm lg:text-base font-medium leading-relaxed">
              {question.pergunta}
            </p>
          </div>

          <div className="space-y-3">
            {alternatives.map(({ key, text }) => (
              <button
                key={key}
                onClick={() => !answered && setSelectedAnswer(key)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${getAlternativeStyle(key)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {key.toUpperCase()}
                  </span>
                  <span className="text-sm lg:text-base leading-relaxed">
                    {text}
                  </span>
                  {answered && key === question.resposta.toLowerCase() && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto flex-shrink-0" />
                  )}
                  {answered && key === selectedAnswer && key !== question.resposta.toLowerCase() && (
                    <XCircle className="h-5 w-5 text-red-600 ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {!answered && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="flex-1 h-12"
                size="lg"
              >
                Confirmar Resposta
              </Button>
            </div>
          )}

          {answered && (
            <div className="pt-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Resposta Correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Resposta Incorreta</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                O vídeo continuará automaticamente...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
