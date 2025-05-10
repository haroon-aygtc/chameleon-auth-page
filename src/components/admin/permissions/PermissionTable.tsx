
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
import { Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PermissionTableProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
  onDelete: (permissionId: string) => void;
}

const PermissionTable = ({ permissions, onEdit, onDelete }: PermissionTableProps) => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<keyof Permission>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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
      // Handle null or undefined values
      const strA = a[sortColumn] || '';
      const strB = b[sortColumn] || '';

      const valueA = strA.toLowerCase();
      const valueB = strB.toLowerCase();

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

      try {
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
      } catch (error) {
        return 0; // In case of any error, don't change the order
      }
    }

    return 0;
  });

  // Group permissions by category for better organization
  const permissionsByCategory: Record<string, Permission[]> = sortedPermissions.reduce(
    (acc, permission) => {
      // Use a default category if none is provided
      const category = permission.category || 'Uncategorized';
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

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="space-y-8">
      {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
        <div key={category} className="bg-card rounded-md overflow-hidden border">
          <div
            className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => toggleCategory(category)}
          >
            <div className="flex items-center">
              {expandedCategories[category] ?
                <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" /> :
                <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
              }
              <h3 className="font-medium">{category}</h3>
              <Badge className="ml-2" variant="outline">{categoryPermissions.length}</Badge>
            </div>
          </div>

          <AnimatePresence>
            {expandedCategories[category] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
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
                          <TableCell>
                            {(() => {
                              // Check for both camelCase and snake_case formats
                              const dateValue = permission.updatedAt || permission.updated_at;
                              if (dateValue) {
                                try {
                                  return format(new Date(dateValue), 'MMM d, yyyy');
                                } catch (error) {
                                  return 'Invalid date';
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
              </motion.div>
            )}
          </AnimatePresence>
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
