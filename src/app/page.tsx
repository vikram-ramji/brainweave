import Navbar from "@/components/app/Navbar";
import getServerSession from "./lib/getServerSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  // If the user is not logged in, render the landing page.
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-gray-50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-gray-50">
                Capture Your Thoughts, Weave Your Knowledge
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                Brainweave is your smart knowledge base. A modern, intuitive
                platform to create, connect, and rediscover your notes. Built
                for lifelong learners and thinkers.
              </p>
              <div className="space-x-4 pt-4">
                <Button asChild size="lg">
                  <Link href="/sign-in" prefetch={false}>
                    Get Started for Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-gray-900 dark:text-gray-50"
                  >
                    <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Rich Text Editing
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Go beyond plain text. With our powerful Tiptap-based editor,
                  you can format your notes beautifully.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-gray-900 dark:text-gray-50"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Smart Tagging
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Organize your thoughts with a flexible many-to-many tagging
                  system. Find anything, instantly.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-gray-900 dark:text-gray-50"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                    <path d="M12 12a10 10 0 0 0-4.9 9.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Future-Proof
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Brainweave is an evolving platform. Get ready for upcoming
                  features like semantic search and spaced repetition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Brainweave. All Rights Reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
