
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col p-6 rounded-xl bg-secondary/50 border border-border h-full",
      className
    )}>
      <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-chatgold">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

export default FeatureCard;
