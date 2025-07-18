import * as z from "zod"

export const SignupInputSchema = z.object({
  username: z.string().min(1, {error: "Username is required"}),
  email: z
    .email({ error: "Invalid email address" })
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Password must contain at least one special character",
    }),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;