import { toast } from "@/hooks/use-toast";
import { AxiosError } from 'axios';

/**
 * Standardized toast notification utility
 * Provides consistent styling and behavior for all toast notifications
 */

// Success toast - green background
export const showSuccessToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-green-500 text-white border-green-600",
  });
};

// Error toast - red background
export const showErrorToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "destructive",
  });
};

// Warning toast - yellow/amber background
export const showWarningToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-amber-500 text-white border-amber-600",
  });
};

// Info toast - blue background
export const showInfoToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-blue-500 text-white border-blue-600",
  });
};

/**
 * Handle API errors and show appropriate toast notifications
 * @param error The error object from the API call
 * @param defaultMessage Default message to show if no specific error message is available
 */
export const handleApiError = (error: any, defaultMessage: string = "An error occurred") => {
  // Check if it's an Axios error
  if (error.isAxiosError) {
    const axiosError = error as AxiosError<any>;

    // Handle validation errors (422)
    if (axiosError.response?.status === 422) {
      // Check for formatted validation errors from our interceptor
      if (error.formattedValidationErrors && error.formattedValidationErrors.length > 0) {
        // Show only the first validation error to avoid multiple toasts
        showErrorToast("Validation Error", error.formattedValidationErrors[0]);
        return;
      }

      // Fallback for validation errors
      const message = axiosError.response?.data?.message || "Validation failed";
      showErrorToast("Validation Error", message);
      return;
    }

    // Handle unauthorized errors (401)
    if (axiosError.response?.status === 401) {
      showErrorToast("Authentication Error", "Your session has expired. Please login again.");
      return;
    }

    // Handle server errors (500+)
    if (axiosError.response && axiosError.response.status >= 500) {
      showErrorToast("Server Error", "Server error. Please try again later.");
      return;
    }

    // Handle other errors with response
    if (axiosError.response?.data?.message) {
      showErrorToast("Error", axiosError.response.data.message);
      return;
    }
  }

  // Fallback for non-Axios errors or errors without specific handling
  showErrorToast("Error", defaultMessage);
};
