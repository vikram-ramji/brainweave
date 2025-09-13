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
import { toast } from "sonner";
import Link from "next/link";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useRouter } from "@bprogress/next/app";

export default function UserButton({
  setIsHoverLocked,
}: {
  setIsHoverLocked: (value: boolean) => void;
}) {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();
  const router = useRouter();

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
    <DropdownMenu onOpenChange={(open) => setIsHoverLocked(open)}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="shadow-sm flex items-center justify-between overflow-hidden data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0 focus-visible:bg-sidebar-accent/50 focus-visible:border-sidebar-accent cursor-pointer shadow-primary/50 group/item"
        >
          <UserInfo user={data.user} />
          <EllipsisVertical className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 ease-in-out" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        className="rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-2 p-0 font-normal group/item">
          <UserInfo user={data.user} />
          <ThemeToggleButton className="opacity-50 group-hover/item:opacity-100 transition-opacity duration-200 ease-in-out" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userMenuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              asChild
              className="cursor-pointer text-muted-foreground"
            >
              <Link href={item.href}>
                <item.icon />
                <span className="ml-2">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignout}
          className="cursor-pointer text-muted-foreground"
        >
          <LogOut />
          <span className="ml-2">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
