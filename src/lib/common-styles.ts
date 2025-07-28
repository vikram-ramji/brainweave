// Common styles used across the application to maintain consistency

export const commonStyles = {
  // Form Labels
  formLabel: "text-slate-700 dark:text-slate-200",
  formLabelCentered: "text-center text-slate-700 dark:text-slate-200",

  // Input fields
  inputField: "dark:text-slate-200",

  // Text colors for secondary content
  secondaryText: "text-slate-500 dark:text-slate-400",

  // Buttons
  submitButton: "w-full cursor-pointer",
} as const;

// Utility function to get common form field styles
export const getFormFieldStyles = (centered = false) => ({
  label: centered ? commonStyles.formLabelCentered : commonStyles.formLabel,
  input: commonStyles.inputField,
});
