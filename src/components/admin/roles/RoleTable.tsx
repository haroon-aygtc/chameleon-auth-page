
import React, { useState } from 'react';
import { Role, Permission, permissionService } from "@/services/mockDatabase";
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
import { Edit, Trash2, Key } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onAssignPermissions: (role: Role) => void;
}

const RoleTable = ({ roles, onEdit, onDelete, onAssignPermissions }: RoleTableProps) => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<keyof Role>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
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
      const valueA = a[sortColumn].toLowerCase();
      const valueB = b[sortColumn].toLowerCase();
      
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
    }
    
    return 0;
  });

  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };
  
  const handleDeleteConfirm = (roleId: string, roleName: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      onDelete(roleId);
      toast({
        title: "Role Deleted",
        description: `"${roleName}" role has been deleted successfully.`,
      });
    }
  };

  return (
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
              onClick={() => handleSort("updatedAt")}
              className="cursor-pointer hover:bg-muted/50 w-32"
            >
              Updated {sortColumn === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="text-right w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No roles found.
              </TableCell>
            </TableRow>
          ) : (
            sortedRoles.map((role) => (
              <TableRow key={role.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {role.permissions.length === 0 ? (
                      <span className="text-muted-foreground text-sm">No permissions assigned</span>
                    ) : (
                      role.permissions.slice(0, 6).map((permissionId) => (
                        <Badge key={permissionId} variant="outline" className="mr-1 mb-1">
                          {getPermissionName(permissionId)}
                        </Badge>
                      ))
                    )}
                    {role.permissions.length > 6 && (
                      <Badge variant="secondary">
                        +{role.permissions.length - 6} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(role.updatedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(role)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onAssignPermissions(role)}
                      className="h-8 w-8"
                    >
                      <Key className="h-4 w-4" />
                      <span className="sr-only">Assign Permissions</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteConfirm(role.id, role.name)}
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
  );
};

export default RoleTable;
