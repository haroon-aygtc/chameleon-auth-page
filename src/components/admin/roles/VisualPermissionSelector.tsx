import React, { useState, useEffect } from 'react';
import { Permission } from '@/services/types';
import { motion } from 'framer-motion';
import { Check, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface VisualPermissionSelectorProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const VisualPermissionSelector = ({
  permissions,
  selectedPermissions,
  onPermissionToggle,
  onSelectAll,
  onDeselectAll
}: VisualPermissionSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    const module = permission.module || 'Other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Get unique modules
  const modules = Object.keys(permissionsByModule).sort();

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (permission.category && permission.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter permissions by module and search query
  const getFilteredPermissionsByModule = (module: string) => {
    return permissionsByModule[module]?.filter(permission =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (permission.category && permission.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];
  };

  // Group permissions by category within a module
  const groupByCategory = (perms: Permission[]) => {
    return perms.reduce((acc, permission) => {
      const category = permission.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeselectAll}
            className="text-xs"
          >
            Deselect All
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="px-2 py-1">
          {selectedPermissions.length} of {permissions.length} selected
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2 flex overflow-x-auto pb-px">
          <TabsTrigger value="all" className="flex-shrink-0">
            All Permissions
          </TabsTrigger>
          {modules.map(module => (
            <TabsTrigger key={module} value={module} className="flex-shrink-0">
              {module}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {Object.entries(groupByCategory(filteredPermissions)).map(([category, categoryPermissions]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{category}</h3>
                    <Badge variant="outline" className="text-xs">
                      {categoryPermissions.length} permissions
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoryPermissions.map(permission => (
                      <motion.div key={permission.id} variants={item}>
                        <PermissionCard
                          permission={permission}
                          isSelected={selectedPermissions.includes(permission.id)}
                          onToggle={() => onPermissionToggle(permission.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </ScrollArea>
        </TabsContent>

        {modules.map(module => (
          <TabsContent key={module} value={module} className="mt-0">
            <ScrollArea className="h-[400px] pr-4">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {Object.entries(groupByCategory(getFilteredPermissionsByModule(module))).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{category}</h3>
                      <Badge variant="outline" className="text-xs">
                        {categoryPermissions.length} permissions
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryPermissions.map(permission => (
                        <motion.div key={permission.id} variants={item}>
                          <PermissionCard
                            permission={permission}
                            isSelected={selectedPermissions.includes(permission.id)}
                            onToggle={() => onPermissionToggle(permission.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Permission Card Component
interface PermissionCardProps {
  permission: Permission;
  isSelected: boolean;
  onToggle: () => void;
}

const PermissionCard = ({ permission, isSelected, onToggle }: PermissionCardProps) => {
  return (
    <div
      className={cn(
        "border rounded-md p-3 cursor-pointer transition-all",
        isSelected
          ? "bg-primary/10 border-primary"
          : "bg-card hover:bg-muted/50"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm">{permission.name}</div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {permission.description}
          </p>
        </div>
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted border"
        )}>
          {isSelected && <Check className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default VisualPermissionSelector;
