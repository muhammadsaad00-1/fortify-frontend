import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("assessmentResult");
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);
      
      // Trigger confetti celebration
      setTimeout(() => {
        // First burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 }
        });
      }, 500);
      
      // Second burst after 1 second gap
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 }
        });
      }, 1500);
    }
  }, []);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const resultsData = result.results;
  const compositeScore = resultsData?.composite_score || 0;
  const rawCompetencyLevel = resultsData?.competency_level || 1;

  const competencyLabelByLevel: Record<number, string> = {
    1: "Rebuild",
    2: "Foundation",
    3: "Build",
    4: "Perform",
  };

  const assessmentScore = resultsData?.assessment_score || 0;
  const assessmentPercent = resultsData?.assessment_percent || 0;
  const questionnaireScore = resultsData?.questionnaire_score || 0;
  const questionnairePercent = resultsData?.questionnaire_percent || 0;
  const recoveryScore = resultsData?.recovery_score || 0;
  const recoveryPercent = resultsData?.recovery_percent || 0;
  const flagCount = resultsData?.flag_count || 0;
  const safetyModeCount = resultsData?.safety_mode_count || 0;
  const recommendations = resultsData?.recommendations || [];

  const getBaseLevelFromScore = (score: number): 1 | 2 | 3 | 4 => {
    if (score >= 80) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  // Recompute level from score + flags to guard against stale session/back-end mismatches.
  const baseLevel = getBaseLevelFromScore(compositeScore);
  const effectiveCompetencyLevel: 1 | 2 | 3 | 4 =
    safetyModeCount > 0 ? 1 : flagCount > 0 ? (Math.min(baseLevel, 2) as 1 | 2) : baseLevel;

  const competencyLevel = effectiveCompetencyLevel || rawCompetencyLevel;

  // Derive label from level for a stable UI even if backend sends stale label text.
  const competencyLabel = competencyLabelByLevel[competencyLevel] || "Rebuild";

  // Color based on competency level
  const levelColors = {
    1: "hsl(0, 72%, 55%)",    // Rebuild - Red
    2: "hsl(38, 92%, 50%)",   // Foundation - Orange
    3: "hsl(215, 80%, 48%)",  // Build - Blue
    4: "hsl(152, 60%, 42%)",  // Perform - Green
  };

  const levelBgColors = {
    1: "bg-red-100 text-red-900",
    2: "bg-orange-100 text-orange-900",
    3: "bg-blue-100 text-blue-900",
    4: "bg-green-100 text-green-900",
  };

  const levelColor = levelColors[competencyLevel as 1 | 2 | 3 | 4];
  const levelBg = levelBgColors[competencyLevel as 1 | 2 | 3 | 4];

  const chartData = [{ name: "Score", value: compositeScore, fill: levelColor }];

  const domains = [
    { label: "Movements", value: assessmentPercent, score: assessmentScore, maxScore: 21, max: 100 },
    { label: "Questionnaire", value: questionnairePercent, score: questionnaireScore, max: 100 },
    { label: "Recovery", value: recoveryPercent, score: recoveryScore, max: 100 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80')",
          }}
        />
        <div className="relative container mx-auto max-w-4xl px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Assessment Complete!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Here's your personalized fitness readiness report
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Composite Score Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-8 shadow-elevated text-center"
          >
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Competency Level
            </h2>
            <div className="mx-auto mt-4 h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-16">
              <span className="font-heading text-6xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                {compositeScore}
              </span>
              <span
                className={`ml-3 rounded-full px-4 py-1.5 text-sm font-bold ${levelBg} shadow-md`}
              >
                {competencyLabel}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Composite Score: {compositeScore} / 100
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Level:{" "}
              <span className="font-semibold text-card-foreground">
                {competencyLabel} ({competencyLevel}/4)
              </span>
            </p>
          </motion.div>

          {/* Domain Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-soft"
          >
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              Score Breakdown
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three assessment domains
            </p>
            <div className="mt-6 space-y-5">
              {domains.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-card-foreground">
                      {d.label}
                    </span>
                    <span className="font-bold text-card-foreground">
                      {d.label === "Movements" ? `${Math.round(d.score)} / ${d.maxScore}` : `${Math.round(d.value)}%`}
                    </span>
                  </div>
                  <Progress value={d.value} className="mt-2 h-3" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Injury and Safety Status */}
        {(flagCount > 0 || safetyModeCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 rounded-2xl border border-warning/30 bg-warning/5 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <h3 className="font-heading font-semibold text-card-foreground">
                Health Status Summary
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {flagCount > 0 && (
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <p className="text-sm font-medium text-card-foreground">
                    Injury Flags Reported
                  </p>
                  <p className="text-lg font-bold text-warning mt-1">
                    {flagCount} area{flagCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
              {safetyModeCount > 0 && (
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <p className="text-sm font-medium text-card-foreground">
                    Safety Limitations Active
                  </p>
                  <p className="text-lg font-bold text-warning mt-1">
                    {safetyModeCount} movement{safetyModeCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
            {safetyModeCount > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Some movements will be excluded from your personalized program to
                prioritize safety and recovery.
              </p>
            )}
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-soft"
        >
          <h2 className="font-heading text-lg font-semibold text-card-foreground">
            Recommendations
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on your assessment score of {compositeScore}/100 and competency
            level {competencyLabel}, here's what we recommend:
          </p>

          {recommendations && recommendations.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No specific recommendations at this time.
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { level: 1, label: "Rebuild" },
                { level: 2, label: "Foundation" },
                { level: 3, label: "Build" },
                { level: 4, label: "Perform" },
              ] as const
            ).map(({ level, label }) => (
              <div
                key={level}
                className={`rounded-xl border p-4 text-center ${
                  competencyLevel === level
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="font-heading text-sm font-bold text-card-foreground">
                  {label}
                </span>
                <p className="text-xs text-muted-foreground mt-1">Level {level}</p>
                {competencyLevel === level && (
                  <CheckCircle2 className="mx-auto mt-2 h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/2 p-8 shadow-soft"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="font-heading text-lg font-semibold text-card-foreground">
                Expand Your Knowledge
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                To deepen your understanding of exercise techniques, progressive training methods, and fitness best practices, we recommend exploring comprehensive resources. Click below to access detailed information and expert guidance.
              </p>
              <a
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Learn More About Exercise Techniques <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Generated Program Section - REMOVED */}
        {/* Program generation has been streamlined - users should retake assessment if needed */}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button variant="hero" size="xl" onClick={() => navigate("/dashboard")}>
            View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
