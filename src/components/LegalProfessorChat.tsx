
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, X, Send, Loader2, Sparkles } from "lucide-react";
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
  isVisible?: boolean;
}

export const LegalProfessorChat = ({ currentLesson, isVisible = false }: LegalProfessorChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
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
        text: `👩‍⚖️ Olá! Sou a Professora Dra. Maria Helena. 📚 Estou aqui para ajudá-lo com a aula "${currentLesson.Tema}". 

🎯 Pode me fazer qualquer pergunta sobre:
✅ Conceitos jurídicos da aula
⚖️ Jurisprudência relacionada
📖 Interpretação de artigos
💡 Exemplos práticos

Como posso ajudá-lo hoje? 🤔`,
        sender: 'professor',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLesson]);

  const typeMessage = async (text: string) => {
    setIsTyping(true);
    setTypingText("");
    
    const words = text.split(' ');
    let currentText = "";
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setTypingText(currentText);
      
      // Velocidade variável baseada no tamanho da palavra
      const delay = words[i].length > 3 ? 150 : 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Pequena pausa antes de mostrar a mensagem final
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsTyping(false);
    setTypingText("");
    
    return text;
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

      // Animar a digitação da resposta
      const finalText = await typeMessage(data.response);

      const professorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: finalText,
        sender: 'professor',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, professorMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorText = "😔 Desculpe, ocorreu um erro ao processar sua pergunta. ⚠️ Tente novamente em alguns instantes. 🔄";
      const finalErrorText = await typeMessage(errorText);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: finalErrorText,
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
        text: `🔄 Olá novamente! Vamos começar uma nova conversa sobre "${currentLesson.Tema}". 

🎓 Como posso ajudá-lo desta vez? ✨`,
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

  // Só renderiza se estiver visível (durante uma aula)
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-125 bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-sm border-primary/40 hover:bg-gradient-to-r hover:from-primary/30 hover:to-purple-500/30 animate-bounce hover:animate-none group"
      >
        <div className="relative">
          <GraduationCap className="h-7 w-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500 animate-pulse" />
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <Card className="w-full max-w-2xl h-[90vh] sm:h-[80vh] bg-background/98 backdrop-blur-xl border-border shadow-2xl animate-scale-in flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 animate-slide-in-right">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      👩‍⚖️ Dra. Maria Helena 
                      <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full animate-pulse">
                        • Online
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">🎓 Professora de Direito • 📚 Especialista Jurídica</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                  >
                    🔄 Nova conversa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
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
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground animate-slide-in-right'
                          : 'bg-gradient-to-r from-muted to-muted/80 text-foreground animate-slide-in-left border border-border/50'
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
                
                {/* Animação de digitação */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="max-w-[85%] rounded-2xl p-4 bg-gradient-to-r from-muted to-muted/80 border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">👩‍⚖️ Professora está digitando...</span>
                      </div>
                      {typingText && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap mt-2 animate-fade-in">
                          {typingText}
                          <span className="animate-pulse">|</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {isLoading && !isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gradient-to-r from-muted to-muted/80 rounded-2xl p-4 flex items-center gap-3 border border-border/50">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">🤔 Analisando sua pergunta...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 sm:p-6 border-t border-border bg-gradient-to-r from-background to-muted/20">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="💬 Digite sua dúvida jurídica..."
                  disabled={isLoading || isTyping}
                  className="flex-1 rounded-xl border-border/50 focus:border-primary transition-all duration-200 hover:border-primary/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || isTyping}
                  size="sm"
                  className="px-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                ⚡ Pressione Enter para enviar • 🎯 Perguntas específicas geram melhores respostas
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
