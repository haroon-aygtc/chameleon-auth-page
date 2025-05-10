
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import RolesList from '@/components/admin/roles/RolesList';
import PermissionAssignmentModal from '@/components/admin/roles/PermissionAssignmentModal';
import { useRoleManagement } from '@/hooks/useRoleManagement';

const RolesPage = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  const {
    roles,
    isLoading,
    permissionModalOpen,
    selectedRole,
    activeTab,
    setActiveTab,
    setPermissionModalOpen,
    handleRoleSubmit,
    handleRoleDelete,
    handleAssignPermissions,
    handleSavePermissionAssignments,
    handleEditRole,
    handleCreateRole,
    handleCancelForm
  } = useRoleManagement();
  
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

          <RolesList
            roles={roles}
            isLoading={isLoading}
            activeTab={activeTab}
            selectedRole={selectedRole || undefined}
            onTabChange={setActiveTab}
            onCreateRole={handleCreateRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleRoleDelete}
            onAssignPermissions={handleAssignPermissions}
            onRoleSubmit={handleRoleSubmit}
            onCancelForm={handleCancelForm}
          />
        </main>
      </div>

      {/* Permission Assignment Modal */}
      <PermissionAssignmentModal
        isOpen={permissionModalOpen}
        role={selectedRole}
        onClose={() => setPermissionModalOpen(false)}
        onSave={handleSavePermissionAssignments}
      />
    </div>
  );
};

export default RolesPage;
