import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useExercises } from "@/hooks/useApi";
import ExerciseDetailModal from "@/components/ExerciseDetailModal";
import { Exercise } from "@/types/api";
import Navbar from "@/components/Navbar";

export default function ExerciseLibraryPage() {
  const navigate = useNavigate();
  const { data: exercisesData, isLoading, error } = useExercises();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const exercises = exercisesData?.exercises || [];

  // Extract unique tags from all exercises
  const categories = useMemo(() => {
    const allTags = exercises.flatMap((e) => e.tags || []);
    return [...new Set(allTags)];
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                         e.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || (e.tags || []).includes(categoryFilter);
      const matchDiff = difficultyFilter === "all" || e.difficulty_level === difficultyFilter;
      return matchSearch && matchCategory && matchDiff;
    });
  }, [exercises, search, categoryFilter, difficultyFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">Failed to load exercises</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80')" }}
        />
        <div className="relative container mx-auto h-full px-4 flex flex-col justify-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Exercise Library</h1>
          <p className="mt-2 text-lg text-muted-foreground">{exercises.length} evidence-based exercises to build your perfect program</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex, i) => (
            <motion.div 
              key={ex.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.03 }} 
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-soft hover:shadow-elevated transition-all cursor-pointer hover:border-primary/50 group"
              onClick={() => setSelectedExercise(ex)}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md group-hover:shadow-lg transition-shadow">
                  <Dumbbell className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{ex.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">{ex.difficulty_level}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2 group-hover:text-card-foreground transition-colors">{ex.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${
                  ex.difficulty_level === 'beginner' ? "bg-success/10 text-success" :
                  ex.difficulty_level === 'intermediate' ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                }`}>{ex.difficulty_level}</span>
                {(ex.tags || []).slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{tag.replace('_', ' ')}</span>
                ))}
              </div>
              {ex.equipment && ex.equipment.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">Equipment: </span>{ex.equipment.join(', ')}
                </div>
              )}
              <p className="mt-3 text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Click for details <span className="group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No exercises match your filters</p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal 
        exercise={selectedExercise} 
        open={!!selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
      />
    </div>
  );
}
