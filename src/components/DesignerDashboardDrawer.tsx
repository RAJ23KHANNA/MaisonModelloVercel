// src/components/DesignerDashboardDrawer.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  Plus,
  Trash,
  Edit,
  ChevronLeft,
  Loader2,
  Save,
} from "lucide-react";
import { createPortal } from "react-dom";
import { fetchJobsByDesigner, createJob, updateJob, deleteJob, JobRow } from "../lib/jobsService";
import { supabase } from "../lib/supabaseClient";

type Props = {
  designerId: string;
  onClose: () => void;
};

export default function DesignerDashboardDrawer({ designerId, onClose }: Props) {
  // UI
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const m = matchMedia?.("(max-width: 768px)");
    const handler = (ev: MediaQueryListEvent | MediaQueryList) => setIsMobile(ev.matches);
    if (m) {
      setIsMobile(m.matches);
      m.addEventListener?.("change", handler);
    } else {
      // fallback
      setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", () => setIsMobile(window.innerWidth < 768));
    }
    return () => m?.removeEventListener?.("change", handler);
  }, []);

  // Tabs
  const [tab, setTab] = useState<"jobs" | "brand">("jobs");

  // Jobs
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Create / Edit job
  const [editingJob, setEditingJob] = useState<JobRow | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Brand details (company_name, category)
  const [brand, setBrand] = useState<{ company_name?: string | null; category?: string | null }>({});
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    loadBrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designerId]);

  async function loadJobs() {
    setLoadingJobs(true);
    setJobsError(null);
    try {
      const data = await fetchJobsByDesigner(designerId);
      setJobs(data || []);
    } catch (err: any) {
      console.error("loadJobs err:", err);
      setJobsError(err.message || "Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadBrand() {
    setBrandLoading(true);
    setBrandError(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_name, category")
        .eq("id", designerId)
        .single();

      if (error) throw error;
      setBrand({ company_name: data.company_name, category: data.category });
    } catch (err: any) {
      console.error("loadBrand err:", err);
      setBrandError(err.message || "Failed to load brand details");
    } finally {
      setBrandLoading(false);
    }
  }

  // ---------- JOB FORM ----------

  function openNewJob() {
    setEditingJob({
      id: "",
      designer_id: designerId,
      title: "",
      company: "",
      location: "",
      budget: "",
      applicants: 0,
    } as JobRow);
    setTab("jobs");
  }

  function openEditJob(job: JobRow) {
    setEditingJob(job);
    setTab("jobs");
    // scroll to form? parent can handle, but we keep UI simple
  }

  async function handleSaveJob(payload: Partial<JobRow>) {
    setFormError(null);
    setFormLoading(true);
    try {
      if (editingJob && editingJob.id) {
        // update
        const updated = await updateJob(editingJob.id, payload);
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      } else {
        // create
        const created = await createJob(designerId, payload);
        setJobs((prev) => [created, ...prev]);
      }
      setEditingJob(null);
    } catch (err: any) {
      console.error("save job error:", err);
      setFormError(err.message || "Could not save job");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteJob(jobId: string) {
    const ok = confirm("Delete this job? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      console.error("delete job error:", err);
      alert("Could not delete job. See console.");
    }
  }

  // ---------- BRAND ----------

  async function handleBrandSave() {
    setBrandError(null);
    setBrandLoading(true);
    try {
      // only update keys present in brand
      const updates: Record<string, any> = {};
      if ("company_name" in brand) updates.company_name = brand.company_name ?? null;
      if ("category" in brand) updates.category = brand.category ?? null;

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", designerId)
        .select("*")
        .single();

      if (error) throw error;
      setBrand({ company_name: data.company_name, category: data.category });
      alert("Brand details updated.");
    } catch (err: any) {
      console.error("brand save error:", err);
      setBrandError(err.message || "Could not update brand details");
    } finally {
      setBrandLoading(false);
    }
  }

  // ---------- RENDER ----------

  const drawerContent = (
    <div
      className={`
        flex flex-col h-full bg-white shadow-xl
        ${isMobile ? "w-full h-full" : "w-[480px] max-w-full"}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-semibold text-neutral-900">Designer Dashboard</div>
            <div className="text-xs text-neutral-500">Manage jobs & brand</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab("jobs")}
            className={`px-3 py-1 rounded-lg text-sm ${tab === "jobs" ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setTab("brand")}
            className={`px-3 py-1 rounded-lg text-sm ${tab === "brand" ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
          >
            Brand
          </button>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "jobs" ? (
          <>
            {/* Create New */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Job Listings</h3>
              <button
                onClick={openNewJob}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" /> New Job
              </button>
            </div>

            {/* Jobs list */}
            {loadingJobs ? (
              <div className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
              </div>
            ) : jobsError ? (
              <div className="text-red-600">{jobsError}</div>
            ) : jobs.length === 0 ? (
              <div className="text-neutral-500">No jobs posted yet.</div>
            ) : (
              <div className="space-y-3">
                {jobs.map((j) => (
                  <div key={j.id} className="bg-neutral-50 p-3 rounded-lg border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-neutral-900 truncate">{j.title || "Untitled"}</div>
                        <div className="text-sm text-neutral-600 truncate">{j.company || ""} • {j.location || ""}</div>
                        <div className="text-xs text-neutral-500 mt-1">Posted: {j.posted ?? new Date(j.created_at || "").toLocaleDateString()}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-neutral-900 font-semibold">{j.budget || "—"}</div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditJob(j)} className="px-2 py-1 rounded-md border text-sm hover:bg-neutral-100 flex items-center gap-1">
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => handleDeleteJob(j.id)} className="px-2 py-1 rounded-md border text-sm hover:bg-red-50 text-red-600 flex items-center gap-1">
                            <Trash className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit / Create form */}
            {editingJob && (
              <JobForm
                key={editingJob.id ?? "new"}
                job={editingJob}
                onCancel={() => setEditingJob(null)}
                onSave={async (payload) => {
                  await handleSaveJob(payload);
                  // refresh list to reflect created/updated timestamps etc.
                  await loadJobs();
                }}
                loading={formLoading}
                error={formError}
              />
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-3">Brand Details</h3>

            {brandLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="animate-spin w-6 h-6 text-neutral-500" />
              </div>
            ) : brandError ? (
              <div className="text-red-600">{brandError}</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-600">Company name</label>
                  <input
                    value={brand.company_name ?? ""}
                    onChange={(e) => setBrand((s) => ({ ...s, company_name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="Company or brand name"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-600">Category</label>
                  <input
                    value={brand.category ?? ""}
                    onChange={(e) => setBrand((s) => ({ ...s, category: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="e.g., Luxury, Streetwear, Bridal"
                  />
                </div>

                {/* NOTE: If you want additional brand fields (founded_year, website),
                    add columns in DB first. Keep this small + safe. */}

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleBrandSave}
                    disabled={brandLoading}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={loadBrand} className="px-4 py-2 border rounded-lg">Reset</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-xs text-neutral-500">Designer Dashboard • Manage jobs & brand</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal wrapper to modal-root or body
  return createPortal(
    <div className={`fixed inset-0 z-60 flex ${isMobile ? "items-start justify-center" : "justify-end items-stretch"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Drawer */}
      <div className="relative z-50">
        {drawerContent}
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
}

/* ---------------- JobForm component ---------------- */

function JobForm({
  job,
  onCancel,
  onSave,
  loading,
  error,
}: {
  job: Partial<JobRow>;
  onCancel: () => void;
  onSave: (payload: Partial<JobRow>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}) {
  const [title, setTitle] = useState(job.title ?? "");
  const [company, setCompany] = useState(job.company ?? "");
  const [location, setLocation] = useState(job.location ?? "");
  const [budget, setBudget] = useState(job.budget ?? "");
  const [posted, setPosted] = useState(job.posted ?? "");

  useEffect(() => {
    setTitle(job.title ?? "");
    setCompany(job.company ?? "");
    setLocation(job.location ?? "");
    setBudget(job.budget ?? "");
    setPosted(job.posted ?? "");
  }, [job]);

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border">
      <h4 className="font-medium mb-3">{job.id ? "Edit Job" : "Create Job"}</h4>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="grid gap-3">
        <div>
          <label className="text-xs text-neutral-600">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="text-xs text-neutral-600">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="text-xs text-neutral-600">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="text-xs text-neutral-600">Budget</label>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="e.g. $500 - $2000" />
        </div>

        <div>
          <label className="text-xs text-neutral-600">Posted (optional)</label>
          <input value={posted} onChange={(e) => setPosted(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="e.g., Contract, Part-time, Full-time" />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onSave({ title, company, location, budget, posted })}
            disabled={loading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save</span>
          </button>

          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
}
