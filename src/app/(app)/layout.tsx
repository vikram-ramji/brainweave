import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/modules/app/components/AppSidebar";
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-screen w-screen">
        {children}
      </main>
    </SidebarProvider>
  );
}
