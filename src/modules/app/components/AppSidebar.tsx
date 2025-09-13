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
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  Files,
  Home,
  PlusCircle,
  SearchIcon,
  SidebarClose,
  SidebarOpen,
  TagsIcon,
} from "lucide-react";
import Logo from "@/../public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "./UserButton";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCreateNote } from "@/modules/notes/client/hooks";

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

  const { data: tags } = useQuery(trpc.tags.getAll.queryOptions());

  const createNote = useCreateNote();

  const pathName = usePathname();
  const isActive = (href: string) => pathName === href;

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
      className="group/sidebar"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between py-2">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!pl-1.5 hover:bg-transparent"
            >
              <Link href={"/dashboard"}>
                <Logo className="fill-foreground !size-5" />
                <span className="text-xl font-semibold">Brainweave</span>
              </Link>
            </SidebarMenuButton>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchDialogOpen(true)}
                className="h-7 w-7 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out"
              >
                <SearchIcon className="size-4.5 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePinning}
                className="h-7 w-7 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out"
              >
                {isPinned ? (
                  <SidebarClose className="size-4.5 text-foreground" />
                ) : (
                  <SidebarOpen className="size-4.5 text-foreground" />
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
                  className="flex items-center group/item relative bg-primary/80 hover:bg-primary !text-primary-foreground py-4.5 mb-1"
                  disabled={createNote.isPending}
                >
                  <PlusCircle className="size-5 mb-0.5" />
                  <span className="text-base transition-transform duration-200 ease-out group-hover/item:translate-x-1 will-change-transform">
                    Create Note
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="mt-1 gap-0">
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="rounded-none text-muted-foreground hover:bg-sidebar hover:border-l-4 data-[active=true]:bg-sidebar data-[active=true]:border-l-4 border-primary"
                    isActive={isActive(item.href)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center group/item py-4.5"
                    >
                      <item.icon className="size-5 mb-0.5" />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isActive("/tags")}
                    className="flex items-center w-full rounded-none group/item text-muted-foreground hover:bg-sidebar hover:border-l-4 data-[state=open]:border-l-4 data-[state=open]:text-foreground data-[state=open]:hover:bg-sidebar data-[active=true]:bg-sidebar data-[active=true]:border-l-4 border-primary py-4.5 group/item"
                  >
                    <TagsIcon className="size-5 mb-0.5" />
                    <span className="text-base">Tags</span>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover/item:opacity-100 group-data-[state=open]/collapsible:opacity-100 group-data-[state=open]/collapsible:rotate-90 transition-all duration-200 ease-in-out" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="gap-0">
                    {tags && tags.length > 0 ? (
                      tags.map((tag) => (
                        <SidebarMenuItem key={tag.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(`/tags/${tag.name}`)}
                            className="hover:bg-sidebar text-muted-foreground border-primary rounded-none group/item data-[active=true]:bg-sidebar data-[active=true]:text-foreground"
                          >
                            <Link href={`/tags/${tag.name}`}>
                              <span className="text-sm transition-transform duration-200 ease-out group-hover/item:translate-x-1 group-data-[active=true]/item:translate-x-1 will-change-transform">
                                {tag.name}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No tags found
                      </span>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
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
