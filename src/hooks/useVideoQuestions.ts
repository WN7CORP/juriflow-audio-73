
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionAttempt, QuestionProgress } from '@/types/course';

const STORAGE_KEY_PREFIX = 'video-questions-';
const PROGRESS_KEY = 'question-progress';

export const useVideoQuestions = (lessonAula: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionTriggered, setQuestionTriggered] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [progress, setProgress] = useState<QuestionProgress>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    questionsAnswered: new Set()
  });
  const [loading, setLoading] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${lessonAula}`;

  // Load attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem(storageKey);
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    
    if (savedAttempts) {
      try {
        const parsedAttempts = JSON.parse(savedAttempts);
        setAttempts(parsedAttempts);
      } catch (error) {
        console.error('Error parsing saved attempts:', error);
      }
    }

    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress({
          ...parsedProgress,
          questionsAnswered: new Set(parsedProgress.questionsAnswered)
        });
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [storageKey]);

  // Fetch questions using RPC function
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!lessonAula) return;
      
      setLoading(true);
      
      try {
        console.log('Fetching questions for lesson:', lessonAula);
        
        // Use the existing RPC function
        const { data, error } = await supabase.rpc('get_lesson_questions', {
          lesson_aula: lessonAula
        });

        console.log('Questions RPC response:', { data, error });

        if (error) {
          console.error('Error fetching questions via RPC:', error);
          return;
        }

        if (data && data.length > 0) {
          // Map RPC response to Question interface
          const mappedQuestions: Question[] = data.map((item: any) => ({
            id: item.id,
            pergunta: item.pergunta,
            resposta: item.resposta,
            'Alternativa a': item.alternativa_a,
            'Alternativa b': item.alternativa_b,
            'Alternativa c': item.alternativa_c,
            'Alternativa d': item.alternativa_d,
            Aula: item.aula
          }));

          setQuestions(mappedQuestions);
          setProgress(prev => ({ ...prev, totalQuestions: mappedQuestions.length }));
          console.log('Questions loaded successfully:', mappedQuestions.length);
        } else {
          console.log('No questions found for lesson:', lessonAula);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonAula]);

  const checkVideoProgress = useCallback((currentTime: number, duration: number) => {
    if (!questions.length || questionTriggered || showQuestion || loading) return;

    const progressPercent = (currentTime / duration) * 100;
    
    // Trigger question at 80% of video
    if (progressPercent >= 80) {
      const unansweredQuestions = questions.filter(q => 
        !progress.questionsAnswered.has(q.id)
      );

      if (unansweredQuestions.length > 0) {
        // Get a random unanswered question
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const selectedQuestion = unansweredQuestions[randomIndex];
        
        setCurrentQuestion(selectedQuestion);
        setShowQuestion(true);
        setQuestionTriggered(true);
      }
    }
  }, [questions, questionTriggered, showQuestion, progress.questionsAnswered, loading]);

  const submitAnswer = useCallback((selectedAnswer: string) => {
    if (!currentQuestion) return;

    // Convert answer letter to number for comparison
    const answerMap: Record<string, string> = { 'a': '1', 'b': '2', 'c': '3', 'd': '4' };
    const selectedNumber = answerMap[selectedAnswer.toLowerCase()];
    const isCorrect = selectedNumber === currentQuestion.resposta;
    
    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timestamp: new Date()
    };

    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);

    // Update progress
    const newProgress = {
      ...progress,
      correctAnswers: progress.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: progress.wrongAnswers + (isCorrect ? 0 : 1),
      questionsAnswered: new Set([...progress.questionsAnswered, currentQuestion.id])
    };
    setProgress(newProgress);

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(newAttempts));
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        ...newProgress,
        questionsAnswered: Array.from(newProgress.questionsAnswered)
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Hide question after 2 seconds to show feedback
    setTimeout(() => {
      setShowQuestion(false);
      setCurrentQuestion(null);
      setQuestionTriggered(false);
    }, 2000);

    return isCorrect;
  }, [currentQuestion, attempts, progress, storageKey]);

  const resetQuestionTrigger = useCallback(() => {
    setQuestionTriggered(false);
  }, []);

  const startQuestionSession = useCallback(() => {
    if (questions.length > 0) {
      const unansweredQuestions = questions.filter(q => 
        !progress.questionsAnswered.has(q.id)
      );

      if (unansweredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const selectedQuestion = unansweredQuestions[randomIndex];
        
        setCurrentQuestion(selectedQuestion);
        setShowQuestion(true);
      }
    }
  }, [questions, progress.questionsAnswered]);

  return {
    questions,
    currentQuestion,
    showQuestion,
    questionTriggered,
    attempts,
    progress,
    loading,
    checkVideoProgress,
    submitAnswer,
    resetQuestionTrigger,
    startQuestionSession,
    hasQuestions: questions.length > 0
  };
};
