
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusItem {
  name: string;
  status: string;
}

interface SystemStatusProps {
  items: StatusItem[];
}

const SystemStatus = ({ items }: SystemStatusProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
        <p className="text-sm text-muted-foreground">Current system health</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
