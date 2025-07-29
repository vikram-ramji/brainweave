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
import { PlusIcon, HomeIcon, TagsIcon } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const items = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Create Note",
      href: "/create-note",
      icon: PlusIcon,
    },
    {
      label: "Tags",
      href: "/tags",
      icon: TagsIcon,
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3.5 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Logo className="size-6" />
          <span className="text-xl font-semibold">Brainweave</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover"
                >
                  <item.icon className="size-5 text-sidebar-primary-foreground" />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        {/* Optional footer */}
      </SidebarFooter>
    </Sidebar>
  );
}
