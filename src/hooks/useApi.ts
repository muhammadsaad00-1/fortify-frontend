import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentService, exerciseService, programService, dashboardService, uploadService } from '@/services';
import { AssessmentSubmission, ExerciseFilters } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Assessment Hooks
export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AssessmentSubmission) => assessmentService.submitAssessment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['latestAssessment'] });
      toast({
        title: 'Success',
        description: 'Assessment submitted successfully!',
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit assessment',
        variant: 'destructive',
      });
    },
  });
};

export const useLatestAssessment = () => {
  return useQuery({
    queryKey: ['latestAssessment'],
    queryFn: () => assessmentService.getLatestAssessment(),
    retry: 1,
  });
};

export const useAssessments = () => {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentService.getAssessments(),
  });
};

export const useContraindications = () => {
  return useQuery({
    queryKey: ['contraindications'],
    queryFn: () => assessmentService.getContraindications(),
  });
};

// Exercise Hooks
export const useExercises = () => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: () => exerciseService.listExercises(),
  });
};

export const useFilteredExercises = (filters: ExerciseFilters) => {
  return useQuery({
    queryKey: ['exercises', 'filtered', filters],
    queryFn: () => exerciseService.getFilteredExercises(filters),
    enabled: Object.keys(filters).length > 0,
  });
};

export const useExerciseRecommendations = () => {
  return useQuery({
    queryKey: ['exerciseRecommendations'],
    queryFn: () => exerciseService.getRecommendations(),
  });
};

// Program Hooks
export const useCurrentProgram = () => {
  return useQuery({
    queryKey: ['currentProgram'],
    queryFn: () => programService.getCurrentProgram(),
    retry: 1,
  });
};

export const useGenerateProgram = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (assessmentId?: number) => programService.generateProgram(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentProgram'] });
      toast({
        title: 'Success',
        description: 'Program generated successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate program',
        variant: 'destructive',
      });
    },
  });
};

// Dashboard Hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
  });
};

// Upload Hooks
export const useUploadVideo = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      file,
      title,
      onProgress,
    }: {
      file: File;
      title: string;
      onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void;
    }) => uploadService.uploadVideo(file, title, onProgress),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Video uploaded successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload video',
        variant: 'destructive',
      });
    },
  });
};
