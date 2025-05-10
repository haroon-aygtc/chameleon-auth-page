
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // If the user is admin, redirect to admin dashboard
  if (user?.roles?.includes('Admin')) {
    return <Navigate to="/admin" replace />;
  }
  
  // For regular users, redirect to a future user dashboard page
  // For now, we'll just redirect to admin as per the routing in App.tsx
  return <Navigate to="/admin" replace />;
};

export default Dashboard;
