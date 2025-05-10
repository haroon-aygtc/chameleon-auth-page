
export type AIModelType = 'openai' | 'gemini' | 'huggingface' | 'custom';

export type ResponseStyle = 'friendly' | 'technical' | 'concise' | 'detailed';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: AIModelType;
  apiKey: string;
  basePrompt: string;
  isActive: boolean;
  isDefault: boolean;
  configuration: Record<string, any>;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  status?: 'loading' | 'success' | 'error';
  timestamp: Date;
}

export interface AIModelFormData {
  name: string;
  description: string;
  type: AIModelType;
  apiKey: string;
  basePrompt: string;
  configuration: Record<string, any>;
}
