import { z } from "zod";


export const jobDescriptionSchema = z.object({
    jobData: z.string(),
})