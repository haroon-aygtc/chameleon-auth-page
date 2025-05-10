
import React from 'react';
import { Role } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import RoleTable from '@/components/admin/roles/RoleTable';
import RoleForm from '@/components/admin/roles/RoleForm';
import { List, Settings } from 'lucide-react';

interface RolesListProps {
  roles: Role[];
  isLoading: boolean;
  activeTab: string;
  selectedRole?: Role;
  onTabChange: (value: string) => void;
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onAssignPermissions: (role: Role) => void;
  onRoleSubmit: (roleData: Partial<Role>) => void;
  onCancelForm: () => void;
}

const RolesList = ({
  roles,
  isLoading,
  activeTab,
  selectedRole,
  onTabChange,
  onCreateRole,
  onEditRole,
  onDeleteRole,
  onAssignPermissions,
  onRoleSubmit,
  onCancelForm
}: RolesListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-xl font-bold">Roles Management</CardTitle>
          <p className="text-muted-foreground text-sm">
            Define roles and assign permissions to control access to system features
          </p>
        </div>
        <Button
          onClick={onCreateRole}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="roles" className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              Role List
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              {selectedRole ? 'Edit Role' : 'Create Role'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading roles...</p>
                </div>
              ) : (
                <RoleTable
                  roles={roles}
                  onEdit={onEditRole}
                  onDelete={onDeleteRole}
                  onAssignPermissions={onAssignPermissions}
                />
              )}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="edit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoleForm
                role={selectedRole || undefined}
                onSubmit={onRoleSubmit}
                onCancel={onCancelForm}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RolesList;
