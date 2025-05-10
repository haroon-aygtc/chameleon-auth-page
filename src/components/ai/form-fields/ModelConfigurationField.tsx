import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const ModelConfigurationField = () => {
  const { control, setValue } = useFormContext();
  const modelType = useWatch({ control, name: 'type' });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Model Configuration</h3>
      <Separator />
      
      {/* Common settings across all model types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="configuration.temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature <Badge variant="outline">{parseFloat(field.value || 0.7).toFixed(1)}</Badge></FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  defaultValue={[parseFloat(field.value || 0.7)]}
                  onValueChange={(value) => setValue('configuration.temperature', value[0])}
                />
              </FormControl>
              <FormDescription>
                Controls randomness: Lower values are more deterministic, higher values are more creative
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="configuration.maxTokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Tokens</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={100000}
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 1000)} 
                />
              </FormControl>
              <FormDescription>
                Maximum number of tokens to generate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* OpenAI specific settings */}
      {modelType === 'openai' && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="configuration.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OpenAI Model</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || 'gpt-4o'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The OpenAI model to use for generation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="configuration.topP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top P <Badge variant="outline">{parseFloat(field.value || 1).toFixed(2)}</Badge></FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      defaultValue={[parseFloat(field.value || 1)]}
                      onValueChange={(value) => setValue('configuration.topP', value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Alternative to temperature, samples from top percentage of probability mass
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="configuration.frequencyPenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency Penalty <Badge variant="outline">{parseFloat(field.value || 0).toFixed(2)}</Badge></FormLabel>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.01}
                      defaultValue={[parseFloat(field.value || 0)]}
                      onValueChange={(value) => setValue('configuration.frequencyPenalty', value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Decreases repetition of frequently used tokens
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Gemini specific settings */}
      {modelType === 'gemini' && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="configuration.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gemini Model</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || 'gemini-pro'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                    <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The Gemini model to use for generation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.topP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Top P <Badge variant="outline">{parseFloat(field.value || 0.95).toFixed(2)}</Badge></FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={[parseFloat(field.value || 0.95)]}
                    onValueChange={(value) => setValue('configuration.topP', value[0])}
                  />
                </FormControl>
                <FormDescription>
                  Alternative to temperature, samples from top percentage of probability mass
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* HuggingFace specific settings */}
      {modelType === 'huggingface' && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="configuration.model_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="meta-llama/Llama-3-8b-chat-hf" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  The Hugging Face model identifier (e.g., meta-llama/Llama-3-8b-chat-hf)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.repetitionPenalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetition Penalty <Badge variant="outline">{parseFloat(field.value || 1.1).toFixed(2)}</Badge></FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={2}
                    step={0.01}
                    defaultValue={[parseFloat(field.value || 1.1)]}
                    onValueChange={(value) => setValue('configuration.repetitionPenalty', value[0])}
                  />
                </FormControl>
                <FormDescription>
                  Penalizes repeated tokens
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Custom API settings */}
      {modelType === 'custom' && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="configuration.endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://api.example.com/v1/chat" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  The full URL of your custom API endpoint
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HTTP Method</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || 'POST'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The HTTP method to use for the API call
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.body_template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Body Template</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={'{\n  "system": "%system%",\n  "user": "%user%"\n}'}
                    className="font-mono h-32"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  JSON template with %system% and %user% placeholders for the prompts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.headers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Headers (JSON)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={'{\n  "Content-Type": "application/json",\n  "Custom-Header": "value"\n}'}
                    className="font-mono h-32"
                    {...field} 
                    onChange={(e) => {
                      try {
                        // Validate JSON
                        const value = e.target.value;
                        if (value) JSON.parse(value);
                        field.onChange(e);
                      } catch (error) {
                        // Keep the invalid input for the user to correct
                        field.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  JSON object of headers to send with the request
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="configuration.response_path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Response Path</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="choices.0.message.content" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Dot notation path to extract text from response (e.g., "choices.0.message.content")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ModelConfigurationField;
