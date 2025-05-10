
import React, { useState } from 'react';
import { Search, Settings, Bell, Code, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import ChatLogo from '@/components/ChatLogo';
import FeatureCard from '@/components/FeatureCard';
import ToggleFeature from '@/components/ToggleFeature';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  // Feature toggle state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  // Mock data for dashboard metrics
  const dashboardMetrics = [
    { title: "Total Conversations", value: analyticsEnabled ? "14,328" : "Loading...", description: analyticsEnabled ? "+28% from last month" : "Fetching data..." },
    { title: "Active Users", value: analyticsEnabled ? "2,345" : "Loading...", description: analyticsEnabled ? "+12% from last month" : "Fetching data..." },
    { title: "Response Rate", value: analyticsEnabled ? "94.2%" : "Loading...", description: analyticsEnabled ? "+5.4% from last month" : "Fetching data..." },
    { title: "Avg. Response Time", value: analyticsEnabled ? "1.2s" : "Loading...", description: analyticsEnabled ? "-0.3s from last month" : "Fetching data..." },
  ];

  // Mock data for system status
  const systemStatus = [
    { name: "API Status", status: analyticsEnabled ? "Operational" : "Checking..." },
    { name: "Gemini API", status: analyticsEnabled ? "Operational" : "Checking..." },
    { name: "Hugging Face API", status: analyticsEnabled ? "Degraded" : "Checking..." },
    { name: "Database", status: analyticsEnabled ? "Operational" : "Checking..." },
  ];

  // Quick actions
  const quickActions = [
    { title: "Configure Widget", icon: Settings, onClick: () => console.log("Configure Widget") },
    { title: "Edit Context Rules", icon: Code, onClick: () => console.log("Edit Context Rules") },
    { title: "Get Embed Code", icon: Code, onClick: () => console.log("Get Embed Code") },
  ];

  // Navigation items
  const navigationItems = [
    { label: "Overview", active: true },
    { label: "Widget Config", active: false },
    { label: "Context Rules", active: false },
    { label: "Templates", active: false },
    { label: "Knowledge Base", active: false },
    { label: "Embed Code", active: false },
    { label: "AI Logs", active: false },
    { label: "Analytics", active: false },
    { label: "Settings", active: false },
    { label: "Users", active: false },
    { label: "AI Configuration", active: false },
  ];

  const handleAnalyticsToggle = (checked: boolean) => {
    setAnalyticsEnabled(checked);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            {/* Feature Toggle */}
            <div className="flex items-center">
              <ToggleFeature 
                label="Analytics" 
                defaultChecked={analyticsEnabled}
                onChange={handleAnalyticsToggle}
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

        {/* Main Dashboard */}
        <main className="flex-1 p-6 bg-background overflow-auto">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
            {navigationItems.map((item, index) => (
              <Button 
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className={cn("whitespace-nowrap", item.active && "font-medium")}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardMetrics.map((metric, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", analyticsEnabled && "animate-fade-in")}>
                    {metric.value}
                  </div>
                  <p className={cn("text-xs text-muted-foreground mt-1", analyticsEnabled && "animate-fade-in")}>
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <button 
                      key={index} 
                      onClick={action.onClick}
                      className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent"
                    >
                      <action.icon className="h-6 w-6 mb-2" />
                      <span className="text-sm">{action.title}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">System Status</CardTitle>
                  <p className="text-sm text-muted-foreground">Current system health</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemStatus.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
