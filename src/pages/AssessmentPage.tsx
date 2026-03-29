import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubmitAssessment } from "@/hooks/useApi";
import Navbar from "@/components/Navbar";
import DualInputField from "@/components/assessment/inputs/DualInputField";
import RepsInputField from "@/components/assessment/inputs/RepsInputField";
import TimeInputField from "@/components/assessment/inputs/TimeInputField";
import ExerciseVideoCard from "@/components/assessment/ExerciseVideoCard";
import { EXERCISE_VIDEOS, EXERCISE_DESCRIPTIONS } from "@/config/exerciseVideoMap";

const STEPS = ["Injury Status", "Movement Assessment", "Questionnaire", "Recovery Status"];

interface Assessment {
  // Raw input values
  single_leg_stand_left: number;
  single_leg_stand_right: number;
  sit_to_stand_reps: number;
  front_back_lunges_left_reps: number;
  front_back_lunges_right_reps: number;
  push_up_reps: number;
  plank_hold_duration: number;
  deep_squat_hold_duration: number;
  clock_steps_left: number;
  clock_steps_right: number;
}

const INJURY_AREAS = ["shoulder", "knee", "hip", "back"] as const;
const INJURY_STATUSES = [
  { value: "none", label: "No injury" },
  { value: "past", label: "Past injury (recovered)" },
  { value: "mild", label: "Mild (occasional discomfort)" },
  { value: "moderate", label: "Moderate (frequent pain)" },
  { value: "severe", label: "Severe (limits activity)" },
];

const EXERCISE_COACHING = {
  single_leg_stand: {
    focus: "Keep hips level and core braced while balancing.",
    avoid: ["Leaning heavily", "Rapid toe taps", "Holding breath"],
    tip: "Use a light fingertip support first, then retest without support.",
  },
  sit_to_stand: {
    focus: "Control your descent and stand tall each rep.",
    avoid: ["Pushing off knees", "Half-standing reps", "Rushing tempo"],
    tip: "Keep feet shoulder-width and drive through mid-foot.",
  },
  push_up: {
    focus: "Maintain a straight line from shoulders to heels.",
    avoid: ["Sagging hips", "Partial range", "Neck jutting forward"],
    tip: "If needed, start elevated and aim for full range quality.",
  },
  front_back_lunges: {
    focus: "Control knee alignment and keep torso stable.",
    avoid: ["Knee collapsing inward", "Bouncing", "Over-striding"],
    tip: "Track front knee over middle toes on every rep.",
  },
  plank_hold: {
    focus: "Brace glutes and abs to keep a neutral spine.",
    avoid: ["Lower-back arch", "Shoulder shrug", "Head drop"],
    tip: "Think elbows pulling toward toes to stay engaged.",
  },
  deep_squat_hold: {
    focus: "Stay upright with heels grounded and knees open.",
    avoid: ["Heels lifting", "Rounded low back", "Knee collapse"],
    tip: "Exhale slowly while holding to improve mobility control.",
  },
  clock_steps: {
    focus: "Move with balance and return under control each step.",
    avoid: ["Skipping positions", "Rushed transitions", "Trunk wobble"],
    tip: "Lightly pause at each clock point before returning center.",
  },
} as const;

function ExerciseGuide({
  exerciseKey,
}: {
  exerciseKey: keyof typeof EXERCISE_COACHING;
}) {
  const content = EXERCISE_COACHING[exerciseKey];

  return (
    <details className="rounded-xl border border-border bg-muted/30 p-4 group">
      <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-card-foreground">
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Expand Technique Guide
        </span>
        <span className="text-xs text-muted-foreground group-open:hidden">Click to open</span>
      </summary>
      <div className="mt-3 space-y-3 text-sm">
        <p>
          <span className="font-semibold">Focus:</span> {content.focus}
        </p>
        <p>
          <span className="font-semibold">Coach Tip:</span> {content.tip}
        </p>
        <div>
          <p className="font-semibold">Avoid:</p>
          <ul className="mt-1 list-disc pl-5 text-muted-foreground space-y-1">
            {content.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const submitAssessment = useSubmitAssessment();
  const [step, setStep] = useState(0);

  // Step 0 - Injury Status
  const [shoulderStatus, setShoulderStatus] = useState<string>("none");
  const [kneeStatus, setKneeStatus] = useState<string>("none");
  const [hipStatus, setHipStatus] = useState<string>("none");
  const [backStatus, setBackStatus] = useState<string>("none");

  // Step 1 - Movement Assessment (RAW INPUTS)
  const [movementInputs, setMovementInputs] = useState<Assessment>({
    single_leg_stand_left: 0,
    single_leg_stand_right: 0,
    sit_to_stand_reps: 0,
    front_back_lunges_left_reps: 0,
    front_back_lunges_right_reps: 0,
    push_up_reps: 0,
    plank_hold_duration: 0,
    deep_squat_hold_duration: 0,
    clock_steps_left: 0,
    clock_steps_right: 0,
  });

  // Step 2 - Questionnaire
  const [currentActivityLevel, setCurrentActivityLevel] = useState<string>("2");
  const [weightTrainingExperience, setWeightTrainingExperience] = useState<string>("2");
  const [gymConfidence, setGymConfidence] = useState<string>("2");
  const [primaryGoal, setPrimaryGoal] = useState<string>("2");
  const [timelineUrgency, setTimelineUrgency] = useState<string>("1");
  const [equipmentAccess, setEquipmentAccess] = useState<string>("1");
  const [readinessFatigue, setReadinessFatigue] = useState<string>("2");

  // Step 3 - Recovery
  const [sleepQuality, setSleepQuality] = useState<string>("2");
  const [stressLevel, setStressLevel] = useState<string>("1");
  const [glp1Usage, setGlp1Usage] = useState<string>("no");

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSubmit = async () => {
    try {
      const glp1Map: Record<string, "none" | "recent" | "longterm"> = {
        "no": "none",
        "current": "recent",
        "previous": "longterm",
      };

      const assessmentData = {
        // Movement Assessment - RAW INPUTS
        single_leg_stand_left: movementInputs.single_leg_stand_left,
        single_leg_stand_right: movementInputs.single_leg_stand_right,
        sit_to_stand_reps: movementInputs.sit_to_stand_reps,
        front_back_lunges_left_reps: movementInputs.front_back_lunges_left_reps,
        front_back_lunges_right_reps: movementInputs.front_back_lunges_right_reps,
        push_up_reps: movementInputs.push_up_reps,
        plank_hold_duration: movementInputs.plank_hold_duration,
        deep_squat_hold_duration: movementInputs.deep_squat_hold_duration,
        clock_steps_left: movementInputs.clock_steps_left,
        clock_steps_right: movementInputs.clock_steps_right,

        // Questionnaire
        current_activity_level: parseInt(currentActivityLevel),
        weight_training_experience: parseInt(weightTrainingExperience),
        gym_confidence: parseInt(gymConfidence),
        primary_goal: parseInt(primaryGoal),
        timeline_urgency: parseInt(timelineUrgency),
        equipment_access: parseInt(equipmentAccess),
        readiness_fatigue: parseInt(readinessFatigue),

        // Recovery
        sleep_quality: parseInt(sleepQuality),
        stress_level: parseInt(stressLevel),
        glp1_usage: (glp1Map[glp1Usage] || "none") as "none" | "recent" | "longterm",

        // Injury Status
        shoulder_status: shoulderStatus as "none" | "past" | "mild" | "moderate" | "severe",
        knee_status: kneeStatus as "none" | "past" | "mild" | "moderate" | "severe",
        hip_status: hipStatus as "none" | "past" | "mild" | "moderate" | "severe",
        back_status: backStatus as "none" | "past" | "mild" | "moderate" | "severe",
      };

      const response = await submitAssessment.mutateAsync(assessmentData);

      sessionStorage.setItem(
        "assessmentResult",
        JSON.stringify({
          assessment: response.assessment,
          results: response.results,
          program: response.program,
        })
      );

      toast({
        title: "Success",
        description: "Assessment completed successfully! Your program is being generated...",
      });

      navigate("/results");
    } catch (error: any) {
      console.error("Assessment submission error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80')",
          }}
        />
        <div className="relative container mx-auto max-w-3xl px-4 py-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Fitness Assessment
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete this comprehensive evaluation to receive your personalized program
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-muted-foreground">{STEPS[step]}</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
          <div className="mt-3 flex justify-between">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-1 text-xs ${
                  i <= step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {i < step ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <div
                    className={`h-2 w-2 rounded-full ${
                      i === step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
                <span className="hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-soft"
          >
            {/* Step 0: Injury Status */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">
                    Injury Status
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about any current or past injuries
                  </p>
                </div>

                <div className="space-y-5">
                  {INJURY_AREAS.map((area) => (
                    <div
                      key={area}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md"
                    >
                      <Label className="mb-4 block text-base font-bold text-card-foreground capitalize">
                        {area} Status
                      </Label>
                      <Select
                        value={
                          area === "shoulder"
                            ? shoulderStatus
                            : area === "knee"
                            ? kneeStatus
                            : area === "hip"
                            ? hipStatus
                            : backStatus
                        }
                        onValueChange={(val) => {
                          if (area === "shoulder") setShoulderStatus(val);
                          else if (area === "knee") setKneeStatus(val);
                          else if (area === "hip") setHipStatus(val);
                          else setBackStatus(val);
                        }}
                      >
                        <SelectTrigger className="bg-white/50 border-border/40 hover:border-primary/40 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INJURY_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Movement Assessment */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">
                    Movement Assessment
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Watch each exercise demonstration and enter your results
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-card-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Assessment Success Guide
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use this checklist for cleaner scores and consistent entries.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" /> Timing
                      </p>
                      <p className="text-sm mt-1">Start timing only when form is set. Stop when form breaks.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Safety
                      </p>
                      <p className="text-sm mt-1">If pain appears, stop immediately and record your last clean rep/time.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> Accuracy
                      </p>
                      <p className="text-sm mt-1">Type exact values manually. Scroll wheel edits are disabled to avoid mistakes.</p>
                    </div>
                  </div>

                  <details className="rounded-xl border border-border bg-card p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-card-foreground">
                      Expand Full Instructions
                    </summary>
                    <div className="mt-3 grid gap-4 md:grid-cols-2 text-sm">
                      <div>
                        <p className="font-semibold mb-1">Before You Start</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Warm up for 3-5 minutes.</li>
                          <li>Use stable footwear and clear floor space.</li>
                          <li>Keep a timer nearby for hold-based tests.</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Scoring Quality</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Only count controlled, full-range reps.</li>
                          <li>Record left/right values separately when requested.</li>
                          <li>Form quality matters more than speed.</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>

                <div className="space-y-6">
                  {/* Exercise Grid Container */}
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Single Leg Stand */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Single Leg Stand</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">1 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.single_leg_stand}
                        title="Single Leg Stand"
                        description={EXERCISE_DESCRIPTIONS.single_leg_stand}
                      />
                      <div className="mt-5 space-y-3">
                        <DualInputField
                          label="Results (seconds)"
                          leftLabel="Left"
                          rightLabel="Right"
                          leftValue={movementInputs.single_leg_stand_left}
                          rightValue={movementInputs.single_leg_stand_right}
                          onLeftChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              single_leg_stand_left: v,
                            }))
                          }
                          onRightChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              single_leg_stand_right: v,
                            }))
                          }
                          maxValue={20}
                          unit="sec"
                          showAverage={true}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="single_leg_stand" />
                      </div>
                    </motion.div>

                    {/* Sit to Stand */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Sit to Stand</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">2 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.sit_to_stand}
                        title="Sit to Stand"
                        description={EXERCISE_DESCRIPTIONS.sit_to_stand}
                      />
                      <div className="mt-5 space-y-3">
                        <RepsInputField
                          label="Reps Completed"
                          value={movementInputs.sit_to_stand_reps}
                          onChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              sit_to_stand_reps: v,
                            }))
                          }
                          maxReps={10}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="sit_to_stand" />
                      </div>
                    </motion.div>

                    {/* Push Ups */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Push Ups</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">3 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.push_up}
                        title="Push Ups"
                        description={EXERCISE_DESCRIPTIONS.push_up}
                      />
                      <div className="mt-5 space-y-3">
                        <RepsInputField
                          label="Reps Completed"
                          value={movementInputs.push_up_reps}
                          onChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              push_up_reps: v,
                            }))
                          }
                          maxReps={10}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="push_up" />
                      </div>
                    </motion.div>

                    {/* Front/Back Lunges */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Front/Back Lunges</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">4 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.front_back_lunges}
                        title="Front/Back Lunges"
                        description={EXERCISE_DESCRIPTIONS.front_back_lunges}
                      />
                      <div className="mt-5 space-y-3">
                        <DualInputField
                          label="Results (reps)"
                          leftLabel="Left"
                          rightLabel="Right"
                          leftValue={movementInputs.front_back_lunges_left_reps}
                          rightValue={movementInputs.front_back_lunges_right_reps}
                          onLeftChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              front_back_lunges_left_reps: v,
                            }))
                          }
                          onRightChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              front_back_lunges_right_reps: v,
                            }))
                          }
                          maxValue={4}
                          unit="reps"
                          showAverage={true}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="front_back_lunges" />
                      </div>
                    </motion.div>

                    {/* Plank Hold */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Plank Hold</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">5 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.plank_hold}
                        title="Plank Hold"
                        description={EXERCISE_DESCRIPTIONS.plank_hold}
                      />
                      <div className="mt-5 space-y-3">
                        <TimeInputField
                          label="Duration (seconds)"
                          value={movementInputs.plank_hold_duration}
                          onChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              plank_hold_duration: v,
                            }))
                          }
                          maxSeconds={60}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="plank_hold" />
                      </div>
                    </motion.div>

                    {/* Deep Squat Hold */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Deep Squat Hold</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">6 of 7</span>
                      </div>
                      <ExerciseVideoCard
                        videoPath={EXERCISE_VIDEOS.deep_squat_hold}
                        title="Deep Squat Hold"
                        description={EXERCISE_DESCRIPTIONS.deep_squat_hold}
                      />
                      <div className="mt-5 space-y-3">
                        <TimeInputField
                          label="Duration (seconds)"
                          value={movementInputs.deep_squat_hold_duration}
                          onChange={(v) =>
                            setMovementInputs((prev) => ({
                              ...prev,
                              deep_squat_hold_duration: v,
                            }))
                          }
                          maxSeconds={20}
                        />
                      </div>
                      <div className="mt-5">
                        <ExerciseGuide exerciseKey="deep_squat_hold" />
                      </div>
                    </motion.div>

                    {/* Clock Steps - Full Width */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="md:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-heading text-lg font-bold text-card-foreground">Clock Steps</h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">7 of 7</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <ExerciseVideoCard
                            videoPath={EXERCISE_VIDEOS.clock_steps}
                            title="Clock Steps"
                            description={EXERCISE_DESCRIPTIONS.clock_steps}
                          />
                        </div>
                        <div className="space-y-3">
                          <DualInputField
                            label="Results (steps)"
                            leftLabel="Left"
                            rightLabel="Right"
                            leftValue={movementInputs.clock_steps_left}
                            rightValue={movementInputs.clock_steps_right}
                            onLeftChange={(v) =>
                              setMovementInputs((prev) => ({
                                ...prev,
                                clock_steps_left: v,
                              }))
                            }
                            onRightChange={(v) =>
                              setMovementInputs((prev) => ({
                                ...prev,
                                clock_steps_right: v,
                              }))
                            }
                            maxValue={6}
                            unit="steps"
                            showAverage={true}
                          />
                          <div className="mt-5">
                            <ExerciseGuide exerciseKey="clock_steps" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Questionnaire */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">
                    Questionnaire
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about your fitness background and goals
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Activity Level */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Current Activity Level
                    </Label>
                    <RadioGroup
                      value={currentActivityLevel}
                      onValueChange={setCurrentActivityLevel}
                    >
                      <div className="space-y-3">
                        {[
                          { label: "Sedentary / No regular exercise", icon: "○" },
                          { label: "Light activity / 1-2x per week", icon: "○" },
                          { label: "Moderate activity / 3-4x per week", icon: "○" },
                          { label: "Very active / 5-6x per week", icon: "○" },
                          { label: "Extremely active / Daily training", icon: "○" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentActivityLevel(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              currentActivityLevel === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem value={String(idx)} id={`activity-${idx}`} />
                            <Label htmlFor={`activity-${idx}`} className="cursor-pointer text-sm">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Weight Training Experience */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Weight Training Experience
                    </Label>
                    <RadioGroup
                      value={weightTrainingExperience}
                      onValueChange={setWeightTrainingExperience}
                    >
                      <div className="space-y-3">
                        {[
                          "No weight training experience",
                          "Beginner / under 1 year",
                          "Intermediate / 1-3 years",
                          "Advanced / 3-5 years",
                          "Expert / 5+ years",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setWeightTrainingExperience(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              weightTrainingExperience === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(idx)}
                              id={`experience-${idx}`}
                            />
                            <Label htmlFor={`experience-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Gym Confidence */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Gym Confidence
                    </Label>
                    <RadioGroup
                      value={gymConfidence}
                      onValueChange={setGymConfidence}
                    >
                      <div className="space-y-3">
                        {[
                          "Very uncomfortable / Intimidated",
                          "Somewhat uncomfortable",
                          "Neutral / Getting comfortable",
                          "Comfortable / Confident",
                          "Very confident / Experienced",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setGymConfidence(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              gymConfidence === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(idx)}
                              id={`confidence-${idx}`}
                            />
                            <Label htmlFor={`confidence-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Primary Goal */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Primary Goal
                    </Label>
                    <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal}>
                      <div className="space-y-3">
                        {[
                          "Not sure / Just exploring",
                          "Weight loss",
                          "General fitness / Health",
                          "Build muscle / Strength",
                          "Athletic performance",
                          "Competitive / Sports training",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPrimaryGoal(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              primaryGoal === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem value={String(idx)} id={`goal-${idx}`} />
                            <Label htmlFor={`goal-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Timeline Urgency */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Timeline Urgency
                    </Label>
                    <RadioGroup value={timelineUrgency} onValueChange={setTimelineUrgency}>
                      <div className="space-y-3">
                        {[
                          "No timeline / Take my time",
                          "Flexible timeline / Months",
                          "Moderate timeline / Weeks",
                          "Soon / Days or weeks",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setTimelineUrgency(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              timelineUrgency === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(idx)}
                              id={`timeline-${idx}`}
                            />
                            <Label htmlFor={`timeline-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Equipment Access */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Equipment Access
                    </Label>
                    <RadioGroup
                      value={equipmentAccess}
                      onValueChange={setEquipmentAccess}
                    >
                      <div className="space-y-3">
                        {[
                          "Bodyweight only",
                          "Home equipment (dumbbells, bands, etc.)",
                          "Home gym setup",
                          "Full gym access",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setEquipmentAccess(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              equipmentAccess === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(idx)}
                              id={`equipment-${idx}`}
                            />
                            <Label htmlFor={`equipment-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Readiness/Fatigue */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Current Readiness / Fatigue
                    </Label>
                    <RadioGroup
                      value={readinessFatigue}
                      onValueChange={setReadinessFatigue}
                    >
                      <div className="space-y-3">
                        {[
                          "Extremely fatigued / Should rest",
                          "Tired / Can do light activity",
                          "Neutral / Ready for normal training",
                          "Energized / Ready for hard training",
                          "Peak energy / Maximum readiness",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setReadinessFatigue(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              readinessFatigue === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(idx)}
                              id={`fatigue-${idx}`}
                            />
                            <Label htmlFor={`fatigue-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Recovery Status */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-card-foreground">
                    Recovery Status
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about your recent recovery and health status
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Sleep Quality */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Sleep Quality
                    </Label>
                    <RadioGroup value={sleepQuality} onValueChange={setSleepQuality}>
                      <div className="space-y-3">
                        {[
                          "Very poor sleep",
                          "Poor sleep quality",
                          "Average sleep",
                          "Good sleep quality",
                          "Excellent sleep",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSleepQuality(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              sleepQuality === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem value={String(idx)} id={`sleep-${idx}`} />
                            <Label htmlFor={`sleep-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Stress Level */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      Stress Level
                    </Label>
                    <RadioGroup value={stressLevel} onValueChange={setStressLevel}>
                      <div className="space-y-3">
                        {[
                          "Very high stress",
                          "Moderate stress",
                          "Low stress",
                          "No stress / Very relaxed",
                        ].map((label, idx) => (
                          <div
                            key={idx}
                            onClick={() => setStressLevel(String(idx))}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              stressLevel === String(idx)
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem value={String(idx)} id={`stress-${idx}`} />
                            <Label htmlFor={`stress-${idx}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* GLP-1 Usage */}
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/10 p-6 shadow-md">
                    <Label className="mb-4 block text-base font-bold text-card-foreground">
                      GLP-1 Medication Usage
                    </Label>
                    <RadioGroup value={glp1Usage} onValueChange={setGlp1Usage}>
                      <div className="space-y-3">
                        {[
                          { value: "no", label: "Not using GLP-1" },
                          {
                            value: "current",
                            label: "Currently using GLP-1",
                          },
                          {
                            value: "previous",
                            label: "Previously used GLP-1",
                          },
                        ].map(({ value, label }) => (
                          <div
                            key={value}
                            onClick={() => setGlp1Usage(value)}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                              glp1Usage === value
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-white/50 hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <RadioGroupItem value={value} id={`glp1-${value}`} />
                            <Label htmlFor={`glp1-${value}`} className="cursor-pointer text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex gap-3 justify-between border-t border-border pt-6">
          <Button
            variant="outline"
            onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
            size="lg"
            className="font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} size="lg" className="font-semibold">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleSubmit}
              size="lg"
              disabled={submitAssessment.isPending}
              className="min-w-48 font-semibold"
            >
              {submitAssessment.isPending
                ? "Submitting..."
                : "Submit Assessment"}{" "}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
