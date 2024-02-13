import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { JobListSchema } from "./types/job.schema";
import { JobCountsSchema } from "./types/job-counts.schema";
import { RpcName, RpcNameFaang } from "./types/rpc-name";

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function fetchJobs(rpcName: RpcName | RpcNameFaang) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase.rpc(rpcName);

  if (error) {
    throw new Error(`Supabase query error: [${rpcName}] ${error.message}`);
  }

  try {
    return JobListSchema.parse(data);
  } catch (validationError) {
    throw new Error(`Data validation error: [${rpcName}] ${validationError}`);
  }
}

export async function fetchJobCounts() {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase.rpc("get_swe_job_counts");

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  try {
    return JobCountsSchema.parse(data);
  } catch (validationError) {
    throw new Error(`Data validation error: ${validationError}`);
  }
}
