
import React from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AIModelPanel from '@/pages/AIModelPanel';

// This component wraps the AIModelPanel and provides the required props to AdminSidebar
const AIModelsPageWrapper: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 p-4 overflow-auto">
        <AIModelPanel />
      </div>
    </div>
  );
};

export default AIModelsPageWrapper;
