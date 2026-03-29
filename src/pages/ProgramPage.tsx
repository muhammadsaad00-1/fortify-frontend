import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Clock, ChevronDown, ChevronUp, Play, AlertTriangle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useCurrentProgram } from "@/hooks/useApi";
import Navbar from "@/components/Navbar";

interface ProgramDay {
  day_number: number;
  focus: string;
  num_exercises?: number;
  exercises: Array<{
    id?: number;
    name?: string;
    exercise_name?: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    notes?: string;
  }>;
}

interface GeneratedProgram {
  id?: number;
  name?: string;
  template_name?: string;
  frequency?: number;
  competency_level?: number;
  days?: ProgramDay[];
  program_data?: any;
  error?: string;
}

export default function ProgramPage() {
  const navigate = useNavigate();
  const { data: programData, isLoading, error } = useCurrentProgram();
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [program, setProgram] = useState<GeneratedProgram | null>(null);
  const [fromSession, setFromSession] = useState(false);

  useEffect(() => {
    // Check if program was just generated and stored in session
    const sessionData = sessionStorage.getItem("assessmentResult");
    const sessionProgram = sessionData ? JSON.parse(sessionData).program : null;

    if (sessionProgram && !sessionProgram.error) {
      setProgram(sessionProgram);
      setFromSession(true);
    } else if (programData?.program || programData?.days) {
      // Normalize both old (program_data.weeks) and new (days) formats
      let normalizedProgram: GeneratedProgram = programData.program || programData;
      const oldDays = programData?.program?.program_data?.weeks?.[0]?.days;
      const newDays = programData?.program?.days || programData?.days;
      
      if (oldDays) {
        normalizedProgram.days = oldDays;
      } else if (newDays) {
        normalizedProgram.days = newDays;
      }
      
      setProgram(normalizedProgram);
    }
  }, [programData]);

  if (isLoading && !fromSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your program...</p>
        </div>
      </div>
    );
  }

  if ((error && !fromSession) || !program) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">No Program Available</h3>
                <p className="text-sm text-muted-foreground mt-1">Complete your fitness assessment first to get a personalized program.</p>
                <Button onClick={() => navigate("/assessment")} className="mt-3" size="sm">
                  Start Assessment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Extract days from new or old format
  const programDays = program.days || program.program_data?.weeks?.[0]?.days || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {fromSession && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-success/30 bg-success/5 p-4"
          >
            <p className="text-sm font-medium text-success">✓ Program generated based on your assessment</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold text-foreground">Your Training Program</h1>
          <p className="mt-1 text-muted-foreground">
            {program.template_name || program.name || 'Program'} — {program.frequency || 'Custom'} sessions/week
          </p>
        </motion.div>

        {programDays.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">No training days available in your program yet.</p>
          </div>
        ) : (
          <Tabs defaultValue="1" className="mt-8">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(programDays.length, 4)}, minmax(0, 1fr))` }}>
              {programDays.map((day: any) => (
                <TabsTrigger key={day.day_number} value={String(day.day_number)} className="font-heading">
                  Day {day.day_number}
                </TabsTrigger>
              ))}
            </TabsList>

            {programDays.map((day: any) => (
              <TabsContent key={day.day_number} value={String(day.day_number)}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-card-foreground">Day {day.day_number}</h2>
                        <p className="text-sm text-muted-foreground">{day.focus}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {day.exercises?.length || 0} exercises
                      </span>
                    </div>

                    <div className="mt-6 space-y-3">
                      {day.exercises && day.exercises.length > 0 ? (
                        day.exercises.map((ex: any, i: number) => {
                          const key = `${day.day_number}-${i}`;
                          const isExpanded = expandedExercise === key;
                          // Handle both new (name) and old (exercise_name) formats
                          const exerciseName = ex.name || ex.exercise_name || 'Exercise';
                          const restSeconds = ex.rest_seconds || ex.rest || 60;
                          return (
                            <div key={key} className="rounded-xl border border-border bg-background overflow-hidden transition-all">
                              <button
                                onClick={() => setExpandedExercise(isExpanded ? null : key)}
                                className="flex w-full items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                  <Dumbbell className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-card-foreground truncate">{exerciseName}</p>
                                  <p className="text-xs text-muted-foreground">{ex.notes || 'Exercise'}</p>
                                </div>
                                <div className="text-right text-sm mr-2 shrink-0">
                                  <p className="font-semibold text-card-foreground">{ex.sets} × {ex.reps}</p>
                                  <p className="text-xs text-muted-foreground">
                                    <Clock className="mr-0.5 inline h-3 w-3" />{restSeconds}s rest
                                  </p>
                                </div>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                              </button>

                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  className="border-t border-border px-4 pb-4 pt-3"
                                >
                                  <p className="text-sm text-muted-foreground">{ex.notes || 'No additional notes'}</p>
                                  <div className="mt-3 flex h-32 items-center justify-center rounded-lg bg-muted">
                                    <div className="text-center">
                                      <Play className="mx-auto h-8 w-8 text-muted-foreground" />
                                      <p className="mt-1 text-xs text-muted-foreground">Video Demo</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground p-4">No exercises scheduled for this day.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
