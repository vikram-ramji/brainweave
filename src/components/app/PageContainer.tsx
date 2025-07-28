import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "editor" | "dashboard";
}

const containerVariants = {
  default: "flex flex-col flex-1 bg-background h-full",
  editor: "flex flex-col flex-1 bg-background h-full z-20",
  dashboard: "flex h-full flex-col bg-background",
};

export function PageContainer({
  children,
  className,
  variant = "default",
}: PageContainerProps) {
  return (
    <div className={cn(containerVariants[variant], className)}>{children}</div>
  );
}
