
import React from 'react';
import { Permission } from '@/services/types';
import { motion } from 'framer-motion';
import PermissionForm from './PermissionForm';

interface PermissionFormWrapperProps {
  permission?: Permission;
  categories: string[];
  onSubmit: (permissionData: Partial<Permission>) => void;
  onCancel: () => void;
}

const PermissionFormWrapper = ({ 
  permission, 
  categories, 
  onSubmit, 
  onCancel 
}: PermissionFormWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PermissionForm
        permission={permission}
        existingCategories={categories}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </motion.div>
  );
};

export default PermissionFormWrapper;
