"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Alert, AlertTitle } from "../ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

const SignUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First Name is required"),
    lastName: z.string().trim().min(1, "Last Name is required"),
    email: z
      .email("Please enter a valid email address")
      .trim()
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must be less than 128 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPending(false);
          toast.success("Signed up successfully!");
          router.replace("/dashboard");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message || "An unexpected error occurred");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              disabled={pending}
              type="button"
              className="w-full"
            >
              Google
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              type="button"
              className="w-full"
            >
              GitHub
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or Sign up with Email
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!!error && (
            <Alert className="bg-destructive/10 border-none">
              <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Button disabled={pending} type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}
