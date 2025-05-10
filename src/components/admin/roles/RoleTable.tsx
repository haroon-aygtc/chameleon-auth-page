
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/services/types";
import permissionService from "@/services/permissionService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Key, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/utils/toast-utils";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onAssignPermissions: (role: Role) => void;
}

const RoleTable = ({ roles, onEdit, onDelete, onAssignPermissions }: RoleTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Role>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string; isSystem: boolean } | null>(null);

  // Fetch all permissions to display their names
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionService.getAll,
  });

  const handleSort = (column: keyof Role) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRoles = [...roles].sort((a, b) => {
    if (sortColumn === "name" || sortColumn === "description") {
      const valueA = String(a[sortColumn] || '').toLowerCase();
      const valueB = String(b[sortColumn] || '').toLowerCase();

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else if (sortColumn === "createdAt" || sortColumn === "updatedAt") {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);

      return sortDirection === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else if (sortColumn === "userCount") {
      const countA = a.userCount || 0;
      const countB = b.userCount || 0;

      return sortDirection === "asc"
        ? countA - countB
        : countB - countA;
    }

    return 0;
  });

  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const handleDeleteConfirm = (roleId: string, roleName: string, isSystem: boolean = false) => {
    if (isSystem) {
      showWarningToast(
        "Cannot Delete System Role",
        "System roles cannot be deleted as they are required for core functionality."
      );
      return;
    }

    setRoleToDelete({ id: roleId, name: roleName, isSystem });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete && !roleToDelete.isSystem) {
      onDelete(roleToDelete.id);
      showSuccessToast(
        "Role Deleted",
        `${roleToDelete.name} has been deleted successfully.`
      );
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const getRoleColorClass = (role: Role) => {
    if (role.isSystem) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (role.color) return role.color;
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <>
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer hover:bg-muted/50 w-48"
              >
                Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("description")}
                className="cursor-pointer hover:bg-muted/50"
              >
                Description {sortColumn === "description" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="w-1/3">Permissions</TableHead>
              <TableHead
                onClick={() => handleSort("userCount")}
                className="cursor-pointer hover:bg-muted/50 w-32 text-center"
              >
                Users {sortColumn === "userCount" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("updatedAt")}
                className="cursor-pointer hover:bg-muted/50 w-32"
              >
                Updated {sortColumn === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No roles found.</p>
                    <p className="text-sm">Create a new role to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColorClass(role)}>
                        {role.name}
                      </Badge>
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">System</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {!role.permissions || role.permissions.length === 0 ? (
                        <span className="text-muted-foreground text-sm">No permissions assigned</span>
                      ) : (
                        <>
                          <Badge variant="secondary" className="mr-1">
                            {role.permissions.length} permissions
                          </Badge>
                          {role.permissions.slice(0, 3).map((permissionId) => (
                            <Badge key={permissionId} variant="outline" className="mr-1 mb-1">
                              {getPermissionName(permissionId)}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Users className="h-3 w-3" />
                        <span>{role.userCount || role.user_count || 0}</span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Check for both camelCase and snake_case formats
                      const dateValue = role.updatedAt || role.updated_at;
                      if (dateValue) {
                        try {
                          return format(new Date(dateValue), 'MMM d, yyyy');
                        } catch (error) {
                          return 'N/A';
                        }
                      }
                      return 'N/A';
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(role)}
                        className="h-8 w-8"
                        title="Edit role"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAssignPermissions(role)}
                        className="h-8 w-8"
                        title="Assign permissions"
                      >
                        <Key className="h-4 w-4" />
                        <span className="sr-only">Assign Permissions</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteConfirm(role.id, role.name, role.isSystem || role.is_system)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        disabled={role.isSystem || role.is_system}
                        title={(role.isSystem || role.is_system) ? "System roles cannot be deleted" : "Delete role"}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{roleToDelete?.name}"? This action cannot be undone.
              {roleToDelete?.isSystem && (
                <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md">
                  <strong>Warning:</strong> System roles cannot be deleted as they are required for core functionality.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={roleToDelete?.isSystem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RoleTable;
