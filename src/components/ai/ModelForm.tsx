
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { modelFormSchema, ModelFormValues } from './schema/modelFormSchema';
import { AIModel } from '@/types/ai-types';

// Import form field components
import ModelNameField from './form-fields/ModelNameField';
import ModelDescriptionField from './form-fields/ModelDescriptionField';
import ModelTypeField from './form-fields/ModelTypeField';
import ApiKeyField from './form-fields/ApiKeyField';
import BasePromptField from './form-fields/BasePromptField';
import FormActions from './form-fields/FormActions';

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
  const methods = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: model?.name || '',
      description: model?.description || '',
      type: model?.type || 'openai',
      apiKey: model?.apiKey || '',
      basePrompt: model?.basePrompt || 'You are a helpful AI assistant.',
    },
  });

  const handleSubmit = (values: ModelFormValues) => {
    onSubmit({
      id: model?.id || Date.now().toString(),
      name: values.name,
      description: values.description,
      type: values.type,
      apiKey: values.apiKey,
      basePrompt: values.basePrompt || 'You are a helpful AI assistant.',
      isActive: model?.isActive ?? true,
      isDefault: model?.isDefault ?? false,
      configuration: model?.configuration || {},
    });
  };

  // Now the form is always shown within a tab
  if (!open) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{model ? 'Edit Model' : 'Add New Model'}</h2>
          <p className="text-muted-foreground">
            {model ? 'Update your AI model details' : 'Configure a new AI model to use in your application'}
          </p>
        </div>
        <ModelNameField />
        <ModelDescriptionField />
        <ModelTypeField />
        <ApiKeyField />
        <BasePromptField />
        <FormActions onCancel={onClose} isEditing={!!model} />
      </form>
    </FormProvider>
  );
};

export default ModelForm;
