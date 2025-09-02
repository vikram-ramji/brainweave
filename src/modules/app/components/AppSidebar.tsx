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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next/app";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  const { data: tags } = useQuery(trpc.tags.getAll.queryOptions());

  const createNote = useMutation(
    trpc.notes.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.notes.getMany.infiniteQueryOptions({}).queryKey,
        });
        queryClient.setQueryData(
          trpc.notes.getOne.queryOptions({ id: data.id }).queryKey,
          { ...data, tags: [] },
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
          <SidebarMenuItem className="flex items-center justify-between py-2">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!pl-1.5 hover:bg-transparent"
            >
              <Link href={"/dashboard"}>
                <Logo className="fill-foreground !size-5.5" />
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
                <SearchIcon className="size-4.5 text-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePinning}
                className="h-7 w-7"
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
                  className="flex items-center group/item relative !bg-primary !text-primary-foreground py-4.5 mb-1"
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
                    className="rounded-none hover:bg-sidebar hover:border-l-5 data-[active=true]:bg-sidebar data-[active=true]:border-l-5 border-primary"
                    isActive={isActive(item.href)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center group/item py-4.5"
                    >
                      <item.icon className="size-5 mb-0.5" />
                      <span className="text-base transition-transform duration-200 ease-out group-hover/item:translate-x-1 will-change-transform">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center w-full mt-1 rounded-none group/item hover:bg-sidebar hover:border-l-5 data-[active=true]:bg-sidebar data-[active=true]:border-l-5 data-[state=open]:hover:bg-sidebar border-primary">
                    <TagsIcon className="size-5 mb-0.5" />
                    <span className="text-base transition-transform duration-200 ease-out group-hover/item:translate-x-1 will-change-transform">
                      Tags
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="pl-2 gap-0">
                    {tags && tags.length > 0 ? (
                      tags.map((tag) => (
                        <SidebarMenuItem key={tag.id}>
                          <SidebarMenuButton
                            asChild
                            className="hover:bg-sidebar hover:border-l-5 border-primary rounded-none"
                          >
                            <Link href={`/tags/${tag.name}`}>
                              <span className="text-sm">{tag.name}</span>
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
