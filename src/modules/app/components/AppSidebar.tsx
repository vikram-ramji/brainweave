"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Files, Home, PlusCircle } from "lucide-react";
import Logo from "@/../public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Userbutton from "./Userbutton";

const items = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "All Notes",
    href: "/notes",
    icon: Files,
  },
];

export default function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <Logo className="w-6 h-6 mt-1 fill-foreground" />
          <p className="text-2xl font-semibold">Brainweave</p>
        </Link>
      </SidebarHeader>
      <Separator className="my-1" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <Link
                    href={"/create-note"}
                    className="flex items-center pl-4 "
                  >
                    <PlusCircle className="size-5" />
                    <span className="text-sm font-medium">New Note</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="mt-1"
                    isActive={pathName === item.href}
                  >
                    <Link href={item.href} className="flex items-center pl-4">
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Userbutton />
      </SidebarFooter>
    </Sidebar>
  );
}
