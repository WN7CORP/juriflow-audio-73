
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Lesson } from "@/types/course";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'professor';
  timestamp: Date;
}

interface LegalProfessorChatProps {
  currentLesson?: Lesson;
}

export const LegalProfessorChat = ({ currentLesson }: LegalProfessorChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && currentLesson) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: `👩‍⚖️ Olá! Sou a Professora Dra. Maria Helena. Estou aqui para ajudá-lo com a aula "${currentLesson.Tema}" da área de ${currentLesson.Area || 'Direito'}. 

📚 Pode me fazer qualquer pergunta sobre:
• Conceitos jurídicos abordados
• Interpretação de artigos de lei
• Exemplos práticos
• Jurisprudência relevante
• Esclarecimento de dúvidas

💡 Como posso ajudá-lo hoje?`,
        sender: 'professor',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLesson]);

  const simulateTyping = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      // Simula tempo de digitação baseado no tamanho do texto
      const typingTime = Math.min(text.length * 30, 3000);
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, typingTime);
    });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      await simulateTyping("Analisando sua pergunta...");

      const { data, error } = await supabase.functions.invoke('chat-with-professor', {
        body: {
          message: inputValue,
          lessonContext: currentLesson ? {
            tema: currentLesson.Tema,
            conteudo: currentLesson.conteudo,
            area: currentLesson.Area,
            dia: currentLesson.Dia,
            aula: currentLesson.Aula
          } : null
        }
      });

      if (error) throw error;

      const professorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'professor',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, professorMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "😔 Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.",
        sender: 'professor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (currentLesson) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-new',
        text: `🔄 Vamos começar uma nova conversa sobre "${currentLesson.Tema}"! Como posso ajudá-lo?`,
        sender: 'professor',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages([]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Só renderiza se estivermos em uma aula
  if (!currentLesson) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 p-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur border-primary/40 hover:bg-gradient-to-r hover:from-primary/30 hover:to-purple-500/30 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <GraduationCap className="h-7 w-7 text-primary animate-pulse" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl h-[90vh] sm:h-[80vh] bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl animate-scale-in flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-purple-500/10 animate-slide-in-right">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full flex items-center justify-center animate-pulse">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>👩‍⚖️ Dra. Maria Helena</h3>
                    <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>Professora de {currentLesson.Area || 'Direito'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs hover:bg-muted/80 transition-all duration-200 hover:scale-105"
                  >
                    🔄 Nova conversa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-muted/80 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
                          : 'bg-gradient-to-r from-muted to-muted/80 text-foreground shadow-md border border-border/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gradient-to-r from-muted to-muted/80 rounded-2xl p-4 flex items-center gap-3 shadow-md border border-border/50">
                      <div className="flex space-x-1 animate-pulse">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">👩‍⚖️ Professora está analisando...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 sm:p-6 border-t border-border/50 bg-gradient-to-r from-background/50 to-muted/20 animate-slide-in-right">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="💬 Digite sua dúvida jurídica..."
                  disabled={isLoading || isTyping}
                  className="flex-1 rounded-xl border-primary/20 focus:border-primary/50 transition-all duration-300 focus:shadow-lg"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || isTyping}
                  size="sm"
                  className="px-4 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                ⚡ Pressione Enter para enviar • 🤖 IA especializada em Direito
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
