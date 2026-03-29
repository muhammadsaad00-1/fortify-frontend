import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface RepsInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  maxReps: number;
  description?: string;
  error?: string;
}

export default function RepsInputField({
  label,
  value,
  onChange,
  maxReps,
  description,
  error,
}: RepsInputFieldProps) {
  const handleIncrement = () => {
    if (value < maxReps) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(0);
      return;
    }

    if (!/^\d+$/.test(raw)) {
      return;
    }

    const num = Number(raw);
    if (Number.isNaN(num)) {
      return;
    }

    if (num >= 0 && num <= maxReps) {
      onChange(num);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max={maxReps}
            value={value}
            onChange={handleInputChange}
            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
            className="text-center text-2xl font-bold"
          />
          <span className="text-sm text-muted-foreground">/ {maxReps} reps</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value === maxReps}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(value / maxReps) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {Math.round((value / maxReps) * 100)}% {value === maxReps ? "✓ Complete" : ""}
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
