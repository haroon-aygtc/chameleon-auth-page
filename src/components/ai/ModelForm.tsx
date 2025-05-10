
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AIModel, AIModelType } from '@/types/ai-types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters long' }),
  type: z.enum(['openai', 'gemini', 'huggingface', 'custom']),
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  basePrompt: z.string().optional(),
});

interface ModelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AIModel) => void;
  model?: AIModel | null;
}

const ModelForm: React.FC<ModelFormProps> = ({
  open,
  onClose,
  onSubmit,
  model
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: model?.name || '',
      description: model?.description || '',
      type: model?.type || 'openai',
      apiKey: model?.apiKey || '',
      basePrompt: model?.basePrompt || 'You are a helpful AI assistant.',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: model?.id || Date.now().toString(),
      name: values.name,
      description: values.description,
      type: values.type as AIModelType,
      apiKey: values.apiKey,
      basePrompt: values.basePrompt || 'You are a helpful AI assistant.',
      isActive: model?.isActive ?? true,
      isDefault: model?.isDefault ?? false,
      configuration: model?.configuration || {},
    });
  };

  // For the dialog mode (used in quick in-page editing)
  if (!open) return null;

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="GPT-4o" {...field} />
              </FormControl>
              <FormDescription>
                A recognizable name for your model
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="High-performance multimodal model with vision capabilities" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="huggingface">Hugging Face</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-..." {...field} />
              </FormControl>
              <FormDescription>
                Your API key will be stored securely
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="basePrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Prompt (System Message)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="You are a helpful AI assistant." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Instructions that define how your AI responds
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {model ? 'Update Model' : 'Add Model'}
          </Button>
        </div>
      </form>
    </Form>
  );

  // Support both dialog mode and direct page mode
  return (
    <>
      {formContent}
    </>
  );
};

export default ModelForm;
