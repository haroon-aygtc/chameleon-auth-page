
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import UsersList from '@/components/admin/users/UsersList';
import RoleAssignmentModal from '@/components/admin/users/RoleAssignmentModal';
import { useUserManagement } from '@/hooks/useUserManagement';

const UsersPage = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  const {
    users,
    loading,
    showForm,
    currentUser,
    roleModalOpen,
    selectedUser,
    setShowForm,
    setCurrentUser,
    handleUserSubmit,
    handleUserDelete,
    handleAssignRoles,
    handleSaveRoleAssignments,
    setRoleModalOpen
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

          <UsersList
            users={users}
            loading={loading}
            showForm={showForm}
            currentUser={currentUser}
            onAddNewClick={() => {
              setCurrentUser(undefined);
              setShowForm(true);
            }}
            onEditUser={(user) => {
              setCurrentUser(user);
              setShowForm(true);
            }}
            onDeleteUser={handleUserDelete}
            onAssignRoles={handleAssignRoles}
            onFormSubmit={handleUserSubmit}
            onFormCancel={() => {
              setShowForm(false);
              setCurrentUser(undefined);
            }}
          />
        </main>
      </div>

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        isOpen={roleModalOpen}
        user={selectedUser}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveRoleAssignments}
      />
    </div>
  );
};

export default UsersPage;
