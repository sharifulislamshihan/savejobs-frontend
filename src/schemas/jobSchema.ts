import { z } from "zod";

export const jobSchema = z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string().min(1, "Location is required"),
    employmentType: z.string().min(1, "Employment Type is required"),
    salaryRange: z.string().min(1, "Salary Range is required"),
    expectedSalary: z.string().min(1, "Expected Salary is required"),
    applicationDeadline: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    skillsRequired: z.string().transform((val) => val.split(",").map((item) => item.trim())),
    keyResponsibilities: z.string().transform((val) => val.split(",").map((item) => item.trim())),
    perksAndBenefits: z.string().transform((val) => val.split(",").map((item) => item.trim())),
    applicationLink: z.string().optional(),
    sourceLink: z.string().optional(),
    applyLink: z.string().optional(),
    instruction: z.string().optional(),
    hrEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    interviewDate: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["Not Applied", "Applied", "Interview Scheduled", "Rejected", "Accepted"]),
});