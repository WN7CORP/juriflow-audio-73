
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lesson } from '@/types/course';
import { Shell } from '@/components/Shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Volume2, HelpCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoQuestionModal } from '@/components/VideoQuestionModal';
import { QuestionsModal } from '@/components/QuestionsModal';
import { useVideoQuestions } from '@/hooks/useVideoQuestions';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  const {
    questions,
    currentQuestion,
    showQuestion,
    progress,
    canAnswerQuestions,
    checkVideoProgress,
    submitAnswer,
    showQuestionManually,
    hasQuestions
  } = useVideoQuestions(lesson?.Aula || '');

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching lesson with id:', id);
        const { data, error } = await supabase
          .from('VIDEO-AULAS-DIAS' as any)
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching lesson:', error);
          return;
        }

        console.log('Lesson data:', data);

        if (data) {
          const mappedLesson: Lesson = {
            id: data.id,
            Tema: data.Tema || '',
            Aula: data.Aula || '',
            Dia: data.Dia || '',
            video: data.video || '',
            capa: data.capa || '',
            conteudo: data.conteudo || '',
            Area: data.Area || ''
          };
          
          setLesson(mappedLesson);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleQuestionSelect = (questionId: number) => {
    return showQuestionManually(questionId);
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando aula...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!lesson) {
    return (
      <Shell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Aula não encontrada</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o início
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{lesson.Tema}</h1>
            <p className="text-muted-foreground">
              Aula {lesson.Aula} • Dia {lesson.Dia} • {lesson.Area}
            </p>
          </div>

          {hasQuestions && (
            <Button 
              onClick={() => setShowQuestionsModal(true)}
              variant={canAnswerQuestions ? "default" : "secondary"}
              disabled={!canAnswerQuestions && questions.length === 0}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Questões ({progress.questionsAnswered.size}/{questions.length})
            </Button>
          )}
        </div>

        {/* Video Player */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  {lesson.video ? (
                    <VideoPlayer
                      videoUrl={lesson.video}
                      onVideoEnd={() => console.log('Video ended')}
                      onVideoStart={() => console.log('Video started')}
                      title={lesson.Tema}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Vídeo não disponível</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{lesson.Tema}</h2>
                    {lesson.conteudo && (
                      <p className="text-muted-foreground">{lesson.conteudo}</p>
                    )}
                  </div>

                  {hasQuestions && (
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                          {questions.length} questões disponíveis
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => setShowQuestionsModal(true)}
                        disabled={!canAnswerQuestions}
                      >
                        {canAnswerQuestions ? 'Resolver' : 'Assista 80% do vídeo'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Aula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Área:</span>
                  <p className="text-sm">{lesson.Area}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Dia:</span>
                  <p className="text-sm">{lesson.Dia}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Aula:</span>
                  <p className="text-sm">{lesson.Aula}</p>
                </div>
                {hasQuestions && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Questões:</span>
                    <p className="text-sm">
                      {progress.questionsAnswered.size}/{questions.length} respondidas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Question Modal */}
        <VideoQuestionModal
          question={currentQuestion}
          onAnswer={submitAnswer}
          isVisible={showQuestion}
        />

        {/* Questions Modal */}
        <QuestionsModal
          isOpen={showQuestionsModal}
          onClose={() => setShowQuestionsModal(false)}
          questions={questions}
          answeredQuestions={progress.questionsAnswered}
          canAnswerQuestions={canAnswerQuestions}
          onQuestionSelect={handleQuestionSelect}
        />
      </div>
    </Shell>
  );
};

export default LessonPage;
