import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash,
  Edit,
  ArrowLeft,
  Loader2,
  Save,
  MapPin,
  Building2,
  Briefcase,
  Users,
  DollarSign
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobsByDesigner, createJob, updateJob, deleteJob, JobRow } from "../lib/jobsService";
import { supabase } from "../lib/supabaseClient";
import { ApplicantsModal } from "./ApplicantsModal";
import { JobApplicantsList } from "./JobApplicantsList";

export default function DesignerDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use the ID from URL, fallback to empty string (logic safety)
  const designerId = id || "";

  // UI State
  const [editingBrand, setEditingBrand] = useState(false);

  // Jobs State
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Job Form State
  const [editingJob, setEditingJob] = useState<JobRow | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Brand details
  const [brand, setBrand] = useState<{ company_name?: string | null; category?: string | null }>({});
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);

  const [applicantsJobId, setApplicantsJobId] = useState<string | null>(null);


  // Initial Load
  useEffect(() => {
    if (designerId) {
      loadJobs();
      loadBrand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designerId]);

  // --- DATA FETCHING ---

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

  // --- JOB HANDLERS ---

  function openNewJob() {
    setEditingJob({
      id: "",
      designer_id: designerId,
      title: "",
      company: brand.company_name || "", // Pre-fill company name
      location: "",
      budget: "",
      applicants: 0,
    } as JobRow);
  }

  async function handleSaveJob(payload: Partial<JobRow>) {
    setFormError(null);
    setFormLoading(true);
    try {
      if (editingJob && editingJob.id) {
        const updated = await updateJob(editingJob.id, payload);
        setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      } else {
        const created = await createJob(designerId, payload);
        setJobs((prev) => [created, ...prev]);
      }
      setEditingJob(null);
    } catch (err: any) {
      setFormError(err.message || "Could not save job");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteJob(jobId: string) {
    if (!confirm("Delete this job? This action cannot be undone.")) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      alert("Could not delete job.");
    }
  }

  // --- BRAND HANDLERS ---

  async function handleBrandSave() {
    setBrandError(null);
    setBrandLoading(true);
    try {
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
      setEditingBrand(false);
    } catch (err: any) {
      setBrandError(err.message || "Could not update brand");
    } finally {
      setBrandLoading(false);
    }
  }

  // --- RENDER HELPERS ---

  // Renders the list of jobs
  const renderJobList = () => (
    <div className="space-y-6">
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 text-base mb-6">Create your first job listing to start hiring.</p>
          <button 
            onClick={openNewJob}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl inline-flex items-center gap-3 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5" /> Post a Job
          </button>
        </div>
      ) : (
        jobs.map((j) => (
          <div key={j.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-amber-700 transition-colors">{j.title || "Untitled Position"}</h3>
                <div className="text-gray-600 text-sm mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" /> {j.company || brand.company_name || "Company Confidential"}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> {j.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <DollarSign className="w-4 h-4" /> {j.budget || "Negotiable"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  Posted {j.posted ?? new Date(j.created_at || "").toLocaleDateString()} • {j.applicants || 0} Applicants
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                    onClick={() => setApplicantsJobId(j.id)}
                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                    title="View Applicants"
                >
                    <Users className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setEditingJob(j)}
                  className="p-3 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Edit Job"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteJob(j.id)}
                  className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Delete Job"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* --- Header / Nav --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 max-w-7xl w-full mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-xl text-gray-800">
            Designer Dashboard
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Brand / Profile Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative">
             {/* Banner / Cover color */}
            <div className="h-28 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="mt-12 px-6 pb-6">
              {!editingBrand ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    <Building2 className="w-5 h-5" />
                    {brand.company_name || "Your Company"}
                  </h2>
                  <p className="text-gray-600 text-base mt-2">
                    {brand.category || "Add a category"}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setEditingBrand(true)}
                      className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Edit Page Details
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Company Name</label>
                    <input 
                      value={brand.company_name || ""} 
                      onChange={(e) => setBrand(b => ({...b, company_name: e.target.value}))}
                      className="w-full text-sm border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      placeholder="e.g. Acme Studio"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Category</label>
                    <input 
                      value={brand.category || ""} 
                      onChange={(e) => setBrand(b => ({...b, category: e.target.value}))}
                      className="w-full text-sm border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="e.g. Interior Design"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleBrandSave} 
                      disabled={brandLoading}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                    >
                      {brandLoading ? "Saving..." : "Save"}
                    </button>
                    <button 
                      onClick={() => setEditingBrand(false)} 
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                  {brandError && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{brandError}</div>}
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Card (Optional / Future use) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
             <h4 className="text-lg font-bold text-gray-900 mb-4">Analytics</h4>
             <div className="flex justify-between text-base mb-3">
               <span className="text-gray-600 flex items-center gap-2"><Users className="w-5 h-5 text-amber-500"/> Total Applicants</span>
               <span className="font-bold text-gray-900">{jobs.reduce((acc, curr) => acc + (curr.applicants || 0), 0)}</span>
             </div>
             <div className="flex justify-between text-base">
               <span className="text-gray-600 flex items-center gap-2"><Briefcase className="w-5 h-5 text-amber-500"/> Active Jobs</span>
               <span className="font-bold text-gray-900">{jobs.length}</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Jobs Feed */}
        <div className="lg:col-span-8">
          
          {/* Header for Job Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6 flex items-center justify-between">
            <h2 className="font-bold text-2xl text-gray-800">Job Management</h2>
            {!editingJob && (
              <button 
                onClick={openNewJob}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" /> Post New Job
              </button>
            )}
          </div>

          {/* Main Content Area */}
          {editingJob ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <JobForm 
                 job={editingJob} 
                 onCancel={() => setEditingJob(null)} 
                 onSave={handleSaveJob} 
                 loading={formLoading} 
                 error={formError} 
               />
            </div>
          ) : (
            <>
              {loadingJobs ? (
                <div className="text-center py-16">
                   <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
                   <p className="text-gray-600 mt-4 text-lg">Loading your dashboard...</p>
                </div>
              ) : jobsError ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 shadow-sm">{jobsError}</div>
              ) : (
                renderJobList()
              )}
            </>
          )}

        </div>
      </main>
    {applicantsJobId && (
    <ApplicantsModal onClose={() => setApplicantsJobId(null)}>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Applicants</h2>
        <JobApplicantsList jobId={applicantsJobId} />
    </ApplicantsModal>
    )}
    </div>
  );
}

/* ---------------- Reused JobForm (Visual updates for page layout) ---------------- */

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

  // Update local state if prop changes
  useEffect(() => {
    setTitle(job.title ?? "");
    setCompany(job.company ?? "");
    setLocation(job.location ?? "");
    setBudget(job.budget ?? "");
    setPosted(job.posted ?? "");
  }, [job]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-900">{job.id ? "Edit Job Post" : "Create New Job"}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
          ✕ {/* Simple close icon */}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 border border-red-200">{error}</div>}

      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm" 
            placeholder="e.g. Senior Interior Designer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Display Name</label>
            <input 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
              placeholder="e.g. New York, NY (Hybrid)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Budget / Salary</label>
            <input 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
              placeholder="e.g. $60k - $80k" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
            <input 
              value={posted} 
              onChange={(e) => setPosted(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
              placeholder="e.g. Full-time, Contract" 
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button onClick={onCancel} className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-all duration-200">
            Cancel
          </button>
          <button
            onClick={() => onSave({ title, company, location, budget, posted })}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{job.id ? "Save Changes" : "Post Job"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}