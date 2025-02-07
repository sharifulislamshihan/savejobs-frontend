import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be atleast 3 characters")
        .max(50, "Name must be atmost 50 characters")
        .trim(),



    email: z
        .string()
        .email("Invalid email address")
        .toLowerCase()
        .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Invalid email address"),


    password: z
        .string()
        .min(6, "Password must be atleast 6 characters")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must contain atleast one letter and one number"),

    image: z.string().optional(),
})