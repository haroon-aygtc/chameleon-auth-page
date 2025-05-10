
import React from 'react';
import { Check, Edit, Play, Star, X } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIModel } from '@/types/ai-types';

interface ModelTableProps {
  models: AIModel[];
  onEdit: (model: AIModel) => void;
  onToggleActive: (modelId: string) => void;
  onSetDefault: (modelId: string) => void;
  onSelect: (model: AIModel) => void;
}

const ModelTable: React.FC<ModelTableProps> = ({
  models,
  onEdit,
  onToggleActive,
  onSetDefault,
  onSelect
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
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map(model => (
            <TableRow key={model.id} className={model.isDefault ? 'bg-primary/5' : ''}>
              <TableCell>
                <div className={`w-3 h-3 rounded-full ${getModelTypeColor(model.type)}`} />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {model.name}
                  {model.isDefault && (
                    <Badge variant="default" className="bg-primary text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[300px]">
                <span className="line-clamp-1">{model.description}</span>
              </TableCell>
              <TableCell>
                <Badge variant={model.isActive ? "outline" : "secondary"} className="text-xs">
                  {model.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(model)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleActive(model.id)}
                    className={model.isActive ? 'text-destructive' : 'text-green-500'}
                  >
                    {model.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  
                  {!model.isDefault && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSetDefault(model.id)}
                      className="text-amber-500"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {model.isActive && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelect(model)}
                      className="text-blue-500"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelTable;
