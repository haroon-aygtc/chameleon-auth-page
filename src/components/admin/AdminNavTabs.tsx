
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  active: boolean;
}

interface AdminNavTabsProps {
  items: NavigationItem[];
}

const AdminNavTabs = ({ items }: AdminNavTabsProps) => {
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
      {items.map((item, index) => (
        <Button 
          key={index}
          variant={item.active ? "secondary" : "ghost"}
          className={cn("whitespace-nowrap", item.active && "font-medium")}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default AdminNavTabs;
