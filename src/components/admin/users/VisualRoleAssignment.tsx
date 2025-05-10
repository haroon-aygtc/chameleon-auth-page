import React, { useState, useEffect } from 'react';
import { User, Role } from '@/services/types';
import { motion } from 'framer-motion';
import { Check, Search, Shield, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface VisualRoleAssignmentProps {
  user: User | null;
  roles: Role[];
  selectedRoles: string[];
  onRoleToggle: (roleId: string) => void;
}

const VisualRoleAssignment = ({
  user,
  roles,
  selectedRoles,
  onRoleToggle
}: VisualRoleAssignmentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="px-2 py-1">
          {selectedRoles.length} of {roles.length} roles assigned
        </Badge>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {filteredRoles.map(role => (
            <motion.div key={role.id} variants={item}>
              <RoleCard
                role={role}
                isSelected={selectedRoles.includes(role.id)}
                onToggle={() => onRoleToggle(role.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

// Role Card Component
interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onToggle: () => void;
}

const RoleCard = ({ role, isSelected, onToggle }: RoleCardProps) => {
  // Get role color based on properties or default
  const getRoleColorClass = () => {
    if (role.isSystem) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (role.color) return role.color;
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };
  
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
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-primary" />
            <Badge className={cn("text-xs", getRoleColorClass())}>
              {role.name}
            </Badge>
            {role.isSystem && (
              <Badge variant="outline" className="text-xs">System</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {role.description || "No description provided"}
          </p>
          {role.permissions && role.permissions.length > 0 && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {role.permissions.length} permissions
              </Badge>
            </div>
          )}
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

export default VisualRoleAssignment;
