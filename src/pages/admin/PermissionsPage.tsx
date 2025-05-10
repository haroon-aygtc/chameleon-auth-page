
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import PermissionsList from '@/components/admin/permissions/PermissionsList';
import PermissionFormWrapper from '@/components/admin/permissions/PermissionFormWrapper';
import { usePermissions } from '@/hooks/usePermissions';

const PermissionsPage = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const {
    permissions,
    loading,
    showForm,
    currentPermission,
    categories,
    setShowForm,
    setCurrentPermission,
    handlePermissionSubmit,
    handlePermissionDelete
  } = usePermissions();
  
  // Navigation tabs
  const tabs = [
    { label: "Overview", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Roles", path: "/admin/roles" },
    { label: "Permissions", path: "/admin/permissions" },
    { label: "Widget Config", path: "/admin/widget-config" },
    { label: "Context Rules", path: "/admin/context-rules" },
    { label: "Templates", path: "/admin/templates" },
    { label: "Knowledge Base", path: "/admin/knowledge" },
    { label: "Embed Code", path: "/admin/embed" },
    { label: "AI Logs", path: "/admin/logs" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Settings", path: "/admin/settings" },
    { label: "AI Configuration", path: "/admin/ai-config" },
  ];

  // Handle analytics toggle
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
          <AdminNavTabs items={tabs} />

          {showForm ? (
            <PermissionFormWrapper
              permission={currentPermission}
              categories={categories}
              onSubmit={handlePermissionSubmit}
              onCancel={() => {
                setShowForm(false);
                setCurrentPermission(undefined);
              }}
            />
          ) : (
            <PermissionsList
              permissions={permissions}
              loading={loading}
              onEdit={(permission) => {
                setCurrentPermission(permission);
                setShowForm(true);
              }}
              onDelete={handlePermissionDelete}
              onCreateNew={() => {
                setCurrentPermission(undefined);
                setShowForm(true);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default PermissionsPage;
