
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex justify-end gap-2 mt-8">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update Model' : 'Add Model'}
      </Button>
    </div>
  );
};

export default FormActions;
