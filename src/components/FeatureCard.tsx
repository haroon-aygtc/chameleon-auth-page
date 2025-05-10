
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'solid' | 'outline';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  onClick,
  variant = 'default'
}) => {
  const cardStyles = {
    default: "flex flex-col p-6 rounded-xl bg-secondary/50 border border-border h-full",
    solid: "flex flex-col p-6 rounded-xl bg-secondary border border-border h-full",
    outline: "flex flex-col p-6 rounded-xl bg-card/50 border border-border h-full",
  };

  return (
    <div
      className={cn(
        cardStyles[variant],
        onClick && "cursor-pointer hover:bg-secondary/70 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-chatgold">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

export default FeatureCard;
