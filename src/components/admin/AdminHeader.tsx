
import React from 'react';
import { Search, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ToggleFeature from '@/components/ToggleFeature';

interface AdminHeaderProps {
  analyticsEnabled: boolean;
  onAnalyticsToggle: (checked: boolean) => void;
}

const AdminHeader = ({ analyticsEnabled, onAnalyticsToggle }: AdminHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border p-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      
      <div className="flex items-center space-x-4">
        {/* Feature Toggle */}
        <div className="flex items-center">
          <ToggleFeature 
            label="Analytics" 
            defaultChecked={analyticsEnabled}
            onChange={onAnalyticsToggle}
          />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 h-9 w-60 rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Settings className="h-5 w-5" />
        
        <ThemeToggle />
        
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-chatgold/20 rounded-full flex items-center justify-center">
            <span className="text-chatgold font-medium text-sm">AU</span>
          </div>
          <span className="text-sm font-medium">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
