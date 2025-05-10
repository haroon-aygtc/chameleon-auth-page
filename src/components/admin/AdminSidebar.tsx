
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Settings, Key, Shield, List, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ChatLogo from '@/components/ChatLogo';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Props for AdminSidebar
interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

// SidebarItem component
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  isActive = false,
  isCollapsed
}) => {
  return (
    <li className="mb-1">
      <Link
        to={to}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <span className={cn("inline-block mr-3", isCollapsed ? "w-5 h-5" : "w-5 h-5")}>{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed: propIsCollapsed,
  onToggle: propOnToggle
}) => {
  const [stateIsCollapsed, setStateIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use props if provided, otherwise use state
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : stateIsCollapsed;

  // Check if user has admin role
  const isAdmin = user?.roles?.includes('Admin');

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = user?.name ? getInitials(user.name) : 'U';

  const toggleSidebar = () => {
    if (propOnToggle) {
      propOnToggle();
    } else {
      setStateIsCollapsed(!stateIsCollapsed);
    }
  };

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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "p-4 flex items-center border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent/30 transition-colors",
          isCollapsed ? "justify-center" : "space-x-3"
        )}
        onClick={() => navigate('/admin/profile')}
      >
        <Avatar className="h-10 w-10 bg-chatgold/20 flex-shrink-0">
          <AvatarFallback className="text-chatgold font-medium text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && user && (
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-sm font-medium">{user.name}</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-0.5 bg-chatgold/20 text-chatgold rounded-full text-xs">Admin</span>
              )}
            </div>
            <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
            <span className="text-xs text-primary mt-1 hover:underline">View Profile</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          <SidebarItem
            to="/admin"
            icon={<Settings />}
            label="Dashboard"
            isActive={window.location.pathname === '/admin'}
            isCollapsed={isCollapsed}
          />

          <SidebarItem
            to="/admin/profile"
            icon={<UserIcon />}
            label="My Profile"
            isActive={window.location.pathname === '/admin/profile'}
            isCollapsed={isCollapsed}
          />

          {/* Admin-only menu items */}
          {isAdmin && (
            <>
              <SidebarItem
                to="/admin/users"
                icon={<Users />}
                label="User Management"
                isActive={window.location.pathname === '/admin/users'}
                isCollapsed={isCollapsed}
              />

              <SidebarItem
                to="/admin/roles"
                icon={<Shield />}
                label="Role Management"
                isActive={window.location.pathname === '/admin/roles'}
                isCollapsed={isCollapsed}
              />

              <SidebarItem
                to="/admin/permissions"
                icon={<Key />}
                label="Permission Management"
                isActive={window.location.pathname === '/admin/permissions'}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          <SidebarItem
            to="/admin/widget-config"
            icon={<Settings />}
            label="Widget Config"
            isActive={window.location.pathname === '/admin/widget-config'}
            isCollapsed={isCollapsed}
          />

          {isAdmin && (
            <SidebarItem
              to="/admin/context-rules"
              icon={<List />}
              label="Context Rules"
              isActive={window.location.pathname === '/admin/context-rules'}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Logout Button */}
          <li className="mt-auto pt-4">
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center p-2 rounded-md w-full text-left transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <LogOut className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
