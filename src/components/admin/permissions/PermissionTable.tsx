
import React, { useState } from 'react';
import { Permission } from "@/services/types";
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
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PermissionTableProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
  onDelete: (permissionId: string) => void;
}

const PermissionTable = ({ permissions, onEdit, onDelete }: PermissionTableProps) => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<keyof Permission>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const handleSort = (column: keyof Permission) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const sortedPermissions = [...permissions].sort((a, b) => {
    if (sortColumn === "name" || sortColumn === "description" || sortColumn === "category") {
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
  
  // Group permissions by category for better organization
  const permissionsByCategory: Record<string, Permission[]> = sortedPermissions.reduce(
    (acc, permission) => {
      const category = permission.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );
  
  const handleDeleteConfirm = (permissionId: string, permissionName: string) => {
    if (window.confirm(`Are you sure you want to delete "${permissionName}" permission?`)) {
      onDelete(permissionId);
      toast({
        title: "Permission Deleted",
        description: `"${permissionName}" permission has been deleted successfully.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
        <div key={category} className="bg-card rounded-md overflow-hidden border">
          <div className="bg-muted/50 px-4 py-2 border-b">
            <h3 className="font-medium">{category}</h3>
          </div>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    onClick={() => handleSort("name")}
                    className="cursor-pointer hover:bg-muted/50 w-1/4"
                  >
                    Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort("description")}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    Description {sortColumn === "description" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
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
                {categoryPermissions.map((permission) => (
                  <TableRow key={permission.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>{format(new Date(permission.updatedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(permission)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteConfirm(permission.id, permission.name)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      {permissions.length === 0 && (
        <div className="text-center py-10 border rounded-md bg-card">
          <p className="text-muted-foreground">No permissions found</p>
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
