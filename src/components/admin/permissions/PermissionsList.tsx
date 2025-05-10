
import React from 'react';
import { Permission } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import PermissionTable from './PermissionTable';

interface PermissionsListProps {
  permissions: Permission[];
  loading: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permissionId: string) => void;
  onCreateNew: () => void;
}

const PermissionsList = ({ 
  permissions, 
  loading, 
  onEdit, 
  onDelete, 
  onCreateNew 
}: PermissionsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xl font-bold">Permissions</CardTitle>
            <p className="text-muted-foreground text-sm">Manage system permissions.</p>
          </div>
          <Button
            onClick={onCreateNew}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Permission
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading permissions...</p>
            </div>
          ) : (
            <PermissionTable
              permissions={permissions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PermissionsList;
