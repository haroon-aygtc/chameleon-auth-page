
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Check, X, Star, ArrowLeft, ArrowRight, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ModelForm from '@/components/ai/ModelForm';
import ModelCard from '@/components/ai/ModelCard';
import TestingArea from '@/components/ai/TestingArea';
import { AIModel, ResponseStyle } from '@/types/ai-types';
import { mockAIModels } from '@/data/mockData';

const AIModelPanel: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(mockAIModels);
  const [activeModel, setActiveModel] = useState<AIModel | null>(models.find(m => m.isDefault) || null);
  const [showModelForm, setShowModelForm] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  
  const handleAddModel = (model: AIModel) => {
    setModels([...models, { ...model, id: Date.now().toString() }]);
    setShowModelForm(false);
    toast.success(`${model.name} has been added successfully`);
  };
  
  const handleEditModel = (model: AIModel) => {
    setModels(models.map(m => m.id === model.id ? model : m));
    setEditingModel(null);
    toast.success(`${model.name} has been updated successfully`);
  };
  
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
          onClick={() => {
            setEditingModel(null);
            setShowModelForm(true);
          }}
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
            <TabsTrigger value="testing">Testing Area</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  onEdit={() => setEditingModel(model)}
                  onToggleActive={() => handleToggleActive(model.id)}
                  onSetDefault={() => handleSetDefault(model.id)}
                  onSelect={() => setActiveModel(model)}
                />
              ))}
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
      
      {(showModelForm || editingModel) && (
        <ModelForm 
          open={showModelForm || !!editingModel} 
          onClose={() => {
            setShowModelForm(false);
            setEditingModel(null);
          }}
          onSubmit={editingModel ? handleEditModel : handleAddModel}
          model={editingModel}
        />
      )}
    </div>
  );
};

export default AIModelPanel;
