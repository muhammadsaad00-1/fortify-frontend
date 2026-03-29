import apiClient from './apiClient';
import { VideoUploadResponse } from '@/types/api';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadService = {
  /**
   * Upload a video file
   * POST /api/videos/upload/
   */
  uploadVideo: async (
    file: File,
    title: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<VideoUploadResponse> => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    // If progress tracking is needed, we'd use XMLHttpRequest
    // For now, using the standard upload method
    if (onProgress) {
      return uploadWithProgress(formData, onProgress);
    }

    return apiClient.upload<VideoUploadResponse>('/api/videos/upload/', formData);
  },
};

/**
 * Upload with progress tracking using XMLHttpRequest
 */
const uploadWithProgress = (
  formData: FormData,
  onProgress: (progress: UploadProgress) => void
): Promise<VideoUploadResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', `${API_BASE_URL}/api/videos/upload/`);

    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
};

export default uploadService;
