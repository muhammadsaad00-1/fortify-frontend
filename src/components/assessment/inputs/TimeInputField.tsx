import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  maxSeconds: number;
  description?: string;
  error?: string;
}

export default function TimeInputField({
  label,
  value,
  onChange,
  maxSeconds,
  description,
  error,
}: TimeInputFieldProps) {
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

    if (num >= 0 && num <= maxSeconds) {
      onChange(num);
    }
  };

  const getPercentage = () => (value / maxSeconds) * 100;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="number"
          min="0"
          max={maxSeconds}
          step="1"
          value={value}
          onChange={handleInputChange}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          placeholder="0"
          className="text-2xl font-bold text-center"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          / {maxSeconds} seconds
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(getPercentage(), 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(getPercentage())}%
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
