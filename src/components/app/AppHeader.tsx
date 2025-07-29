"use client";

import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserSession } from "@/types/UserSession";
import { Button } from "../ui/button";
import UserAvatarDropdown from "./UserAvatarDropdown";

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
            form={isCreateMode ? "note-create-form" : "note-form"}
            disabled={!hasChanged|| isSubmitting}
            className="px-4 py-2 bg-background rounded transition-colors cursor-pointer"
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
        <ModeToggle />
        <UserAvatarDropdown userInitial={userInitial} />
      </div>
    </header>
  );
}
