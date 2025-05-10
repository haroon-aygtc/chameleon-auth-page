
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

const ApiKeyField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
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
  );
};

export default ApiKeyField;
