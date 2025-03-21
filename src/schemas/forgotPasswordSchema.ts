import { z } from "zod";

// Email validation schema
export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})