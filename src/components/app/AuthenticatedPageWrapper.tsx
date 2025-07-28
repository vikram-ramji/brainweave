import { redirect } from "next/navigation";
import getServerSession from "@/app/lib/getServerSession";
import { UserSession } from "@/types/UserSession";

interface AuthenticatedPageWrapperProps {
  children: (session: UserSession) => React.ReactNode;
  className?: string;
}

export default async function AuthenticatedPageWrapper({
  children,
  className = "flex flex-col flex-1 bg-background h-full",
}: AuthenticatedPageWrapperProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <div className={className}>{children(session)}</div>;
}
