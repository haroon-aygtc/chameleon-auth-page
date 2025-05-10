
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ChatLogo from '@/components/ChatLogo';
import { ChevronLeft, ChevronRight, User, Users, Settings, Key, Shield, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
}

const SidebarItem = ({ to, icon, label, isCollapsed, isActive, children }: SidebarItemProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <li>
      <Link 
        to={to} 
        className={cn(
          "flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          !isCollapsed && "justify-between"
        )}
        onClick={hasChildren ? (e) => {
          e.preventDefault();
          setIsSubmenuOpen(!isSubmenuOpen);
        } : undefined}
      >
        <div className="flex items-center">
          <span className={cn("inline-block mr-3", isCollapsed ? "w-5 h-5" : "w-5 h-5")}>{icon}</span>
          {!isCollapsed && <span>{label}</span>}
        </div>
        
        {hasChildren && !isCollapsed && (
          <ChevronRight 
            className={cn("w-4 h-4 transition-transform", 
              isSubmenuOpen && "transform rotate-90"
            )} 
          />
        )}
      </Link>
      
      {hasChildren && !isCollapsed && (
        <AnimatePresence>
          {isSubmenuOpen && (
            <motion.ul 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pl-8 mt-1 space-y-1 overflow-hidden"
            >
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
};

const SubItem = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link 
      to={to} 
      className="flex items-center p-2 text-xs rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {label}
    </Link>
  </li>
);

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
      <div className={cn(
        "p-4 flex items-center border-b border-sidebar-border",
        isCollapsed ? "justify-center" : "space-x-3"
      )}>
        <div className="h-10 w-10 bg-chatgold/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-chatgold font-medium text-sm">AU</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-sidebar-foreground/70">admin@example.com</span>
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
            isActive={true}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            to="/admin/users" 
            icon={<Users />} 
            label="User Management" 
            isCollapsed={isCollapsed}
          >
            <SubItem to="/admin/users" label="List Users" />
            <SubItem to="/admin/users/create" label="Create User" />
          </SidebarItem>
          
          <SidebarItem 
            to="/admin/roles" 
            icon={<Shield />} 
            label="Role Management" 
            isCollapsed={isCollapsed}
          >
            <SubItem to="/admin/roles" label="List Roles" />
            <SubItem to="/admin/roles/create" label="Create Role" />
            <SubItem to="/admin/roles/assign" label="Assign Roles" />
          </SidebarItem>
          
          <SidebarItem 
            to="/admin/permissions" 
            icon={<Key />} 
            label="Permission Management" 
            isCollapsed={isCollapsed}
          >
            <SubItem to="/admin/permissions" label="List Permissions" />
            <SubItem to="/admin/permissions/create" label="Create Permission" />
            <SubItem to="/admin/permissions/assign" label="Assign Permissions" />
          </SidebarItem>

          {/* Original menu items */}
          <SidebarItem 
            to="/admin/tutorials" 
            icon={<List />} 
            label="Tutorials" 
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            to="/admin/widget-config" 
            icon={<Settings />} 
            label="Widget Config" 
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            to="/admin/context-rules" 
            icon={<List />} 
            label="Context Rules" 
            isCollapsed={isCollapsed}
          >
            <SubItem to="/admin/context-rules/create" label="Create Rule" />
            <SubItem to="/admin/context-rules/manage" label="Manage Rules" />
            <SubItem to="/admin/context-rules/test" label="Test Rules" />
          </SidebarItem>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 mt-auto border-t border-sidebar-border">
        <Link 
          to="/logout" 
          className={cn(
            "flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <span className={cn("inline-block", isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3")}>
            <User size={18} />
          </span>
          {!isCollapsed && "Logout"}
        </Link>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
