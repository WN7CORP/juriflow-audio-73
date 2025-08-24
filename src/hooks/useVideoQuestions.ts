
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionAttempt, QuestionProgress } from '@/types/question';

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

  const storageKey = `${STORAGE_KEY_PREFIX}${lessonAula}`;

  // Load attempts from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem(storageKey);
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    
    if (savedAttempts) {
      const parsedAttempts = JSON.parse(savedAttempts);
      setAttempts(parsedAttempts);
    }

    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setProgress({
        ...parsedProgress,
        questionsAnswered: new Set(parsedProgress.questionsAnswered)
      });
    }
  }, [storageKey]);

  // Fetch questions for this lesson
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('QUESTÕES-CURSO')
          .select('*')
          .eq('Aula', lessonAula);

        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }

        if (data && data.length > 0) {
          // Map the data to our Question interface
          const mappedQuestions: Question[] = data.map(item => ({
            id: item.id,
            pergunta: item.pergunta || '',
            resposta: item.resposta || '',
            'Alternativa a': item['Alternativa a'] || '',
            'Alternativa b': item['Alternativa b'] || '',
            'Alternativa c': item['Alternativa c'] || '',
            'Alternativa d': item['Alternativa d'] || '',
            Aula: item.Aula || ''
          }));
          
          setQuestions(mappedQuestions);
          setProgress(prev => ({ ...prev, totalQuestions: mappedQuestions.length }));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (lessonAula) {
      fetchQuestions();
    }
  }, [lessonAula]);

  const checkVideoProgress = useCallback((currentTime: number, duration: number) => {
    if (!questions.length || questionTriggered || showQuestion) return;

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
  }, [questions, questionTriggered, showQuestion, progress.questionsAnswered]);

  const submitAnswer = useCallback((selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer.toLowerCase() === currentQuestion.resposta.toLowerCase();
    
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
    localStorage.setItem(storageKey, JSON.stringify(newAttempts));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      ...newProgress,
      questionsAnswered: Array.from(newProgress.questionsAnswered)
    }));

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

  return {
    questions,
    currentQuestion,
    showQuestion,
    questionTriggered,
    attempts,
    progress,
    checkVideoProgress,
    submitAnswer,
    resetQuestionTrigger,
    hasQuestions: questions.length > 0
  };
};
