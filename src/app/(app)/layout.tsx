import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayoutContent from "@/modules/app/components/AppLayoutContent";
import { TRPCReactProvider } from "@/trpc/client";
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <TRPCReactProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </TRPCReactProvider>
    </SidebarProvider>
  );
}
