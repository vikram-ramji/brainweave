import Logo from "@/assets/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3.5 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Logo className="size-6" />
          <span className="text-xl font-semibold">
            Brainweave
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover"
              >
                <HomeIcon className="size-5 text-sidebar-primary-foreground" />
                <span className="font-medium text-base">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/create-note"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover"
              >
                <PlusIcon className="size-5 text-sidebar-primary-foreground" />
                <span className="font-medium text-base">Create Note</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        {/* Optional footer */}
      </SidebarFooter>
    </Sidebar>
  );
}
