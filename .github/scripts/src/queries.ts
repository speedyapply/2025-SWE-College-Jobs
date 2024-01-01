import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { JobListSchema } from "./types/job.schema";
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
    throw new Error(`Supabase query error: ${error.message}`);
  }

  try {
    return JobListSchema.parse(data);
  } catch (validationError) {
    throw new Error(`Data validation error: ${validationError}`);
  }
}
