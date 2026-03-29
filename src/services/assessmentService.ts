import apiClient from './apiClient';
import {
  Assessment,
  AssessmentSubmission,
  AssessmentResults,
} from '@/types/api';

interface AssessmentResponse {
  message: string;
  assessment: Assessment;
  results: AssessmentResults;
  program?: any;
  email_sent?: boolean;
  email_error?: string;
}

interface AssessmentListResponse {
  count: number;
  assessments: Assessment[];
}

interface LatestAssessmentResponse {
  assessment: Assessment;
  results: AssessmentResults;
}

export const assessmentService = {
  /**
   * Submit a comprehensive fitness assessment
   * POST /api/assessment/submit/
   */
  submitAssessment: async (data: AssessmentSubmission): Promise<AssessmentResponse> => {
    return apiClient.post<AssessmentResponse>('/api/assessment/submit/', data);
  },

  /**
   * Get all assessments for current user
   * GET /api/assessment/list/
   */
  getAssessments: async (): Promise<AssessmentListResponse> => {
    return apiClient.get<AssessmentListResponse>('/api/assessment/list/');
  },

  /**
   * Get latest assessment for current user
   * GET /api/assessment/latest/
   */
  getLatestAssessment: async (): Promise<LatestAssessmentResponse> => {
    return apiClient.get<LatestAssessmentResponse>('/api/assessment/latest/');
  },

  /**
   * Get assessment by ID
   * GET /api/assessment/{id}/
   */
  getAssessmentById: async (id: number): Promise<Assessment> => {
    return apiClient.get<Assessment>(`/api/assessment/${id}/`);
  },
};

export default assessmentService;
