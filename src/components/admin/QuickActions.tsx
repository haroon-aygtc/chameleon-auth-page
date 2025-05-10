
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button 
            key={index} 
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent"
          >
            <action.icon className="h-6 w-6 mb-2" />
            <span className="text-sm">{action.title}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
