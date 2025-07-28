import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface UnauthenticatedPageWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function UnauthenticatedPageWrapper({
  children,
  redirectTo = "/dashboard",
}: UnauthenticatedPageWrapperProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
