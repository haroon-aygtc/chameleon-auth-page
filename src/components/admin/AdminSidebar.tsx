
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bot,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatLogo from '@/components/ChatLogo';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderNavItem = (path: string, label: string, icon: React.ReactNode) => (
    <Link to={path} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1",
          isActive(path) 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );

  return (
    <div
      className={cn(
        "hidden md:flex h-screen flex-col p-3 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed ? (
          <Link to="/admin" className="flex items-center">
            <ChatLogo />
          </Link>
        ) : (
          <Link to="/admin" className="flex items-center justify-center w-full">
            <ChatLogo variant="compact" />
          </Link>
        )}
        {!isCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="mb-4">
        {isCollapsed && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="w-full p-0 mb-2">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {isCollapsed ? null : <p className="text-xs font-semibold mb-2 text-sidebar-foreground/70">AI MODELS</p>}
          
          {renderNavItem(
            "/admin/ai-models",
            "AI Models",
            <Bot size={16} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;
