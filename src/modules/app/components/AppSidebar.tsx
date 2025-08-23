"use client";

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
import { usePathname, useRouter } from "next/navigation";
import Userbutton from "./Userbutton";
import React from "react";
import { useSidebarHover } from "../hooks/useSidebarHover";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createNote = useMutation(
    trpc.notes.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.queryOptions().queryKey,
        });
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: data.id }).queryKey,
          data,
        );
        router.push(`/notes/${data.id}`);
      },
      onError: () => {
        toast.error("Failed to create note");
      },
    }),
  );

  const pathName = usePathname();
  const isActive = (href: string) =>
    pathName === href || pathName.startsWith(href + "/");

  const { handleMouseEnter, handleMouseLeave } = useSidebarHover();

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!pl-1.5 hover:bg-transparent"
            >
              <Link href={"/dashboard"}>
                <Logo className="mt-1 fill-foreground !size-5.5" />
                <span className="text-xl font-semibold">Brainweave</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => createNote.mutate()}
                  className="flex items-center group/item relative bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                  disabled={createNote.isPending}
                >
                  <PlusCircle className="size-5 mb-0.5" />
                  <span className="text-sm transition-transform duration-200 ease-out group-hover/item:translate-x-1 will-change-transform">
                    Create Note
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="mt-1"
                    isActive={isActive(item.href)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center group/item hover:bg-sidebar-accent/40"
                    >
                      <item.icon className="size-5 mb-0.5" />
                      <span className="text-sm transition-transform duration-200 ease-out group-hover/item:translate-x-1 will-change-transform">
                        {item.label}
                      </span>
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
