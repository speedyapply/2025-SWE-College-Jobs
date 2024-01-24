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

export const JobListSchema = z.array(JobSchema);

const FaangJobSchema = JobSchema.extend({
  salary: z.number(),
});

export const FaangJobListSchema = z.array(FaangJobSchema);

export type JobInfo =
  | z.infer<typeof JobSchema>
  | z.infer<typeof FaangJobSchema>;
