
import React from 'react';
import { Role } from '@/services/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, Settings, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import RoleGrid from '@/components/admin/roles/RoleGrid';
import RoleForm from '@/components/admin/roles/RoleForm';

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
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-bold">Roles Management</CardTitle>
          </div>
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
                <RoleGrid
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
