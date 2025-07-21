import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.email().min(1, "Email is required").max(255, "Email must be less than 255 characters"),
});