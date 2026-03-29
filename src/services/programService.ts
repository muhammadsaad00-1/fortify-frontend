import apiClient from './apiClient';
import { Program } from '@/types/api';

interface ProgramResponse {
  message?: string;
  id?: number;
  name?: string;
  template_name?: string;
  frequency?: number;
  competency_level?: number;
  days?: Array<{
    day_number: number;
    focus: string;
    num_exercises: number;
    exercises: Array<{
      id: number;
      name: string;
      sets: number;
      reps: number;
      rest_seconds: number;
    }>;
  }>;
  program?: Program;
  error?: string;
}

interface AssessmentWithProgram {
  message: string;
  assessment: any;
  results: any;
  program: ProgramResponse;
}

export const programService = {
  /**
   * Get current program for user
   * GET /api/program/current/
   */
  getCurrentProgram: async (): Promise<ProgramResponse> => {
    return apiClient.get<ProgramResponse>('/api/program/current/');
  },

  /**
   * Generate a new program based on latest assessment
   * POST /api/program/generate/
   * Note: Program is now auto-generated during assessment submission
   */
  generateProgram: async (assessmentId?: number): Promise<ProgramResponse> => {
    return apiClient.post<ProgramResponse>('/api/program/generate/', {
      assessment_id: assessmentId,
    });
  },

  /**
   * Extract program data from assessment submission response
   * The assessment submission endpoint now returns program data automatically
   */
  extractProgramFromAssessment: (assessmentResponse: AssessmentWithProgram): ProgramResponse => {
    return assessmentResponse.program;
  },
};

export default programService;

