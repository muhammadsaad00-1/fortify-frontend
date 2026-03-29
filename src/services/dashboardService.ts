import apiClient from './apiClient';
import { DashboardData } from '@/types/api';

export const dashboardService = {
  /**
   * Get dashboard overview data for current user
   * GET /api/dashboard/
   * Note: This endpoint may need to be created on backend
   * For now, we'll fetch individual pieces and combine them
   */
  getDashboardData: async (): Promise<DashboardData> => {
    // This is a composite call - fetching multiple endpoints
    // In production, you might want a dedicated dashboard endpoint
    try {
      const [user, latestAssessment, currentProgram] = await Promise.allSettled([
        apiClient.get('/api/auth/profile/'),
        apiClient.get('/api/assessment/latest/'),
        apiClient.get('/api/program/current/'),
      ]);

      const dashboardData: DashboardData = {
        user: user.status === 'fulfilled' ? (user.value as any).user : null,
        latest_assessment: latestAssessment.status === 'fulfilled' ? (latestAssessment.value as any).assessment : undefined,
        current_program: currentProgram.status === 'fulfilled' ? (currentProgram.value as any).program : undefined,
        progress: {
          weeks_completed: 0,
          workouts_this_week: 2,
          total_workouts: 8,
        },
        next_workout: undefined,
        contraindications: [],
      };

      return dashboardData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user progress metrics
   */
  getProgress: async () => {
    return apiClient.get('/api/progress/');
  },
};

export default dashboardService;
