
import React, { useState, useEffect } from 'react';
import { User, Role } from "@/services/types";
import roleService from "@/services/roleService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    roles: [],
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load roles for selection
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await roleService.getAll();
        setAvailableRoles(roles);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load roles",
          variant: "destructive",
        });
      }
    };
    
    loadRoles();
  }, [toast]);
  
  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roles: user.roles,
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      return {
        ...prev,
        roles: currentRoles.includes(roleId) 
          ? currentRoles.filter(id => id !== roleId) 
          : [...currentRoles, roleId]
      };
    });
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? 'Edit User' : 'Create User'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter user name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Enter user email"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4 max-h-60 overflow-y-auto">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`role-${role.id}`}
                      checked={(formData.roles || []).includes(role.id)} 
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <Label 
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {role.name}
                    </Label>
                  </div>
                ))}
                {availableRoles.length === 0 && (
                  <p className="text-sm text-muted-foreground">No roles available</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Create User'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
