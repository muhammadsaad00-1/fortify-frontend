// Mock data for the fitness assessment platform

export interface Exercise {
  id: string;
  name: string;
  movementPattern: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  equipment: string[];
  tags: string[];
  videoUrl?: string;
  description: string;
}

export interface WorkoutDay {
  day: number;
  name: string;
  focus: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: string;
    rest: string;
  }[];
}

export interface AssessmentResult {
  trainingAge: number;
  weeklyCapacity: number;
  conditioningBaseline: number;
  movementCompetency: number;
  totalScore: number;
  fitnessLevel: 1 | 2 | 3 | 4;
  template: string;
  contraindications: string[];
  movementWarnings: string[];
}

export const LEVEL_NAMES: Record<number, string> = {
  1: "Rebuild",
  2: "Foundation",
  3: "Build",
  4: "Perform",
};

export const LEVEL_COLORS: Record<number, string> = {
  1: "level-1",
  2: "level-2",
  3: "level-3",
  4: "level-4",
};

export const LEVEL_FREQUENCIES: Record<number, string> = {
  1: "2x/week",
  2: "3x/week",
  3: "4x/week",
  4: "4-5x/week",
};

export const MOVEMENT_ASSESSMENTS = [
  { id: "single_leg_stand", name: "Single Leg Stand", category: "Balance" },
  { id: "salute_plank", name: "Salute Plank", category: "Core" },
  { id: "lateral_load", name: "Lateral Load", category: "Core" },
  { id: "clock_steps", name: "Clock Steps", category: "Lower Body" },
  { id: "sit_to_stand", name: "Sit to Stand", category: "Lower Body" },
  { id: "front_back_lunges", name: "Front/Back Lunges", category: "Lower Body" },
  { id: "ankle_dorsiflexion", name: "Ankle Dorsiflexion", category: "Mobility" },
  { id: "overhead_squat", name: "Overhead Squat", category: "Full Body" },
  { id: "push_up", name: "Push Up", category: "Upper Body" },
  { id: "plank_hold", name: "Plank Hold", category: "Core" },
];

export const EXERCISES: Exercise[] = [
  { id: "1", name: "Goblet Squat", movementPattern: "Squat", difficulty: "Beginner", equipment: ["Dumbbell", "Kettlebell"], tags: ["quad", "glute", "core"], description: "A squat variation holding a weight at chest level." },
  { id: "2", name: "Barbell Back Squat", movementPattern: "Squat", difficulty: "Intermediate", equipment: ["Barbell", "Rack"], tags: ["quad", "glute", "posterior-chain"], description: "Fundamental compound movement for lower body strength." },
  { id: "3", name: "Romanian Deadlift", movementPattern: "Hinge", difficulty: "Intermediate", equipment: ["Barbell", "Dumbbell"], tags: ["hamstring", "glute", "posterior-chain"], description: "Hip hinge movement targeting the posterior chain." },
  { id: "4", name: "Push-Up", movementPattern: "Push", difficulty: "Beginner", equipment: ["Bodyweight"], tags: ["chest", "tricep", "shoulder"], description: "Fundamental bodyweight push exercise." },
  { id: "5", name: "Dumbbell Bench Press", movementPattern: "Push", difficulty: "Intermediate", equipment: ["Dumbbell", "Bench"], tags: ["chest", "tricep", "shoulder"], description: "Horizontal pressing with dumbbells for chest development." },
  { id: "6", name: "Pull-Up", movementPattern: "Pull", difficulty: "Advanced", equipment: ["Pull-Up Bar"], tags: ["lat", "bicep", "grip"], description: "Vertical pulling exercise for upper back and arm strength." },
  { id: "7", name: "Dumbbell Row", movementPattern: "Pull", difficulty: "Beginner", equipment: ["Dumbbell", "Bench"], tags: ["lat", "rhomboid", "bicep"], description: "Unilateral row for back development." },
  { id: "8", name: "Plank", movementPattern: "Core", difficulty: "Beginner", equipment: ["Bodyweight"], tags: ["core", "stability"], description: "Isometric core stabilization exercise." },
  { id: "9", name: "Walking Lunge", movementPattern: "Lunge", difficulty: "Intermediate", equipment: ["Dumbbell", "Bodyweight"], tags: ["quad", "glute", "balance"], description: "Dynamic single-leg exercise for lower body." },
  { id: "10", name: "Overhead Press", movementPattern: "Push", difficulty: "Intermediate", equipment: ["Barbell", "Dumbbell"], tags: ["shoulder", "tricep", "core"], description: "Vertical pressing for shoulder development." },
  { id: "11", name: "Kettlebell Swing", movementPattern: "Hinge", difficulty: "Intermediate", equipment: ["Kettlebell"], tags: ["glute", "hamstring", "cardio"], description: "Explosive hip hinge for power and conditioning." },
  { id: "12", name: "Bird Dog", movementPattern: "Core", difficulty: "Beginner", equipment: ["Bodyweight"], tags: ["core", "stability", "balance"], description: "Anti-rotation core exercise for stability." },
  { id: "13", name: "Box Step-Up", movementPattern: "Lunge", difficulty: "Beginner", equipment: ["Box", "Dumbbell"], tags: ["quad", "glute", "balance"], description: "Single-leg step-up for unilateral strength." },
  { id: "14", name: "Cable Face Pull", movementPattern: "Pull", difficulty: "Beginner", equipment: ["Cable Machine"], tags: ["rear-delt", "rotator-cuff"], description: "Corrective pulling for shoulder health." },
  { id: "15", name: "Deadlift", movementPattern: "Hinge", difficulty: "Advanced", equipment: ["Barbell"], tags: ["posterior-chain", "grip", "core"], description: "The king of hip hinge movements." },
];

export const MOCK_ASSESSMENT_RESULT: AssessmentResult = {
  trainingAge: 2,
  weeklyCapacity: 2,
  conditioningBaseline: 2,
  movementCompetency: 2,
  totalScore: 8,
  fitnessLevel: 3,
  template: "Build",
  contraindications: [],
  movementWarnings: ["Limited shoulder mobility — avoid heavy overhead pressing"],
};

export const MOCK_PROGRAM: WorkoutDay[] = [
  {
    day: 1,
    name: "Day 1",
    focus: "Lower Body Strength",
    exercises: [
      { exercise: EXERCISES[0], sets: 4, reps: "8-10", rest: "90s" },
      { exercise: EXERCISES[2], sets: 3, reps: "10-12", rest: "90s" },
      { exercise: EXERCISES[8], sets: 3, reps: "10 each", rest: "60s" },
      { exercise: EXERCISES[7], sets: 3, reps: "30-45s", rest: "30s" },
    ],
  },
  {
    day: 2,
    name: "Day 2",
    focus: "Upper Body Push",
    exercises: [
      { exercise: EXERCISES[4], sets: 4, reps: "8-10", rest: "90s" },
      { exercise: EXERCISES[9], sets: 3, reps: "8-10", rest: "90s" },
      { exercise: EXERCISES[3], sets: 3, reps: "12-15", rest: "60s" },
      { exercise: EXERCISES[11], sets: 3, reps: "10 each", rest: "30s" },
    ],
  },
  {
    day: 3,
    name: "Day 3",
    focus: "Upper Body Pull + Core",
    exercises: [
      { exercise: EXERCISES[6], sets: 4, reps: "10-12 each", rest: "90s" },
      { exercise: EXERCISES[13], sets: 3, reps: "15", rest: "60s" },
      { exercise: EXERCISES[5], sets: 3, reps: "6-8", rest: "120s" },
      { exercise: EXERCISES[7], sets: 3, reps: "45-60s", rest: "30s" },
    ],
  },
  {
    day: 4,
    name: "Day 4",
    focus: "Full Body + Conditioning",
    exercises: [
      { exercise: EXERCISES[14], sets: 4, reps: "5", rest: "120s" },
      { exercise: EXERCISES[10], sets: 4, reps: "12", rest: "60s" },
      { exercise: EXERCISES[12], sets: 3, reps: "10 each", rest: "60s" },
      { exercise: EXERCISES[11], sets: 3, reps: "10 each", rest: "30s" },
    ],
  },
];

export function calculateFitnessLevel(scores: {
  trainingAge: number;
  weeklyCapacity: number;
  conditioningBaseline: number;
  movementCompetency: number;
}): { level: 1 | 2 | 3 | 4; template: string; total: number } {
  const total = scores.trainingAge + scores.weeklyCapacity + scores.conditioningBaseline + scores.movementCompetency;
  let level: 1 | 2 | 3 | 4;
  let template: string;

  if (total <= 3) { level = 1; template = "Rebuild"; }
  else if (total <= 6) { level = 2; template = "Foundation"; }
  else if (total <= 9) { level = 3; template = "Build"; }
  else { level = 4; template = "Perform"; }

  return { level, template, total };
}

export function normalizeMovementScore(rawScore: number): number {
  // Raw: 0-20, normalized to 0-3
  if (rawScore <= 5) return 0;
  if (rawScore <= 10) return 1;
  if (rawScore <= 15) return 2;
  return 3;
}
