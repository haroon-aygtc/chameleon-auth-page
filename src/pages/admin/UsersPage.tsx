
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import UserManagement from '@/components/admin/users/UserManagement';
import UserRoleAssignment from '@/components/admin/users/UserRoleAssignment';
import { useUserManagement } from '@/hooks/useUserManagement';

const UsersPage = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const {
    users,
    loading,
    currentUser,
    selectedUser,
    activeTab,
    showRoleAssignment,
    setActiveTab,
    handleUserSubmit,
    handleUserDelete,
    handleAssignRoles,
    handleSaveRoleAssignments,
    setShowRoleAssignment,
    handleCreateUser,
    handleEditUser,
    handleCancelForm
  } = useUserManagement();

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

          {!showRoleAssignment ? (
            <UserManagement
              users={users}
              loading={loading}
              activeTab={activeTab}
              currentUser={currentUser}
              onTabChange={setActiveTab}
              onCreateUser={handleCreateUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleUserDelete}
              onAssignRoles={handleAssignRoles}
              onUserSubmit={handleUserSubmit}
              onCancelForm={handleCancelForm}
            />
          ) : (
            <UserRoleAssignment
              user={selectedUser}
              onSave={handleSaveRoleAssignments}
              onBack={() => setShowRoleAssignment(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
