import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  ArrowLeft,
  Flame
} from "lucide-react";

interface ProgressDashboardProps {
  onBack: () => void;
}

export const ProgressDashboard = ({ onBack }: ProgressDashboardProps) => {
  const { 
    completedLessons, 
    totalWatchTime, 
    streak, 
    getTotalLessons,
    getCompletionRate,
    userStats
  } = useProgress();

  const totalLessons = getTotalLessons();
  const overallProgress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
  const hoursWatched = Math.floor(totalWatchTime / 3600);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-16 z-40 bg-surface-glass/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Painel de Progresso
              </h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe seu desempenho no curso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Progress Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-foreground">
                {Math.round(overallProgress)}%
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{completedLessons.size} de {totalLessons} aulas concluídas</span>
                <span>{hoursWatched} horas de estudo</span>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Sequência de Dias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-foreground">
                {streak} dias
              </div>
              <p className="text-sm text-muted-foreground">
                Continue estudando para manter sua sequência!
              </p>
              <div className="text-sm text-muted-foreground">
                Próximo objetivo: 7 dias
              </div>
            </CardContent>
          </Card>

          {/* Time Studied Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Tempo Total de Estudo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-foreground">
                {hoursWatched} horas
              </div>
              <p className="text-sm text-muted-foreground">
                Continue se dedicando para alcançar seus objetivos!
              </p>
              <div className="text-sm text-muted-foreground">
                Meta semanal: 5 horas
              </div>
            </CardContent>
          </Card>

          {/* Lessons Completed Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                Aulas Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-foreground">
                {completedLessons.size} aulas
              </div>
              <p className="text-sm text-muted-foreground">
                Continue concluindo aulas para avançar no curso!
              </p>
              <div className="text-sm text-muted-foreground">
                Meta semanal: 3 aulas
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-foreground">
                {userStats?.completionRate}%
              </div>
              <Progress value={userStats?.completionRate} className="h-3" />
              <div className="text-sm text-muted-foreground">
                Continue concluindo aulas para aumentar sua taxa de conclusão!
              </div>
            </CardContent>
          </Card>

          {/* Awards Card */}
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-foreground">
                Nenhuma conquista por enquanto
              </div>
              <p className="text-sm text-muted-foreground">
                Continue estudando para desbloquear novas conquistas!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
