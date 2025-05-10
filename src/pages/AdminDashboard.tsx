
import React, { useState, useEffect } from 'react';
import { Settings, Code, BarChart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import DashboardMetrics from '@/components/admin/DashboardMetrics';
import QuickActions from '@/components/admin/QuickActions';
import SystemStatus from '@/components/admin/SystemStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  // Feature toggle state
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Show welcome toast on initial render
  useEffect(() => {
    if (user) {
      const isAdmin = user.roles?.includes('Admin');
      toast({
        title: isAdmin ? "Welcome to Admin Dashboard" : "Welcome to Dashboard",
        description: `Hello, ${user.name}! ${isAdmin ? "You're logged in as an administrator." : ""}`,
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
      });
    }
  }, [user, toast]);

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

  // Navigation items with proper structure (label and path)
  const navigationItems = [
    { label: "Overview", path: "/admin" },
    { label: "Widget Config", path: "/admin/widget-config" },
    { label: "Context Rules", path: "/admin/context-rules" },
    { label: "Templates", path: "/admin/templates" },
    { label: "Knowledge Base", path: "/admin/knowledge" },
    { label: "Embed Code", path: "/admin/embed" },
    { label: "AI Logs", path: "/admin/logs" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Users", path: "/admin/users" },
    { label: "AI Configuration", path: "/admin/ai-config" },
  ];

  const handleAnalyticsToggle = (checked: boolean) => {
    setAnalyticsEnabled(checked);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          analyticsEnabled={analyticsEnabled}
          onAnalyticsToggle={handleAnalyticsToggle}
        />

        {/* Main Dashboard */}
        <main className="flex-1 p-6 bg-background overflow-auto">
          {/* Navigation Tabs */}
          <AdminNavTabs items={navigationItems} />

          {/* Dashboard Metrics */}
          <DashboardMetrics metrics={dashboardMetrics} analyticsEnabled={analyticsEnabled} />

          {/* Quick Actions and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <QuickActions actions={quickActions} />
            </div>

            {/* System Status */}
            <div>
              <SystemStatus items={systemStatus} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
