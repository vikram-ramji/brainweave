import { Dock, DockIcon } from "@/components/ui/dock";
import { authClient } from "@/modules/auth/lib/authClient";
import { Files, Home, Plus, Tags } from "lucide-react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCreateNote } from "@/modules/notes/client/hooks";

export default function AppDock() {
  const { data } = authClient.useSession();
  const pathName = usePathname();

  const leftItems = [
    { icon: <Home />, label: "Home", href: "/dashboard" },
    { icon: <Files />, label: "All Notes", href: "/notes" },
  ];

  const rightItems = [
    { icon: <Tags />, label: "Tags", href: "/tags" },
    {
      icon: data?.user && <UserAvatar user={data?.user} />,
      label: "Profile",
      href: "/settings/profile",
    },
  ];

  const createNote = useCreateNote();

  return (
    <div className="relative">
      <Dock disableMagnification>
        {leftItems.map((item) => (
          <DockIcon key={item.label} active={pathName === item.href}>
            <Link href={item.href}>{item.icon}</Link>
          </DockIcon>
        ))}
        <DockIcon onClick={() => createNote.mutate()} className="text-primary">
          <Plus />
        </DockIcon>
        {rightItems.map((item) => (
          <DockIcon key={item.label} active={pathName === item.href}>
            <Link href={item.href}>{item.icon}</Link>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}
