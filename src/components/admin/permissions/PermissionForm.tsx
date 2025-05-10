
import React, { useState, useEffect } from 'react';
import { Permission } from "@/services/mockDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PermissionFormProps {
  permission?: Permission;
  existingCategories: string[];
  onSubmit: (permissionData: Partial<Permission>) => void;
  onCancel: () => void;
}

const PermissionForm = ({ permission, existingCategories, onSubmit, onCancel }: PermissionFormProps) => {
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    description: '',
    category: '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with permission data if editing
  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name,
        description: permission.description,
        category: permission.category,
      });
    }
  }, [permission]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleCategoryChange = (value: string) => {
    if (value === 'create-new') {
      return; // Handle in the select component below
    }
    
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
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
        <CardTitle>{permission ? 'Edit Permission' : 'Create Permission'}</CardTitle>
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
                placeholder="Enter permission name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Enter permission description"
                className={errors.description ? "border-destructive" : ""}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              
              {newCategory ? (
                <div className="flex gap-2">
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="shrink-0"
                    onClick={() => {
                      if (newCategory.trim()) {
                        setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
                        setNewCategory('');
                        if (errors.category) {
                          setErrors((prev) => ({ ...prev, category: "" }));
                        }
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setNewCategory('')}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.category || ''}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="create-new" onClick={() => setNewCategory('')}>
                      + Create new category
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {permission ? 'Update Permission' : 'Create Permission'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PermissionForm;
