
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ChatLogo from '@/components/ChatLogo';
import { ChevronLeft, ChevronRight, Users, Settings, Key, Shield, List, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
}

const SidebarItem = ({ to, icon, label, isCollapsed, isActive }: SidebarItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          !isCollapsed && "justify-between"
        )}
      >
        <div className="flex items-center">
          <span className={cn("inline-block mr-3", isCollapsed ? "w-5 h-5" : "w-5 h-5")}>{icon}</span>
          {!isCollapsed && <span>{label}</span>}
        </div>
      </Link>
    </li>
  );
};



const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin role
  const isAdmin = user?.roles?.includes('Admin');

  // Debug user roles
  console.log('User:', user);
  console.log('User roles:', user?.roles);
  console.log('Is Admin:', isAdmin);

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

  return (
    <motion.aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all",
        isCollapsed ? "w-16" : "w-60"
      )}
      animate={{ width: isCollapsed ? "4rem" : "15rem" }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
        {!isCollapsed && <ChatLogo className="text-lg" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
          {user?.avatar ? (
            <AvatarImage src={user.avatar} alt={user?.name || 'User'} />
          ) : (
            <AvatarFallback className="text-chatgold font-medium text-sm">
              {userInitials}
            </AvatarFallback>
          )}
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
            icon={<User />}
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
                isCollapsed={isCollapsed}
              />

              <SidebarItem
                to="/admin/roles"
                icon={<Shield />}
                label="Role Management"
                isCollapsed={isCollapsed}
              />

              <SidebarItem
                to="/admin/permissions"
                icon={<Key />}
                label="Permission Management"
                isCollapsed={isCollapsed}
              />
            </>
          )}



          <SidebarItem
            to="/admin/widget-config"
            icon={<Settings />}
            label="Widget Config"
            isCollapsed={isCollapsed}
          />

          {isAdmin && (
            <SidebarItem
              to="/admin/context-rules"
              icon={<List />}
              label="Context Rules"
              isCollapsed={isCollapsed}
            />
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 mt-auto border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <span className={cn("inline-block", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3")}>
            <LogOut size={18} />
          </span>
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
