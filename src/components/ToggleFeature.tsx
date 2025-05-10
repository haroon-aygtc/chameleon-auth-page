
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "framer-motion";

interface ToggleFeatureProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const ToggleFeature = ({
  label,
  defaultChecked = false,
  onChange,
  className,
}: ToggleFeatureProps) => {
  const [isActive, setIsActive] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onChange?.(newState);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm font-medium">{label}</span>}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive ? "bg-chatgold" : "bg-muted",
        )}
        aria-pressed={isActive}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isActive ? "on" : "off"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            {isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </motion.span>
        </AnimatePresence>
        
        <motion.span 
          className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0"
          animate={{
            x: isActive ? 26 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
    </div>
  );
};

export default ToggleFeature;
