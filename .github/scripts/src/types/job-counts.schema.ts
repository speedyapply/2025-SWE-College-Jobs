import z from "zod";

export const JobCountsSchema = z.object({
  intern_usa_count: z.number(),
  new_grad_usa_count: z.number(),
  intern_intl_count: z.number(),
  new_grad_intl_count: z.number(),
});

export type JobCounts = z.infer<typeof JobCountsSchema>;
