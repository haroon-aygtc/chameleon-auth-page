
import React from 'react';
import { Button } from '@/components/ui/button';

export interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isEditing, isSubmitting }) => {
  return (
    <div className="flex justify-end gap-2 mt-8">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Model' : 'Add Model'}
      </Button>
    </div>
  );
};

export default FormActions;
