import z from "zod";

const JobSchema = z.object({
  company_name: z.string(),
  company_url: z.string().nullable(),
  job_title: z.string(),
  job_locations: z.string().nullable(),
  job_url: z.string(),
  age: z.number(),
  status: z.enum(["active", "inactive"]),
});

export type Job = z.infer<typeof JobSchema>;

export const JobListSchema = z.array(JobSchema);
