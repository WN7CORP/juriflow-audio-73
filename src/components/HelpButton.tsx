
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, X, Play, BookOpen, Trophy } from "lucide-react";

export const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: <Play className="h-5 w-5 text-primary" />,
      title: "Assista as Aulas",
      description: "Clique em qualquer aula para começar a assistir. O vídeo vai carregar automaticamente."
    },
    {
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      title: "Acompanhe seu Progresso",
      description: "Seu progresso é salvo automaticamente. Continue de onde parou a qualquer momento."
    },
    {
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      title: "Complete os Módulos",
      description: "Assista 90% da aula para marcar como concluída e desbloquear o próximo conteúdo."
    }
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-background/80 backdrop-blur border-primary/20"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md bg-background/95 backdrop-blur border-border shadow-2xl animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Como Estudar</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">
                  Dica: O vídeo avança automaticamente para a próxima aula quando termina
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
