import { useState } from "react";
import { toast } from "sonner";

interface UseFormSubmissionOptions {
  successMessage?: string;
  errorMessage?: string;
}

interface SubmitResult {
  error?: {
    message: string;
  } | null;
}

export function useFormSubmission(options: UseFormSubmissionOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    submitFn: () => Promise<SubmitResult | void | unknown>,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);

    try {
      const result = await submitFn();

      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        result.error &&
        typeof result.error === "object" &&
        "message" in result.error
      ) {
        toast.error(options.errorMessage || "Operation failed:", {
          description: (result.error as { message: string }).message,
        });
        return;
      }

      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch {
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
