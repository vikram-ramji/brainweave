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
import {
  Files,
  Home,
  PlusCircle,
  SearchIcon,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";
import Logo from "@/../public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./UserButton";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next/app";
import { Button } from "@/components/ui/button";

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

interface AppSidebarProps {
  setIsHoverLocked: (value: boolean) => void;
  setIsSearchDialogOpen: (value: boolean) => void;
  setIsSidebarOpen: (value: boolean) => void;
  isFloating: boolean;
  setIsFloating: (value: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function AppSidebar({
  setIsHoverLocked,
  setIsSearchDialogOpen,
  setIsSidebarOpen,
  isFloating,
  setIsFloating,
  onMouseEnter,
  onMouseLeave,
}: AppSidebarProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createNote = useMutation(
    trpc.notes.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
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

  const [isPinned, setIsPinned] = useState(true);
  const handlePinning = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsFloating(true);
      setIsSidebarOpen(false);
    } else {
      setIsFloating(false);
      setIsPinned(true);
    }
  };

  return (
    <Sidebar
      variant={isFloating ? "floating" : "sidebar"}
      onMouseEnter={isPinned ? undefined : onMouseEnter}
      onMouseLeave={isPinned ? undefined : onMouseLeave}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!pl-1.5 hover:bg-transparent"
            >
              <Link href={"/dashboard"}>
                <Logo className="mt-1 fill-foreground !size-5.5" />
                <span className="text-xl font-semibold">Brainweave</span>
              </Link>
            </SidebarMenuButton>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchDialogOpen(true)}
                className="h-7 w-7"
              >
                <SearchIcon className="h-4 w-4 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePinning}
                className="h-7 w-7"
              >
                {isPinned ? (
                  <SidebarClose className="h-4 w-4 text-foreground" />
                ) : (
                  <SidebarOpen className="h-4 w-4 text-foreground" />
                )}
              </Button>
            </div>
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
        <UserButton setIsHoverLocked={setIsHoverLocked} />
      </SidebarFooter>
    </Sidebar>
  );
}
