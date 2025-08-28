"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { Toaster } from "./ui/sonner";
import { ThemeProvider } from "./ui/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="4px"
      color="var(--primary)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </ProgressProvider>
  );
};

export default Providers;
