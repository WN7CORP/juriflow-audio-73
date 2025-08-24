
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Lesson } from "@/types/course";

interface SearchAndFilterProps {
  lessons: Lesson[];
  onFilteredLessons: (lessons: Lesson[]) => void;
}

export const SearchAndFilter = ({ lessons, onFilteredLessons }: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Get unique areas and modules from lessons
  const areas = Array.from(new Set(lessons.map(lesson => lesson.Area).filter(Boolean)));
  const modules = Array.from(new Set(lessons.map(lesson => lesson.Modulo || lesson.modulo).filter(Boolean)));

  // Filter lessons based on search and filters
  useEffect(() => {
    let filtered = lessons;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(lesson => 
        lesson.Tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.conteudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.Area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.Modulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.modulo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply area filter
    if (selectedArea) {
      filtered = filtered.filter(lesson => lesson.Area === selectedArea);
    }

    // Apply module filter
    if (selectedModule) {
      filtered = filtered.filter(lesson => 
        lesson.Modulo === selectedModule || lesson.modulo === selectedModule
      );
    }

    onFilteredLessons(filtered);
  }, [lessons, searchTerm, selectedArea, selectedModule, onFilteredLessons]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea(null);
    setSelectedModule(null);
  };

  const hasActiveFilters = searchTerm || selectedArea || selectedModule;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por tema, conteúdo, área ou módulo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border-border focus:border-primary transition-all duration-300"
        />
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>Filtros:</span>
        </div>

        {/* Area Filter */}
        <div className="flex flex-wrap gap-1">
          {areas.map(area => (
            <Badge
              key={area}
              variant={selectedArea === area ? "default" : "outline"}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedArea(selectedArea === area ? null : area)}
            >
              {area}
            </Badge>
          ))}
        </div>

        {/* Module Filter */}
        <div className="flex flex-wrap gap-1">
          {modules.map(module => (
            <Badge
              key={module}
              variant={selectedModule === module ? "default" : "outline"}
              className="cursor-pointer transition-all duration-300 hover:scale-105 bg-accent/50"
              onClick={() => setSelectedModule(selectedModule === module ? null : module)}
            >
              {module}
            </Badge>
          ))}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};
