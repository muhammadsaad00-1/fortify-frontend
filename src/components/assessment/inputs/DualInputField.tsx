import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface DualInputFieldProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  onLeftChange: (value: number) => void;
  onRightChange: (value: number) => void;
  maxValue: number;
  unit: string;
  showAverage?: boolean;
  averageLabel?: string;
  description?: string;
  error?: string;
}

export default function DualInputField({
  label,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
  maxValue,
  unit,
  showAverage = true,
  averageLabel = "Average",
  description,
  error,
}: DualInputFieldProps) {
  // Calculate average and floor
  const average = useMemo(() => {
    if (leftValue === 0 && rightValue === 0) return 0;
    const avg = (leftValue + rightValue) / 2;
    return Math.floor(avg);
  }, [leftValue, rightValue]);

  const handleInputChange = (
    value: string,
    callback: (v: number) => void
  ) => {
    if (value === "") {
      callback(0);
      return;
    }

    // Movement assessment scores are integer values.
    if (!/^\d+$/.test(value)) {
      return;
    }

    const num = Number(value);
    if (Number.isNaN(num)) {
      return;
    }

    if (num >= 0 && num <= maxValue) {
      callback(num);
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

      {/* Side by side inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">{leftLabel}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max={maxValue}
              step="1"
              value={leftValue}
              onChange={(e) => handleInputChange(e.target.value, onLeftChange)}
              onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
              placeholder="0"
              className="text-lg"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {unit}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">{rightLabel}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max={maxValue}
              step="1"
              value={rightValue}
              onChange={(e) => handleInputChange(e.target.value, onRightChange)}
              onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
              placeholder="0"
              className="text-lg"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Average calculation display */}
      {showAverage && (leftValue > 0 || rightValue > 0) && (
        <div className="p-3 rounded-lg bg-muted/50 border border-muted">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              ({leftValue} + {rightValue}) ÷ 2
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-card-foreground">
              {averageLabel}: {average} {unit}
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
