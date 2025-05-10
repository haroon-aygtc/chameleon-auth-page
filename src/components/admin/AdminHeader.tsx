
import React from 'react';
import { Search, Settings, Bell, User, LogOut, UserCog, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ToggleFeature from '@/components/ToggleFeature';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  analyticsEnabled: boolean;
  onAnalyticsToggle: (checked: boolean) => void;
}

const AdminHeader = ({ analyticsEnabled, onAnalyticsToggle }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = user?.name ? getInitials(user.name) : 'AU';

  // Check if user has admin role
  const isAdmin = user?.roles?.includes('Admin');

  return (
    <header className="flex items-center justify-between border-b border-border p-4">
      <div>
        <h1 className="text-xl font-semibold">{isAdmin ? 'Admin Dashboard' : 'Dashboard'}</h1>
        {user && (
          <p className="text-sm text-muted-foreground">
            Welcome, {user.name}
            {isAdmin && <span className="ml-2 px-2 py-0.5 bg-chatgold/20 text-chatgold rounded-full text-xs">Admin</span>}
          </p>
        )}
      </div>

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
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
              <Avatar
                className="h-8 w-8 bg-chatgold/20 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/admin/profile');
                }}
              >
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user?.name || 'User'} />
                ) : (
                  <AvatarFallback className="text-chatgold font-medium text-sm">
                    {userInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex items-center">
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
