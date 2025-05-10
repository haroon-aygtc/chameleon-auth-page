
import { useMemo } from 'react';
import { Permission } from '@/services/types';

type GroupedPermissions = Record<string, Permission[]>;
type ModulePermissions = Record<string, GroupedPermissions>;

export function usePermissionGrouping(permissions: Permission[], searchQuery: string, activeTab: string) {
  // Group permissions by module and category
  const modulePermissions = useMemo(() => {
    return permissions.reduce((modules, permission) => {
      const module = permission.module || 'General';
      const category = permission.category;
      
      if (!modules[module]) {
        modules[module] = {};
      }
      
      if (!modules[module][category]) {
        modules[module][category] = [];
      }
      
      modules[module][category].push(permission);
      return modules;
    }, {} as ModulePermissions);
  }, [permissions]);
  
  // Get all available modules
  const modules = useMemo(() => {
    return Object.keys(modulePermissions).sort();
  }, [modulePermissions]);
  
  // Filter permissions based on search and active tab
  const filteredPermissions = useMemo(() => {
    const result: ModulePermissions = {};
    
    Object.entries(modulePermissions).forEach(([module, categories]) => {
      // Skip if not in the active module tab
      if (activeTab !== 'all' && activeTab !== module) {
        return;
      }
      
      const filteredModule: GroupedPermissions = {};
      
      Object.entries(categories).forEach(([category, perms]) => {
        const filteredPerms = perms.filter(p => 
          searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredPerms.length > 0) {
          filteredModule[category] = filteredPerms;
        }
      });
      
      if (Object.keys(filteredModule).length > 0) {
        result[module] = filteredModule;
      }
    });
    
    return result;
  }, [modulePermissions, searchQuery, activeTab]);
  
  return {
    modulePermissions,
    modules,
    filteredPermissions
  };
}

export type { GroupedPermissions, ModulePermissions };
