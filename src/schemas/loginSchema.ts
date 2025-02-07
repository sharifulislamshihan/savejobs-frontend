import { z } from "zod";


export const logInSchema = z.object({
    email: z.string(),
    password: z.string()
})