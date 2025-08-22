import { BookOpen, Trophy, User, Bell, Menu } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  currentView?: 'modules' | 'lessons' | 'lesson' | 'dashboard';
  onDashboardClick?: () => void;
}

export const Header = ({ currentView, onDashboardClick }: HeaderProps) => {
  const { completedLessons, totalWatchTime, streak, getTotalLessons } = useProgress();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const hoursWatched = Math.floor(totalWatchTime / 3600);
  const totalLessons = getTotalLessons();
  const overallProgress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-glass/95 backdrop-blur supports-[backdrop-filter]:bg-surface-glass/95">
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between max-w-6xl">
        {/* Logo and Title - Mobile Optimized */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary flex-shrink-0">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-foreground truncate">
                Curso Jurídico Premium
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {completedLessons.size} aulas concluídas
              </p>
            </div>
          </div>

          {/* Desktop Progress Bar */}
          <div className="hidden lg:flex items-center gap-3 ml-6">
            <div className="w-24 xl:w-32">
              <Progress value={overallProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>

        {/* Desktop Stats */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">{hoursWatched}h</span>
            <span className="text-muted-foreground hidden lg:inline">estudadas</span>
          </div>
          
          {streak > 0 && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 gap-1 hidden lg:flex">
              🔥 {streak} dias
            </Badge>
          )}
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Notification */}
          <Button variant="ghost" size="sm" className="relative p-2 hidden sm:flex">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          
          {/* User Profile */}
          <Button variant="ghost" size="sm" className="p-2">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-foreground font-medium">Progresso Geral</span>
          <div className="flex items-center gap-2 text-xs">
            {streak > 0 && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs px-1 py-0">
                🔥 {streak}
              </Badge>
            )}
            <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
        </div>
        <Progress value={overallProgress} className="h-1" />
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface-elevated border-b border-border shadow-lg">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tempo estudado</span>
              <span className="text-sm font-medium">{hoursWatched}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Aulas concluídas</span>
              <span className="text-sm font-medium">{completedLessons.size}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sequência</span>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                  🔥 {streak} dias
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
