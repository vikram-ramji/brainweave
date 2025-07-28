import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface NoteTitleFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  onChange?: (value: string) => void;
}

export function NoteTitleField<T extends FieldValues>({
  control,
  name,
  onChange,
}: NoteTitleFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="p-4 border-b">
          <FormControl>
            <Input
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
              className="w-full text-4xl md:text-4xl text-center placeholder:text-4xl dark:text-4xl leading-tight h-auto py-2 px-4 font-serif focus-visible:border-0 focus-visible:ring-0 border-0 bg-background dark:bg-background"
              placeholder="Title"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
