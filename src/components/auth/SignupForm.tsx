"use client";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthCard from "./AuthCard";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SignupSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import AuthFooter from "./AuthFooter";
import { useFormSubmission } from "@/hooks/use-form-submission";

export default function SignupForm() {
  const router = useRouter();
  const { isSubmitting, setIsSubmitting, handleSubmit } = useFormSubmission({
    successMessage:
      "Signup successful! Please check your email for verification.",
    errorMessage: "Signup failed",
  });

  const register = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (inputData: z.infer<typeof SignupSchema>) => {
    await handleSubmit(
      async () => {
        return await authClient.signUp.email({
          name: `${inputData.firstName} ${inputData.lastName}`,
          email: inputData.email,
          password: inputData.password,
          callbackURL: "/dashboard",
        });
      },
      () => {
        router.replace(`/verify?email=${inputData.email}`);
      }
    );
  };
  return (
    <AuthLayout>
      <AuthCard title="Create an Account" description="Join us to get started!">
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* First & Last Name */}
            <div className="flex space-x-8">
              <FormField
                control={register.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-center text-slate-700 dark:text-slate-200">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input className="" placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={register.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-slate-700 dark:text-slate-200">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="dark:text-slate-200"
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Email */}
            <FormField
              control={register.control}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E-mail"
                      {...field}
                      className="dark:text-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={register.control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="dark:text-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password */}
            <FormField
              control={register.control}
              name="confirmPassword"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                      className="dark:text-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </AuthCard>
      <AuthFooter
        href="/sign-in"
        text="Already have an account?"
        linkText="Log in"
      />
    </AuthLayout>
  );
}
