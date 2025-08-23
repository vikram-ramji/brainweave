"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/modules/auth/lib/authClient";
import { EllipsisVertical, LogOut, Settings, User } from "lucide-react";
import UserInfo from "./UserInfo";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function Userbutton() {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Dispatch lock/unlock events for sidebar hover logic (always mount hooks in same order).
  useEffect(() => {
    window.dispatchEvent(
      new Event(open ? "sidebar-hover-lock" : "sidebar-hover-unlock"),
    );
  }, [open]);

  const userMenuItems = [
    {
      label: "Profile",
      icon: User,
      href: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.replace("/sign-in");
        },
        onError: ({ error }) => {
          toast.error(`Sign out failed: ${error.message}`, {
            description: "Please try again later.",
          });
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="shadow-sm flex items-center justify-between overflow-hidden data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0 focus-visible:bg-sidebar-accent/50 focus-visible:border-sidebar-accent cursor-pointer"
        >
          <UserInfo user={data.user} />
          <EllipsisVertical />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        className="rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-2 p-0 font-normal">
          <UserInfo user={data.user} />
          <ThemeToggleButton />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userMenuItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={item.href}>
                <item.icon />
                <span className="ml-2">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>
          <LogOut />
          <span className="ml-2">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
