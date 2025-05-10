import React from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Outlet } from 'react-router-dom';

// This component wraps the existing RolesPage (which we can't directly modify)
// and provides the required props to AdminSidebar
const RolesPageWrapper: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RolesPageWrapper;
