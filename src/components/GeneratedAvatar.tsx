import { createAvatar } from "@dicebear/core"
import * as botttsNeutral from "@dicebear/bottts-neutral"
import * as loreleiNeutral from "@dicebear/lorelei-neutral";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "botttsNeutral" | "loreleiNeutral"
}

export default function GeneratedAvatar({
    seed,
    className,
    variant
}: GeneratedAvatarProps) {
    let avatar;
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
        seed
    })
  } else {
    avatar = createAvatar(loreleiNeutral, {
        seed
    })
  }

  return (
    <Avatar className={cn(className)}>
        <AvatarImage src={avatar.toDataUri()} />
        <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
