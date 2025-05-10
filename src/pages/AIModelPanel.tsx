
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Check, X, Star, ArrowLeft, ArrowRight, ChevronDown, 
  Table, LayoutGrid, TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ModelCard from '@/components/ai/ModelCard';
import ModelTable from '@/components/ai/ModelTable';
import TestingArea from '@/components/ai/TestingArea';
import { AIModel, ResponseStyle } from '@/types/ai-types';
import { mockAIModels } from '@/data/mockData';

const AIModelPanel: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(mockAIModels);
  const [activeModel, setActiveModel] = useState<AIModel | null>(models.find(m => m.isDefault) || null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
          onClick={() => navigate('/admin/ai-models/new')}
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
                    onEdit={() => navigate(`/admin/ai-models/edit/${model.id}`)}
                    onToggleActive={() => handleToggleActive(model.id)}
                    onSetDefault={() => handleSetDefault(model.id)}
                    onSelect={() => setActiveModel(model)}
                  />
                ))}
              </div>
            ) : (
              <ModelTable 
                models={models}
                onEdit={(model) => navigate(`/admin/ai-models/edit/${model.id}`)}
                onToggleActive={handleToggleActive}
                onSetDefault={handleSetDefault}
                onSelect={setActiveModel}
              />
            )}
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
