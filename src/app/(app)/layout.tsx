import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Providers } from "./providers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <SidebarInset />
          <Providers>{children}</Providers>
        </main>
      </div>
    </SidebarProvider>
  );
}
