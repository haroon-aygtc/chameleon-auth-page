
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Table, LayoutGrid, TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ModelCard from '@/components/ai/ModelCard';
import ModelTable from '@/components/ai/ModelTable';
import TestingArea from '@/components/ai/TestingArea';
import ModelForm from '@/components/ai/ModelForm';
import { AIModel, ResponseStyle } from '@/types/ai-types';
import { mockAIModels } from '@/data/mockData';

const AIModelPanel: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(mockAIModels);
  const [activeModel, setActiveModel] = useState<AIModel | null>(models.find(m => m.isDefault) || null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const navigate = useNavigate();
  
  const handleToggleActive = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, isActive: !model.isActive } : model
    ));
    const targetModel = models.find(m => m.id === modelId);
    toast(targetModel?.isActive ? 'Model deactivated' : 'Model activated', {
      description: `${targetModel?.name} is now ${targetModel?.isActive ? 'inactive' : 'active'}`
    });
  };
  
  const handleSetDefault = (modelId: string) => {
    setModels(models.map(model => ({
      ...model,
      isDefault: model.id === modelId
    })));
    const targetModel = models.find(m => m.id === modelId);
    toast.success(`${targetModel?.name} is now set as default`);
  };

  const handleEditModel = (model: AIModel) => {
    setEditingModel(model);
    setIsFormOpen(true);
  };

  const handleAddNewModel = () => {
    setEditingModel(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingModel(null);
  };

  const handleFormSubmit = (model: AIModel) => {
    if (editingModel) {
      // Update existing model
      setModels(models.map(m => m.id === model.id ? model : m));
      toast.success(`${model.name} updated successfully`);
    } else {
      // Add new model
      setModels([...models, model]);
      toast.success(`${model.name} added successfully`);
    }
    setIsFormOpen(false);
    setEditingModel(null);
  };
  
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
        <Tabs defaultValue="models" className="w-full">
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

            {viewMode === 'grid' ? (
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
            <Card className="p-6">
              <ModelForm 
                open={true} 
                onClose={handleFormClose} 
                onSubmit={handleFormSubmit} 
                model={editingModel} 
              />
            </Card>
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
