import { auth } from "@/modules/auth/lib/auth";
import HomeHero from "@/modules/home/components/HomeHero";
import HomeNavbar from "@/modules/home/components/HomeNavbar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col">
      <HomeNavbar />
      <HomeHero />
    </div>
  );
}
