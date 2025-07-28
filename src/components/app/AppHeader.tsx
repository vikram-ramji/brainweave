"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { authClient } from "@/lib/auth-client";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserSession } from "@/types/UserSession";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function AppHeader({
  session,
  withSubmitButton = false,
  isSubmitting = false,
  hasChanged = false,
  isCreateMode = false,
}: {
  session: UserSession;
  withSubmitButton?: boolean;
  isSubmitting?: boolean;
  hasChanged?: boolean;
  isCreateMode?: boolean;
}) {
  const userInitial = session.user.name.charAt(0).toUpperCase() || "U";
  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-2 border-b sticky top-0 z-20 bg-background">
      {/* Display the title from context */}
      <div className="flex items-center justify-center h-full">
        <SidebarTrigger size={"lg"} />
        <Separator orientation="vertical" className="h-4 mx-2" />
      </div>

      <div className="flex items-center space-x-4">
        {/* Save Button */}
        {withSubmitButton && (
          <Button
            variant={"outline"}
            type="submit"
            form="note-create-form"
            disabled={(!hasChanged && !isCreateMode) || isSubmitting}
            className="px-4 py-2 bg-background rounded transition-colors"
          >
            {isSubmitting
              ? isCreateMode
                ? "Creating..."
                : "Saving..."
              : isCreateMode
                ? "Create Note"
                : hasChanged
                  ? "Save"
                  : "Saved"}
          </Button>
        )}
        {/* Mode Toggle */}
        <ModeToggle />
        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              {userInitial}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                router.replace("/");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
