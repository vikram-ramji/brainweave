import { useState } from "react";
import { toast } from "sonner";

interface UseFormSubmissionOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useFormSubmission(options: UseFormSubmissionOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    submitFn: () => Promise<any>,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);

    try {
      const result = await submitFn();

      if (result?.error) {
        toast.error(options.errorMessage || "Operation failed:", {
          description: result.error.message,
        });
        return;
      }

      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(options.errorMessage || "Operation failed:", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleSubmit,
  };
}
