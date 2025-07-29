"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignupConfirmation() {
  const email = useSearchParams().get("email")!;
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const resendLink = async () => {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    });
    setTimeLeft(120); // reset timer
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto p-6 rounded border shadow text-center">
        <h1 className="text-3xl font-bold mb-2">Check your email</h1>
        <p className="mb-4">We&apos;ve sent a confirmation link to <span className="font-medium">{email}</span>. Please check your inbox to verify your account.</p>
        <Button
          variant="outline"
          className="w-full"
          disabled={timeLeft > 0}
          onClick={resendLink}
        >
          {timeLeft > 0
            ? `Resend Email (${minutes}:${seconds.toString().padStart(2, "0")})`
            : "Resend Email"}
        </Button>
      </div>
    </div>
  );
}
