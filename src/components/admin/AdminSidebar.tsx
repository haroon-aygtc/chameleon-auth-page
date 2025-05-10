
import React from 'react';
import ChatLogo from '@/components/ChatLogo';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <ChatLogo className="text-lg" />
      </div>

      {/* User Profile */}
      <div className="p-4 flex items-center space-x-3 border-b border-sidebar-border">
        <div className="h-10 w-10 bg-chatgold/20 rounded-full flex items-center justify-center">
          <span className="text-chatgold font-medium text-sm">AU</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Admin User</span>
          <span className="text-xs text-sidebar-foreground/70">admin@example.com</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Tutorials
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Widget Config
            </a>
          </li>
          <li className="relative">
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Context Rules
            </a>
            <ul className="pl-8 mt-1 space-y-1">
              <li>
                <a 
                  href="#" 
                  className="flex items-center p-2 text-xs rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  Create Rule
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center p-2 text-xs rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  Manage Rules
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center p-2 text-xs rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  Test Rules
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Prompt Templates
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Web Scraping
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Embed Code
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              Analytics
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              API Keys
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              AI Configuration
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="inline-block w-5 h-5 mr-3"></span>
              User Management
            </a>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 mt-auto border-t border-sidebar-border">
        <a 
          href="#" 
          className="flex items-center p-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <span className="inline-block w-5 h-5 mr-3"></span>
          Logout
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
