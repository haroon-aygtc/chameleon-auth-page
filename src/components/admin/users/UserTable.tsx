
import React, { useState } from 'react';
import { User } from "@/services/types";
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
import { Edit, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";
import { showSuccessToast } from "@/utils/toast-utils";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAssignRoles: (user: User) => void;
}

const UserTable = ({ users, onEdit, onDelete, onAssignRoles }: UserTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortColumn === "name" || sortColumn === "email") {
      const valueA = String(a[sortColumn] || '').toLowerCase();
      const valueB = String(b[sortColumn] || '').toLowerCase();

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else if (sortColumn === "createdAt" || sortColumn === "updatedAt") {
      // Handle cases where date might be missing or invalid
      if (!a[sortColumn] && !b[sortColumn]) return 0;
      if (!a[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      if (!b[sortColumn]) return sortDirection === "asc" ? -1 : 1;

      // Parse dates safely
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);

      // Check for invalid dates
      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      if (isNaN(timeA) && isNaN(timeB)) return 0;
      if (isNaN(timeA)) return sortDirection === "asc" ? 1 : -1;
      if (isNaN(timeB)) return sortDirection === "asc" ? -1 : 1;

      return sortDirection === "asc"
        ? timeA - timeB
        : timeB - timeA;
    } else if (sortColumn === "roles") {
      // Handle roles sorting
      const rolesA = a.roles || [];
      const rolesB = b.roles || [];

      // Get role names for comparison
      const getRoleName = (role: any) => typeof role === 'string' ? role : (role.name || '');

      const roleNamesA = Array.isArray(rolesA) ? rolesA.map(getRoleName).join(',') : '';
      const roleNamesB = Array.isArray(rolesB) ? rolesB.map(getRoleName).join(',') : '';

      if (sortDirection === "asc") {
        return roleNamesA.localeCompare(roleNamesB);
      } else {
        return roleNamesB.localeCompare(roleNamesA);
      }
    }

    return 0;
  });

  const handleDeleteConfirm = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      showSuccessToast(
        "User Deleted",
        `${userToDelete.name} has been deleted successfully.`
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer hover:bg-muted/50"
              >
                Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("email")}
                className="cursor-pointer hover:bg-muted/50"
              >
                Email {sortColumn === "email" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Roles</TableHead>
              <TableHead
                onClick={() => handleSort("createdAt")}
                className="cursor-pointer hover:bg-muted/50"
              >
                Created {sortColumn === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("updatedAt")}
                className="cursor-pointer hover:bg-muted/50"
              >
                Updated {sortColumn === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(user.roles) ? user.roles.map((role) => {
                        // Handle both string role names and role objects
                        const roleId = typeof role === 'string' ? role : role.id;
                        const roleName = typeof role === 'string' ? role : role.name;

                        return (
                          <Badge key={roleId} variant="secondary" className="mr-1">
                            {roleName}
                          </Badge>
                        );
                      }) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Check for both camelCase and snake_case formats
                      const dateValue = user.createdAt || user.created_at;
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
                  <TableCell>
                    {(() => {
                      // Check for both camelCase and snake_case formats
                      const dateValue = user.updatedAt || user.updated_at;
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
                        onClick={() => onEdit(user)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAssignRoles(user)}
                        className="h-8 w-8"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="sr-only">Assign Roles</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteConfirm(user.id, user.name)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
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
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
