import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { AIModel, ResponseStyle, Message } from '@/types/ai-types';
import aiModelService from '@/services/aiModelService';
import { useMutation } from '@tanstack/react-query';

interface TestingAreaProps {
  models: AIModel[];
  activeModel: AIModel | null;
  setActiveModel: (model: AIModel) => void;
}

const TestingArea: React.FC<TestingAreaProps> = ({
  models,
  activeModel,
  setActiveModel,
}) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation for testing the model
  const testModelMutation = useMutation({
    mutationFn: ({ modelId, message, style }: { modelId: string; message: string; style: string }) => 
      aiModelService.testModel(modelId, message, style),
    onSuccess: (response, variables) => {
      // Update with the successful response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === `${Date.now()}-assistant` 
            ? { 
                ...msg, 
                content: response.response, 
                status: 'success' 
              } 
            : msg
        )
      );
    },
    onError: (error) => {
      // Update with error response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === `${Date.now()}-assistant` 
            ? { 
                ...msg, 
                content: 'Sorry, I encountered an error while processing your request.', 
                status: 'error' 
              } 
            : msg
        )
      );
      
      toast.error('Failed to get response from model', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  const handleSendMessage = async () => {
    if (!userInput.trim() || !activeModel) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setUserInput('');

    // Add assistant message with loading state
    const assistantMessageId = `${Date.now()}-assistant`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      status: 'loading',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Test the model using the mutation
    testModelMutation.mutate({
      modelId: activeModel.id,
      message: userInput,
      style: responseStyle
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'loading':
        return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'error':
        return 'border-red-300 bg-red-50 dark:bg-red-900/20';
      case 'success':
      default:
        return 'bg-muted/50';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Testing Area</CardTitle>
            <CardDescription>
              Test your AI models with different styles and configurations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {activeModel ? activeModel.name : 'Select Model'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {models.length > 0 ? (
                  models.map(model => (
                    <DropdownMenuItem 
                      key={model.id}
                      onClick={() => setActiveModel(model)}
                    >
                      {model.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No active models</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Select 
              value={responseStyle} 
              onValueChange={(value) => setResponseStyle(value as ResponseStyle)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto p-4 border rounded-md">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Send a message to start testing the model</p>
            </div>
          ) : (
            messages.map((message) => (
              <AnimatePresence key={message.id} mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : `border ${getStatusColor(message.status)}`
                    }`}
                  >
                    {message.status === 'loading' ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Input
            placeholder={activeModel ? `Message ${activeModel.name}...` : "Select a model first..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={!activeModel || testModelMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || !activeModel || testModelMutation.isPending}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestingArea;
