
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';
import { mockAIModels } from '@/data/mockData';
import { AIModel } from '@/types/ai-types';

// Reuse the form component directly in the page
import ModelForm from '@/components/ai/ModelForm';

const AIModelDetailPage: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { modelId } = useParams<{ modelId: string }>();
  
  // Find the model if we're editing, otherwise it's a new model
  const model = modelId ? mockAIModels.find(m => m.id === modelId) || null : null;
  
  const handleSubmit = (data: AIModel) => {
    // In a real app, this would call an API to save the model
    toast.success(`${data.name} has been ${modelId ? 'updated' : 'added'} successfully`);
    navigate('/admin/ai-models');
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 p-4 overflow-auto">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => navigate('/admin/ai-models')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Models
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {model ? `Edit Model: ${model.name}` : 'Add New AI Model'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {model 
                ? 'Update the configuration of your AI model.' 
                : 'Configure a new AI model to be used in your application.'}
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <ModelForm 
              open={true} 
              onClose={() => navigate('/admin/ai-models')}
              onSubmit={handleSubmit}
              model={model}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelDetailPage;
