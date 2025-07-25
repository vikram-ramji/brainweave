"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SigninSchema } from "@/schemas/auth";
import GithubAuthButton from "./GithubAuthButton";
import GoogleAuthButton from "./GoogleAuthButton";
import AuthFooter from "./AuthFooter";

export default function SigninForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (inputData: z.infer<typeof SigninSchema>) => {
    setIsSubmitting(true);

    const { error } = await authClient.signIn.email({
      email: inputData.email,
      password: inputData.password,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error("Signin failed:", {
        description: error.message,
      });
      setIsSubmitting(false);
      return;
    }

    toast.success("Signin successful! Redirecting to dashboard...");
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        description="Please sign in to continue"
      >
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={register.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="dark:text-slate-200"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={register.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="dark:text-slate-200"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer mb-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="flex items-center my-4">
              <span className="h-px flex-1" />
              <span className="px-2 text-sm text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
              <span className="h-px flex-1" />
            </div>
            <div
              className={cn(
                "w-full gap-2 flex items-center",
                "justify-between flex-col"
              )}
            >
              <GoogleAuthButton
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
              <GithubAuthButton
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            </div>
          </form>
        </Form>
      </AuthCard>
      <AuthFooter
        href="/sign-up"
        text="Don't have an account?"
        linkText="Sign up"
      />
    </AuthLayout>
  );
}
