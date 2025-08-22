
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target, Flame, BookOpen, CheckCircle } from "lucide-react";

interface ProgressDashboardProps {
  totalLessons: number;
  totalModules: number;
}

export const ProgressDashboard = ({ totalLessons, totalModules }: ProgressDashboardProps) => {
  const { completedLessons, completedModules, totalWatchTime, streak } = useProgress();

  const completionRate = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
  const moduleCompletionRate = totalModules > 0 ? (completedModules.size / totalModules) * 100 : 0;
  const hoursWatched = Math.floor(totalWatchTime / 3600);
  const minutesWatched = Math.floor((totalWatchTime % 3600) / 60);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Progresso Geral
          </CardTitle>
          <Trophy className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground mb-2">
            {completionRate.toFixed(0)}%
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons.size} de {totalLessons} aulas
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tempo de Estudo
          </CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {hoursWatched}h {minutesWatched}m
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tempo total assistido
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sequência Diária
          </CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {streak}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Dias consecutivos
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Módulos Concluídos
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {completedModules.size}
          </div>
          <Progress value={moduleCompletionRate} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            de {totalModules} módulos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
