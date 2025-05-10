
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MetricItem {
  title: string;
  value: string;
  description: string;
}

interface DashboardMetricsProps {
  metrics: MetricItem[];
  analyticsEnabled: boolean;
}

const DashboardMetrics = ({ metrics, analyticsEnabled }: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", analyticsEnabled && "animate-fade-in")}>
              {metric.value}
            </div>
            <p className={cn("text-xs text-muted-foreground mt-1", analyticsEnabled && "animate-fade-in")}>
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
