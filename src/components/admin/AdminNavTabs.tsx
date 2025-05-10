
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationItem {
  label: string;
  path: string;
}

interface AdminNavTabsProps {
  items: NavigationItem[];
}

const AdminNavTabs = ({ items }: AdminNavTabsProps) => {
  const location = useLocation();
  
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 relative">
      {items.map((item, index) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link to={item.path} key={index}>
            <Button 
              variant={isActive ? "secondary" : "ghost"}
              className={cn("whitespace-nowrap", isActive && "font-medium relative")}
            >
              {item.label}
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminNavTabs;
