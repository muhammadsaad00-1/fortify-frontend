import apiClient from './apiClient';
import { Exercise, ExerciseFilters } from '@/types/api';

interface ExerciseListResponse {
  count: number;
  exercises: Exercise[];
}

interface ExerciseSafetyCheck {
  exercise_id: number;
  is_safe: boolean;
  warnings: string[];
  alternatives: Exercise[];
}

interface ExerciseRecommendations {
  recommended: Exercise[];
  reasoning: string[];
}

export const exerciseService = {
  /**
   * Get all exercises
   * GET /api/exercises/
   */
  listExercises: async (): Promise<ExerciseListResponse> => {
    return apiClient.get<ExerciseListResponse>('/api/exercises/');
  },

  /**
   * Get filtered exercises based on user preferences
   * GET /api/exercises/filtered/
   */
  getFilteredExercises: async (filters: ExerciseFilters): Promise<ExerciseListResponse> => {
    const params = new URLSearchParams();
    if (filters.equipment) params.append('equipment', filters.equipment);
    if (filters.fitness_level) params.append('fitness_level', filters.fitness_level);
    if (filters.include_unsafe !== undefined) params.append('include_unsafe', String(filters.include_unsafe));
    
    const queryString = params.toString();
    return apiClient.get<ExerciseListResponse>(`/api/exercises/filtered/${queryString ? '?' + queryString : ''}`);
  },

  /**
   * Check if an exercise is safe for user
   * POST /api/exercises/check-safety/
   */
  checkExerciseSafety: async (exerciseId: number): Promise<ExerciseSafetyCheck> => {
    return apiClient.post<ExerciseSafetyCheck>('/api/exercises/check-safety/', {
      exercise_id: exerciseId,
    });
  },

  /**
   * Get exercise recommendations based on user profile
   * GET /api/exercises/recommendations/
   */
  getRecommendations: async (): Promise<ExerciseRecommendations> => {
    return apiClient.get<ExerciseRecommendations>('/api/exercises/recommendations/');
  },
};

export default exerciseService;
