// src/lib/jobsService.ts
import { supabase } from "./supabaseClient";

export type JobRow = {
  id: string;
  designer_id: string | null;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  budget?: string | null;
  applicants?: number | null;
  posted?: string | null;
  created_at?: string | null;
};

export async function fetchJobsByDesigner(designerId: string) {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .select("*")
    .eq("designer_id", designerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createJob(designerId: string, payload: Partial<JobRow>) {
  const insertPayload = {
    designer_id: designerId,
    title: payload.title ?? null,
    company: payload.company ?? null,
    location: payload.location ?? null,
    budget: payload.budget ?? null,
    posted: payload.posted ?? null,
    applicants: payload.applicants ?? 0,
  };

  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .insert(insertPayload)
    .select("*");

  if (error) throw error;
  return data && data[0];
}

export async function updateJob(jobId: string, payload: Partial<JobRow>) {
  const { data, error } = await supabase
    .from<JobRow>("jobs")
    .update(payload)
    .eq("id", jobId)
    .select("*");

  if (error) throw error;
  return data && data[0];
}

export async function deleteJob(jobId: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw error;
  return true;
}
