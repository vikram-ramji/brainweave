import Navbar from "@/components/app/Navbar";
import getServerSession from "./lib/getServerSession";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <Navbar />
      <div className="pt-4 pl-4 font-semibold">Welcome to Brainweave!</div>
    </div>
  );
}
