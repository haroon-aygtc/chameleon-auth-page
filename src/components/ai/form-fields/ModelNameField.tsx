
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
import { Input } from '@/components/ui/input';

const ModelNameField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
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
  );
};

export default ModelNameField;
