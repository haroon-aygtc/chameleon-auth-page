
import React, { useState } from 'react';
import { User } from "@/services/mockDatabase";
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
import { Edit, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAssignRoles: (user: User) => void;
}

const UserTable = ({ users, onEdit, onDelete, onAssignRoles }: UserTableProps) => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
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
  
  const handleDeleteConfirm = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      onDelete(userId);
      toast({
        title: "User Deleted",
        description: `${userName} has been deleted successfully.`,
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
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="mr-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(new Date(user.updatedAt), 'MMM d, yyyy')}</TableCell>
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
  );
};

export default UserTable;
