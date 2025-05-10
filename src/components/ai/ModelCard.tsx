
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Check, X, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AIModel } from '@/types/ai-types';

interface ModelCardProps {
  model: AIModel;
  onEdit: () => void;
  onToggleActive: () => void;
  onSetDefault: () => void;
  onSelect: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onEdit,
  onToggleActive,
  onSetDefault,
  onSelect,
}) => {
  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'openai':
        return 'bg-emerald-500';
      case 'gemini':
        return 'bg-blue-500';
      case 'huggingface':
        return 'bg-yellow-500';
      case 'custom':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`overflow-hidden border-2 ${model.isDefault ? 'border-primary' : 'border-border'}`}>
        <CardHeader className="relative pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getModelTypeColor(model.type)}`} />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {model.type}
                </p>
              </div>
              <CardTitle className="mt-1">{model.name}</CardTitle>
            </div>
            <div className="flex gap-1">
              {model.isDefault && (
                <Badge variant="default" className="bg-primary text-xs">
                  Default
                </Badge>
              )}
              <Badge variant={model.isActive ? "outline" : "secondary"} className="text-xs">
                {model.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {model.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Base Prompt:</span>
            </div>
            <p className="text-xs bg-muted p-2 rounded-md line-clamp-2">
              {model.basePrompt || "No base prompt configured"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant={model.isActive ? "ghost" : "outline"} 
              size="sm" 
              onClick={onToggleActive}
            >
              {model.isActive ? (
                <X className="h-4 w-4 mr-1" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              {model.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
          <div className="flex gap-2">
            {!model.isDefault && (
              <Button variant="secondary" size="sm" onClick={onSetDefault}>
                <Star className="h-4 w-4 mr-1" />
                Set Default
              </Button>
            )}
            {model.isActive && (
              <Button variant="default" size="sm" onClick={onSelect}>
                Test
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModelCard;
