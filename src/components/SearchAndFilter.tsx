
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Lesson } from "@/types/course";

interface SearchAndFilterProps {
  lessons: Lesson[];
  onFilteredLessons: (lessons: Lesson[]) => void;
  className?: string;
}

export const SearchAndFilter = ({ lessons, onFilteredLessons, className = "" }: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");

  // Get unique values for filters
  const uniqueAreas = Array.from(new Set(lessons.map(lesson => lesson.Area).filter(Boolean)));
  const uniqueDays = Array.from(new Set(lessons.map(lesson => lesson.Dia))).sort((a, b) => parseInt(a) - parseInt(b));

  const applyFilters = () => {
    let filtered = lessons;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.Tema.toLowerCase().includes(term) ||
        lesson.Descricao.toLowerCase().includes(term) ||
        (lesson.Area?.toLowerCase().includes(term)) ||
        lesson.conteudo?.toLowerCase().includes(term)
      );
    }

    // Apply area filter
    if (selectedArea !== "all") {
      filtered = filtered.filter(lesson => lesson.Area === selectedArea);
    }

    // Apply day filter
    if (selectedDay !== "all") {
      filtered = filtered.filter(lesson => lesson.Dia === selectedDay);
    }

    onFilteredLessons(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea("all");
    setSelectedDay("all");
    onFilteredLessons(lessons);
  };

  const hasActiveFilters = searchTerm.trim() || selectedArea !== "all" || selectedDay !== "all";

  return (
    <Card className={`p-4 mb-6 ${className}`}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por tema, conteúdo ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
          </div>

          {/* Area Filter */}
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {uniqueAreas.map(area => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Day Filter */}
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os dias</SelectItem>
              {uniqueDays.map(day => (
                <SelectItem key={day} value={day}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Apply and Clear Buttons */}
          <div className="flex gap-2 ml-auto">
            <Button onClick={applyFilters} size="sm">
              Aplicar
            </Button>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">Filtros ativos:</span>
            {searchTerm.trim() && (
              <Badge variant="secondary" className="text-xs">
                Busca: "{searchTerm}"
              </Badge>
            )}
            {selectedArea !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Área: {selectedArea}
              </Badge>
            )}
            {selectedDay !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Dia: {selectedDay}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
