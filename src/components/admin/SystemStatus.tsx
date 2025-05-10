
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface StatusItem {
  name: string;
  status: string;
  variant?: "success" | "warning" | "error" | "default";
}

interface SystemStatusProps {
  items: StatusItem[];
}

const StatusBadge = ({ status, variant = "default" }: { status: string, variant?: StatusItem["variant"] }) => {
  const baseClasses = "rounded-full px-2 py-0.5 text-xs font-medium";
  
  // Define color variants
  const variantClasses = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {status}
    </span>
  );
};

const SystemStatus = ({ items }: SystemStatusProps) => {
  // Determine status variant based on status text
  const getStatusVariant = (status: string): StatusItem["variant"] => {
    status = status.toLowerCase();
    if (status.includes("operational") || status.includes("online") || status.includes("active")) return "success";
    if (status.includes("degraded") || status.includes("partial") || status.includes("slow")) return "warning";
    if (status.includes("down") || status.includes("offline") || status.includes("error")) return "error";
    return "default";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">System Status</CardTitle>
          <p className="text-sm text-muted-foreground">Current system health</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex justify-between items-center"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-sm">{item.name}</span>
              <StatusBadge 
                status={item.status} 
                variant={item.variant || getStatusVariant(item.status)} 
              />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemStatus;
