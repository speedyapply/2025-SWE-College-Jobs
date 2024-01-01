import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

export async function addNewJob(
  jobUrl: string,
  jobTitle: string,
  companyName: string,
  companyUrl: string,
  location: string,
  type: "new_grad" | "intern",
  usa: boolean
) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase.rpc("add_new_job", {
    _job_title: jobTitle,
    _job_url: jobUrl,
    _company_name: companyName,
    _company_url: companyUrl,
    _location: location,
    _type: type,
    _usa: usa,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateJob(
  jobUrl: string,
  jobTitle: string | null,
  companyName: string | null,
  companyUrl: string | null,
  location: string | null,
  type: "new_grad" | "intern" | null,
  usa: boolean | null,
  status: "active" | "inactive" | null
) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase.rpc("update_job", {
    _job_url: jobUrl,
    _new_job_title: jobTitle,
    _new_company_name: companyName,
    _new_company_url: companyUrl,
    _new_location: location,
    _new_type: type,
    _new_usa: usa,
    _new_status: status,
  });

  if (error) {
    throw new Error(error.message);
  }
}
