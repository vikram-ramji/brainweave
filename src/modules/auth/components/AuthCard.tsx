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

type AuthVariant = "signin" | "signup" | "verify-email";

type AuthConfig = {
  title: string;
  description: string;
  promptText: string;
  linkText: string;
  linkHref: string;
};

export default function AuthCard({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: AuthVariant;
}) {
  const config: Record<AuthVariant, AuthConfig> = {
    signin: {
      title: "Welcome Back",
      description: "Sign in to continue weaving your thoughts.",
      promptText: "Don't have an account? ",
      linkText: "Sign Up",
      linkHref: "/sign-up",
    },
    signup: {
      title: "Create Account",
      description: "Join us to start weaving your thoughts.",
      promptText: "Already have an account? ",
      linkText: "Sign In",
      linkHref: "/sign-in",
    },
    "verify-email": {
      title: "",
      description: "",
      promptText: "",
      linkText: "",
      linkHref: "",
    },
  };
  const { title, description, promptText, linkText, linkHref } =
    config[variant];
  return (
    <div>
      <Card className="flex flex-col gap-3 overflow-hidden backdrop-blur-md bg-card/20 border-card/30">
        {title && (
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground text-balance">
              {description}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {promptText && (
          <CardFooter className="flex items-center justify-center text-center text-sm text-muted-foreground">
            <div>
              {promptText}{" "}
              <Link
                href={linkHref}
                className="hover:underline hover:text-foreground hover:underline-offset-4"
              >
                {linkText}
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
