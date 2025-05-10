
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Shield,
  KeyRound,
  Bot,
  ChevronDown,
  LogOut,
  Settings,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatLogo from '@/components/ChatLogo';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { isMobile } = useMobile();

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
          {isCollapsed ? null : <p className="text-xs font-semibold mb-2 text-sidebar-foreground/70">ADMIN</p>}
          
          {renderNavItem(
            "/admin", 
            "Dashboard", 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
          )}
          
          {renderNavItem(
            "/admin/users", 
            "Users", 
            <Users size={16} />
          )}
          
          {renderNavItem(
            "/admin/roles", 
            "Roles", 
            <Shield size={16} />
          )}
          
          {renderNavItem(
            "/admin/permissions", 
            "Permissions", 
            <KeyRound size={16} />
          )}

          {/* New AI Models section */}
          <Separator className="my-3" />
          {isCollapsed ? null : <p className="text-xs font-semibold mb-2 text-sidebar-foreground/70">AI MODELS</p>}
          
          {renderNavItem(
            "/admin/ai-models",
            "AI Models",
            <Bot size={16} />
          )}
          
          <Separator className="my-3" />
          {isCollapsed ? null : <p className="text-xs font-semibold mb-2 text-sidebar-foreground/70">ACCOUNT</p>}
          
          {renderNavItem(
            "/admin/settings", 
            "Settings", 
            <Settings size={16} />
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground">
          <LogOut size={16} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
