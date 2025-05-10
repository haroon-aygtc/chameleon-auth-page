import React from 'react';
import { Role } from '@/services/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Edit, Trash2, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onAssignPermissions: (role: Role) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

const RoleCard = ({ 
  role, 
  onEdit, 
  onDelete, 
  onAssignPermissions, 
  isSelected = false,
  onClick
}: RoleCardProps) => {
  // Get role color based on properties or default
  const getRoleColorClass = () => {
    if (role.isSystem) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (role.color) return role.color;
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  // Handle delete with confirmation
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role.isSystem) {
      alert("System roles cannot be deleted as they are required for core functionality.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      onDelete(role.id);
    }
  };

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(role);
  };

  // Handle permissions click
  const handlePermissionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAssignPermissions(role);
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        isSelected ? "ring-2 ring-primary border-primary" : "",
        role.isSystem ? "bg-blue-50 dark:bg-blue-950/20" : ""
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            <Badge className={cn("text-sm font-medium", getRoleColorClass())}>
              {role.name}
            </Badge>
            {role.isSystem && (
              <Badge variant="outline" className="ml-2 text-xs">System</Badge>
            )}
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Users className="h-3 w-3" />
            <span>{role.userCount || 0}</span>
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {role.description || "No description provided"}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {!role.permissions || role.permissions.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No permissions assigned</span>
          ) : (
            <>
              <Badge variant="secondary" className="text-xs">
                {role.permissions.length} permissions
              </Badge>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex justify-between border-t bg-muted/20">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEditClick}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePermissionsClick}
          className="h-8 w-8 p-0"
        >
          <Key className="h-4 w-4" />
          <span className="sr-only">Permissions</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDeleteClick}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          disabled={role.isSystem}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
