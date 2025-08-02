"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AuthCard({
  children,
  variant
}: {
  children: React.ReactNode;
  variant: "signin" | "signup";
}) {
  const title = variant === "signin" ? "Welcome Back" : "Create Account";
  const description =
    variant === "signin"
      ? "Sign in to continue weaving your thoughts."
      : "Join us to start weaving your thoughts.";
  const promptText =
    variant === "signin"
      ? "Don't have an account? "
      : "Already have an account? ";
  const linkText = variant === "signin" ? "Sign Up" : "Sign In";
  const linkHref = variant === "signin" ? "/sign-up" : "/sign-in";
  return (
    <div>
      <Card className="flex flex-col gap-3 overflow-hidden backdrop-blur-md bg-card/20 border-card/30 shadow-xl">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground text-balance">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex items-center justify-center text-center text-sm text-muted-foreground">
          <div>
            {promptText} <Link href={linkHref} className="hover:underline hover:text-foreground hover:underline-offset-4">{linkText}</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
