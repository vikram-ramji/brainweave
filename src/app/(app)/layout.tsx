import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/modules/app/components/AppSidebar";
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
