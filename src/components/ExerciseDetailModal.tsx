import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Exercise } from "@/types/api";
import { Dumbbell, AlertTriangle, PlayCircle } from "lucide-react";

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

export default function ExerciseDetailModal({ exercise, open, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            {exercise.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video placeholder */}
          {exercise.video_url ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={exercise.video_url}
                className="w-full h-full"
                allowFullScreen
                title={exercise.name}
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-primary/50" />
              <p className="absolute bottom-4 text-sm text-muted-foreground">Video coming soon</p>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className="capitalize" variant={
              exercise.difficulty_level === 'beginner' ? 'default' :
              exercise.difficulty_level === 'intermediate' ? 'secondary' :
              'destructive'
            }>
              {exercise.difficulty_level}
            </Badge>
            {exercise.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{exercise.description}</p>
          </div>

          <Separator />

          {/* Instructions */}
          {exercise.instructions && (
            <div>
              <h3 className="font-semibold text-lg mb-3">How to Perform</h3>
              <div className="space-y-2">
                {exercise.instructions.split('.').filter(Boolean).map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step.trim()}.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Equipment */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Equipment Needed</h3>
            {exercise.equipment && exercise.equipment.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span className="text-sm capitalize">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No equipment required</p>
            )}
          </div>

          {/* Contraindications */}
          {exercise.contraindications && exercise.contraindications.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h3 className="font-semibold text-lg">Contraindications</h3>
                </div>
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Avoid this exercise if you have:
                  </p>
                  <ul className="space-y-1">
                    {exercise.contraindications.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-warning mt-1">•</span>
                        <span className="capitalize">{item.replace(/_/g, ' ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
