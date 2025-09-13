import GeneratedAvatar from "@/components/ui/GeneratedAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "better-auth";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <div>
      {user.image ? (
        <Avatar>
          <AvatarImage
            src={user.image}
            alt={user.name || "User Avatar"}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {(user.name || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <GeneratedAvatar
          seed={user.name || "anonymous"}
          variant="loreleiNeutral"
          className="size-8"
        />
      )}
    </div>
  );
}
