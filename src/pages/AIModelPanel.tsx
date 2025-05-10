import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Table, LayoutGrid, TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ModelCard from '@/components/ai/ModelCard';
import ModelTable from '@/components/ai/ModelTable';
import TestingArea from '@/components/ai/TestingArea';
import ModelForm from '@/components/ai/ModelForm';
import { AIModel } from '@/types/ai-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aiModelService from '@/services/aiModelService';

const AIModelPanel: React.FC = () => {
  const [activeModel, setActiveModel] = useState<AIModel | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [activeTab, setActiveTab] = useState('models');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Query for fetching all models
  const { 
    data: models = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['aiModels'],
    queryFn: aiModelService.getAllModels
  });
  
  // Set default model as active if available when models data changes
  useEffect(() => {
    if (models.length > 0 && !activeModel) {
      const defaultModel = models.find(m => m.isDefault);
      if (defaultModel) {
        setActiveModel(defaultModel);
      }
    }
  }, [models, activeModel]);
  
  // Mutation for toggling active status
  const toggleActiveMutation = useMutation({
    mutationFn: (modelId: string) => aiModelService.toggleActive(modelId),
    onSuccess: (updatedModel) => {
      queryClient.invalidateQueries({ queryKey: ['aiModels'] });
      toast(updatedModel.isActive ? 'Model activated' : 'Model deactivated', {
        description: `${updatedModel.name} is now ${updatedModel.isActive ? 'active' : 'inactive'}`
      });
      
      // Update active model if it was modified
      if (activeModel && activeModel.id === updatedModel.id) {
        setActiveModel(updatedModel);
      }
    },
    onError: (error: any) => {
      toast.error('Failed to update model status', {
        description: error.message || 'An error occurred while updating the model'
      });
    }
  });
  
  // Mutation for setting default model
  const setDefaultMutation = useMutation({
    mutationFn: (modelId: string) => aiModelService.setDefault(modelId),
    onSuccess: (updatedModel) => {
      queryClient.invalidateQueries({ queryKey: ['aiModels'] });
      toast.success(`${updatedModel.name} is now set as default`);
      
      // Update active model to the new default
      setActiveModel(updatedModel);
    },
    onError: (error: any) => {
      toast.error('Failed to set default model', {
        description: error.message || 'An error occurred while setting the default model'
      });
    }
  });
  
  // Mutation for creating/updating models
  const saveMutation = useMutation({
    mutationFn: (model: any) => {
      return model.id 
        ? aiModelService.updateModel(model.id, model)
        : aiModelService.createModel(model);
    },
    onSuccess: (savedModel, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aiModels'] });
      toast.success(`${savedModel.name} ${variables.id ? 'updated' : 'added'} successfully`);
      setActiveTab('models');
      setEditingModel(null);
    },
    onError: (error: any) => {
      toast.error('Failed to save model', {
        description: error.message || 'An error occurred while saving the model'
      });
    }
  });
  
  const handleToggleActive = (modelId: string) => {
    toggleActiveMutation.mutate(modelId);
  };
  
  const handleSetDefault = (modelId: string) => {
    setDefaultMutation.mutate(modelId);
  };

  const handleEditModel = (model: AIModel) => {
    setEditingModel(model);
    setActiveTab('form');
  };

  const handleAddNewModel = () => {
    setEditingModel(null);
    setActiveTab('form');
  };

  const handleFormClose = () => {
    setActiveTab('models');
    setEditingModel(null);
  };

  const handleFormSubmit = (model: AIModel) => {
    saveMutation.mutate(model);
  };
  
  // Display loading or error states
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Loading AI models...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          <h3 className="font-semibold">Error loading AI models</h3>
          <p>{(error as Error).message || 'An unknown error occurred'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['aiModels'] })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Model Management</h1>
          <p className="text-muted-foreground mt-1">Configure and test your AI models in one place</p>
        </div>
        <Button 
          onClick={handleAddNewModel}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Model</span>
        </Button>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="form">Add/Edit Model</TabsTrigger>
            <TabsTrigger value="testing">Testing Area</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  className="rounded-l-none"
                  onClick={() => setViewMode('table')}
                >
                  <Table className="h-4 w-4 mr-1" />
                  Table View
                </Button>
              </div>
            </div>

            {models.length === 0 ? (
              <div className="text-center py-12 bg-muted/40 rounded-lg border border-dashed">
                <h3 className="text-xl font-medium mb-2">No AI Models Found</h3>
                <p className="text-muted-foreground mb-4">Create your first AI model to get started</p>
                <Button onClick={handleAddNewModel}>Add New Model</Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                  <ModelCard 
                    key={model.id} 
                    model={model} 
                    onEdit={() => handleEditModel(model)}
                    onToggleActive={() => handleToggleActive(model.id)}
                    onSetDefault={() => handleSetDefault(model.id)}
                    onSelect={() => setActiveModel(model)}
                  />
                ))}
              </div>
            ) : (
              <ModelTable 
                models={models}
                onEdit={handleEditModel}
                onToggleActive={handleToggleActive}
                onSetDefault={handleSetDefault}
                onSelect={setActiveModel}
              />
            )}
          </TabsContent>

          <TabsContent value="form">
            <div className="p-6 border rounded-md bg-card">
              <ModelForm 
                open={true} 
                onClose={handleFormClose} 
                onSubmit={handleFormSubmit} 
                model={editingModel} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="testing">
            <TestingArea 
              models={models.filter(model => model.isActive)} 
              activeModel={activeModel} 
              setActiveModel={setActiveModel}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIModelPanel;
