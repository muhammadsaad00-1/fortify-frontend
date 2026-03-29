// API Response Types

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  phone: string;
  date_of_birth: string;
  gender: string;
  medical_conditions: string;
  current_medications: string;
  injuries: string;
  pain_areas: string;
  exercise_restrictions: string;
  primary_goal: string;
  secondary_goals: string;
  target_body_composition: string;
  preferred_training_style: string;
  available_equipment: string;
  training_location: string;
  session_duration_preference: string;
  weekly_availability: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface Assessment {
  id: number;
  user: number;

  // 7-Movement Assessment - RAW INPUTS
  single_leg_stand_left: number; // seconds 0-20
  single_leg_stand_right: number; // seconds 0-20
  sit_to_stand_reps: number; // 0-10
  push_up_reps: number; // 0-10
  front_back_lunges_left_reps: number; // 0-4
  front_back_lunges_right_reps: number; // 0-4
  plank_hold_duration: number; // seconds 0-60
  deep_squat_hold_duration: number; // seconds 0-20
  clock_steps_left: number; // 0-6
  clock_steps_right: number; // 0-6

  // 7-Movement Assessment - CALCULATED SCORES (0-3 each)
  single_leg_stand: number;
  sit_to_stand: number;
  front_back_lunges: number;
  push_up: number;
  plank_hold: number;
  deep_squat_hold: number;
  clock_steps: number;

  // Questionnaire (various scales)
  current_activity_level: number; // 0-4
  weight_training_experience: number; // 0-4
  gym_confidence: number; // 0-4
  primary_goal: number; // 0-5
  timeline_urgency: number; // 0-3
  equipment_access: number; // 0-3
  readiness_fatigue: number; // 0-4

  // Recovery
  sleep_quality: number; // 0-4
  stress_level: number; // 0-3
  glp1_usage: 'none' | 'recent' | 'longterm'; // GLP-1 medication usage

  // Injury Flags
  shoulder_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  knee_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  hip_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  back_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';

  // Calculated Results
  assessment_score: number; // 0-21
  questionnaire_score: number; // 0-40
  recovery_score: number; // 0-12
  composite_score: number; // 0-100
  competency_level: number; // 1-4
  competency_label: 'Rebuild' | 'Foundation' | 'Build' | 'Perform';
  flag_count: number;
  safety_mode_count: number;

  created_at: string;
  updated_at: string;
}

export interface AssessmentResults {
  assessment_score: number;
  assessment_percent: number;
  questionnaire_score: number;
  questionnaire_percent: number;
  recovery_score: number;
  recovery_percent: number;
  composite_score: number;
  competency_level: number;
  competency_label: 'Rebuild' | 'Foundation' | 'Build' | 'Perform';
  injury_flags: Record<string, 'past' | 'mild' | 'moderate' | 'severe'>; // { shoulder: 'moderate', ... }
  flag_count: number;
  safety_mode_count: number;
  recommendations: string[];
}

export interface InjuryFlag {
  area: 'shoulder' | 'knee' | 'hip' | 'back';
  status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
}

export interface AssessmentSubmission {
  // 7-Movement Assessment - RAW INPUTS
  single_leg_stand_left: number; // seconds 0-20
  single_leg_stand_right: number; // seconds 0-20
  sit_to_stand_reps: number; // 0-10
  push_up_reps: number; // 0-10
  front_back_lunges_left_reps: number; // 0-4
  front_back_lunges_right_reps: number; // 0-4
  plank_hold_duration: number; // seconds 0-60
  deep_squat_hold_duration: number; // seconds 0-20
  clock_steps_left: number; // 0-6
  clock_steps_right: number; // 0-6

  // Questionnaire
  current_activity_level: number;
  weight_training_experience: number;
  gym_confidence: number;
  primary_goal: number;
  timeline_urgency: number;
  equipment_access: number;
  readiness_fatigue: number;

  // Recovery
  sleep_quality: number;
  stress_level: number;
  glp1_usage: 'none' | 'recent' | 'longterm';

  // Injury Flags
  shoulder_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  knee_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  hip_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
  back_status: 'none' | 'past' | 'mild' | 'moderate' | 'severe';
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  video_url?: string;
  instructions?: string;
  tags: string[];
  contraindications: string[];
  equipment: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string; // comma-separated list
  include_unsafe?: boolean;
}

export interface Program {
  id: number;
  user: number;
  assessment: number;
  template_name: string;
  fitness_level: number;
  frequency: string;
  duration_weeks: number;
  program_data: ProgramData;
  created_at: string;
  updated_at: string;
}

export interface ProgramData {
  weeks: Week[];
  guidelines: string[];
  progressions: string[];
}

export interface Week {
  week_number: number;
  days: Day[];
}

export interface Day {
  day_number: number;
  focus: string;
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  exercise_id: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
  video_url?: string;
}

export interface DashboardData {
  user: User;
  latest_assessment?: Assessment;
  current_program?: Program;
  progress: {
    weeks_completed: number;
    workouts_this_week: number;
    total_workouts: number;
  };
  next_workout?: Day;
  contraindications: string[];
}

export interface VideoUploadResponse {
  message: string;
  video: {
    id: number;
    title: string;
    file_url: string;
    thumbnail_url: string;
    duration_seconds: number;
    uploaded_at: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  detail?: string;
}
