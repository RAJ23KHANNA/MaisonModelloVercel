// src/lib/jobsService.ts
import { supabase } from "./supabaseClient";

export type JobRow = {
  id: string;
  designer_id?: string | null;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  budget?: string | null;
  applicants?: number | null;
  posted?: string | null;
  created_at?: string | null;
};

export type JobApplicationRow = {
  id: string;
  job_id: string;
  applicant_id: string;
  created_at: string;
  status?: string;
};

/* -------------------- Jobs CRUD -------------------- */

export async function fetchJobsByDesigner(designerId: string): Promise<JobRow[]> {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .select("*")
    .eq("designer_id", designerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getJobById(jobId: string): Promise<JobRow | null> {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .select("*, profiles:designer_id(id, full_name, profile_image, company_name, category)")
    .eq("id", jobId)
    .single();

  if (error) {
    if ((error as any).code === "PGRST116") return null;
    throw error;
  }
  return data || null;
}

export async function createJob(designerId: string, payload: Partial<JobRow>): Promise<JobRow> {
  const row = {
    designer_id: designerId,
    title: payload.title ?? null,
    company: payload.company ?? null,
    location: payload.location ?? null,
    budget: payload.budget ?? null,
    posted: payload.posted ?? null,
  };
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data as JobRow;
}

export async function updateJob(jobId: string, payload: Partial<JobRow>): Promise<JobRow> {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .update(payload)
    .eq("id", jobId)
    .select()
    .single();

  if (error) throw error;
  return data as JobRow;
}

export async function deleteJob(jobId: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw error;
}

/* -------------------- Applications -------------------- */

/**
 * applyToJob - Inserts an application row into job_applications.
 * Prevents duplicate apply by the same user (idempotent).
 */
export async function applyToJob(jobId: string, applicantId: string, note?: string | null): Promise<JobApplicationRow> {
  // Prevent duplicate: check if exists
  const { data: existing } = await supabase
    .from<JobApplicationRow>("job_applications")
    .select("*")
    .eq("job_id", jobId)
    .eq("applicant_id", applicantId)
    .limit(1)
    .single();

  if (existing) {
    // Return existing row (idempotent)
    return existing as JobApplicationRow;
  }

  // Insert new application (note stored as text in jsonb meta? we keep simple)
  const payload: any = {
    job_id: jobId,
    applicant_id: applicantId,
  };

  // if you want to store note, consider a "notes" column—if not present, ignore.
  // We'll attempt to insert into a jsonb metadata column if exists, else skip.
  // For now we keep minimal table; you can extend it later.

  const { data, error } = await supabase
    .from<JobApplicationRow>("job_applications")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as JobApplicationRow;
}

export async function getJobApplications(jobId: string): Promise<JobApplicationRow[]> {
  const { data, error } = await supabase
    .from<JobApplicationRow>("job_applications")
    .select("*, profiles:applicant_id(id, full_name, profile_image, role, location)")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function checkIfApplied(jobId: string, applicantId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from<JobApplicationRow>("job_applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("applicant_id", applicantId)
    .limit(1)
    .single();

  if (error) {
    // If not found, Postgrest returns error code PGRST116? but usually no error.
    return false;
  }
  return !!data;
}

/* -------------------- Discover / Related -------------------- */

/**
 * getJobsForDiscover - simple listing for discover page with pagination
 */
export async function getJobsForDiscover(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .select("*, profiles:designer_id(full_name, profile_image, company_name)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

/**
 * getRelatedJobs - fetch jobs from same designer or same category (if available)
 */
export async function getRelatedJobs(jobId: string, designerId?: string, limit = 5) {
  if (!designerId) {
    const j = await getJobById(jobId);
    designerId = (j as any)?.designer_id;
  }
  if (!designerId) return [];
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .select("id, title, company, location, budget, applicants, created_at")
    .eq("designer_id", designerId)
    .neq("id", jobId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
