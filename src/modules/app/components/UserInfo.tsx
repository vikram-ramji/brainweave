import GeneratedAvatar from "@/components/GeneratedAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "better-auth";

interface UserInfoProps {
  user: User;
  collapsed?: boolean;
}

export default function UserInfo({ user, collapsed }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      {user.image ? (
        <Avatar>
          <AvatarImage src={user.image} alt={user.name || "User Avatar"} />
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
      <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
        <span className="text-sm truncate w-full">{user.name}</span>
        <span className="text-xs text-muted-foreground truncate w-full">
          {user.email}
        </span>
      </div>
    </div>
  );
}
