
import * as z from 'zod';

export const modelFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters long' }),
  type: z.enum(['openai', 'gemini', 'huggingface', 'custom']),
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  basePrompt: z.string().optional(),
  configuration: z.record(z.any()).default({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
  }),
});

export type ModelFormValues = z.infer<typeof modelFormSchema>;
