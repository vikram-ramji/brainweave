import GeneratedAvatar from "@/components/GeneratedAvatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "better-auth";

export default function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      {user.image ? (
        <Avatar>
          <AvatarImage src={user.image} alt={user.name || "User Avatar"} />
        </Avatar>
      ) : (
        <GeneratedAvatar
          seed={user.name}
          variant="loreleiNeutral"
          className="size-9 mr-3"
        />
      )}
      <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
        <span className="text-sm truncate w-full">{user.name}</span>
        <span className="text-xs text-muted-foreground truncate w-full">
          {user.email}
        </span>
      </div>
    </div>
}
