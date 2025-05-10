
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const BasePromptField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
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
  );
};

export default BasePromptField;
