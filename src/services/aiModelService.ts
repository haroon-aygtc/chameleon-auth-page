
import api from './api';
import { AIModel } from '@/types/ai-types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface TestModelResponse {
  model: string;
  message: string;
  response: string;
  style: string;
  timestamp: string;
}

export const aiModelService = {
  /**
   * Get all AI models
   */
  async getAllModels(): Promise<AIModel[]> {
    const response = await api.get<ApiResponse<AIModel[]>>('/ai-models');
    return response.data.data;
  },

  /**
   * Get a single AI model by ID
   */
  async getModel(id: string): Promise<AIModel> {
    const response = await api.get<ApiResponse<AIModel>>(`/ai-models/${id}`);
    return response.data.data;
  },

  /**
   * Create a new AI model
   */
  async createModel(model: Omit<AIModel, 'id'>): Promise<AIModel> {
    const response = await api.post<ApiResponse<AIModel>>('/ai-models', model);
    return response.data.data;
  },

  /**
   * Update an existing AI model
   */
  async updateModel(id: string, model: Partial<AIModel>): Promise<AIModel> {
    const response = await api.put<ApiResponse<AIModel>>(`/ai-models/${id}`, model);
    return response.data.data;
  },

  /**
   * Delete an AI model
   */
  async deleteModel(id: string): Promise<void> {
    await api.delete(`/ai-models/${id}`);
  },

  /**
   * Toggle the active status of an AI model
   */
  async toggleActive(id: string): Promise<AIModel> {
    const response = await api.post<ApiResponse<AIModel>>(`/ai-models/${id}/toggle-active`);
    return response.data.data;
  },

  /**
   * Set an AI model as the default
   */
  async setDefault(id: string): Promise<AIModel> {
    const response = await api.post<ApiResponse<AIModel>>(`/ai-models/${id}/set-default`);
    return response.data.data;
  },

  /**
   * Test an AI model with a message
   */
  async testModel(id: string, message: string, style: string): Promise<TestModelResponse> {
    const response = await api.post<ApiResponse<TestModelResponse>>(`/ai-models/${id}/test`, {
      message,
      style
    });
    return response.data.data;
  }
};

export default aiModelService;
