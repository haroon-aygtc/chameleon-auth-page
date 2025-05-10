
import { AIModel, Message } from '@/types/ai-types';

export const mockAIModels: AIModel[] = [
  {
    id: '1',
    name: 'GPT-4o',
    description: 'High-performance multimodal model with vision capabilities',
    type: 'openai',
    apiKey: 'sk-mock-openai-key',
    basePrompt: 'You are a helpful AI assistant.',
    isActive: true,
    isDefault: true,
    configuration: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
    }
  },
  {
    id: '2',
    name: 'Gemini Pro',
    description: 'Google\'s advanced multimodal AI model',
    type: 'gemini',
    apiKey: 'ai-mock-gemini-key',
    basePrompt: 'You are Gemini, a helpful AI assistant.',
    isActive: true,
    isDefault: false,
    configuration: {
      temperature: 0.8,
      maxTokens: 1024,
      topP: 0.9,
    }
  },
  {
    id: '3',
    name: 'Llama 3',
    description: 'Open source large language model by Meta',
    type: 'huggingface',
    apiKey: 'hf-mock-key',
    basePrompt: 'You are a helpful AI assistant.',
    isActive: false,
    isDefault: false,
    configuration: {
      temperature: 0.6,
      maxTokens: 1500,
      repetitionPenalty: 1.1,
    }
  }
];

export const getModelResponse = (message: string, style: string = 'friendly'): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, string> = {
        'friendly': `I'd be happy to help with that! ${message.includes('weather') ? 'The weather today is sunny and warm.' : 'What else would you like to know?'}`,
        'technical': `Based on the input parameters, ${message.includes('weather') ? 'current meteorological data indicates clear skies with temperatures at 26°C.' : 'I require additional contextual information to provide an optimal response.'}`,
        'concise': `${message.includes('weather') ? 'Sunny, 26°C.' : 'How can I assist further?'}`,
        'detailed': `Thank you for your question. ${message.includes('weather') ? 'Today\'s weather forecast shows sunny conditions with temperatures ranging from 22°C to 28°C. UV index is moderate, and there\'s a slight breeze from the southwest at 5 km/h.' : 'I\'d be happy to provide more information if you could specify what you\'re looking for.'}`,
      };
      
      resolve(responses[style] || responses.friendly);
    }, 1500);
  });
};
