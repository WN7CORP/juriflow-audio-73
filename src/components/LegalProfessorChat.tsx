
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && currentLesson) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: `Olá! Sou a Professora Dra. Maria Helena. Estou aqui para ajudá-lo com a aula "${currentLesson.Tema}". Pode me fazer qualquer pergunta sobre o conteúdo jurídico abordado ou esclarecer dúvidas sobre os conceitos apresentados. Como posso ajudá-lo?`,
        sender: 'professor',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLesson]);

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
      const { data, error } = await supabase.functions.invoke('chat-with-professor', {
        body: {
          message: inputValue,
          lessonContext: currentLesson ? {
            tema: currentLesson.Tema,
            conteudo: currentLesson.conteudo,
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
        text: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.",
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
        text: `Olá novamente! Vamos começar uma nova conversa sobre "${currentLesson.Tema}". Como posso ajudá-lo?`,
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

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary/10 backdrop-blur border-primary/30 hover:bg-primary/20"
      >
        <GraduationCap className="h-6 w-6 text-primary" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl h-[90vh] sm:h-[80vh] bg-background/95 backdrop-blur border-border shadow-2xl animate-scale-in flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Dra. Maria Helena</h3>
                    <p className="text-sm text-muted-foreground">Professora de Direito</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs"
                  >
                    Nova conversa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Professora está digitando...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 sm:p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua dúvida jurídica..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Pressione Enter para enviar sua pergunta
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
