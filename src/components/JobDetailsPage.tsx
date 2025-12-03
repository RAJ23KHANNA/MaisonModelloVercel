// src/pages/JobDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Briefcase, Clock, Bookmark, Share2, Send } from "lucide-react";
import { getJobById, checkIfApplied, applyToJob, getRelatedJobs, getJobApplications } from "../lib/jobsService";
import { supabase } from "../lib/supabaseClient";
import ApplyModal from "../components/ApplyModal";

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

export default function JobDetailsPage({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [related, setRelated] = useState<any[]>([]);
  const [applicantsCount, setApplicantsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
        setLoading(false); 
      return;
    }
    (async () => {
      setLoading(true);
      const j = await getJobById(id);
      setJob(j);

      // check ownership
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      setIsOwner(!!(uid && j?.designer_id === uid));

      // check applied
      if (uid) {
        const hasApplied = await checkIfApplied(id, uid);
        setApplied(hasApplied);
      }

      // related
      const rel = await getRelatedJobs(id, j?.designer_id);
      setRelated(rel || []);

      // applicant count (jobs table should have applicants updated by trigger)
      setApplicantsCount((j?.applicants as number) ?? null);

      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading job...</div>;
  if (!job) return <div className="p-8 text-center">Job not found.</div>;

  const handleApplyClick = () => {
    setShowApply(true);
  };

  const onApplied = async () => {
    // refresh applied state and applicants count
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    setApplied(!!(uid && (await checkIfApplied(job.id, uid))));
    // Refresh job to get applicant count (or rely on trigger)
    const fresh = await getJobById(job.id);
    setApplicantsCount(fresh?.applicants ?? applicantsCount);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start gap-4 pb-6 border-b border-neutral-200 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-2xl">{(job?.profiles?.company_name || job?.company || "M").charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-neutral-900 mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-neutral-600">
                    <button
                      onClick={() => {
                        if (onNavigate && job.profiles?.id) onNavigate(`/designer/${job.profiles.id}`);
                        else navigate(`/designer/${job.profiles?.id}`);
                      }}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      {job.company || job.profiles?.company_name || job.profiles?.full_name}
                    </button>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location || "Location not set"}</span>
                    </div>
                    <span>•</span>
                    <span className="text-neutral-500">Posted {timeAgo(job.created_at)}</span>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="text-neutral-900 font-semibold">{job.budget || "—"}</div>
                  <div className="text-neutral-500 text-sm mt-1">{applicantsCount ?? 0} applicants</div>
                </div>
              </div>

              {/* Job details grid */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Budget Range</div>
                    <div className="text-neutral-900">{job.budget || "Negotiable"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Posted</div>
                    <div className="text-neutral-900">{new Date(job.created_at || "").toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Experience Level</div>
                    <div className="text-neutral-900">Intermediate to Expert</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Duration</div>
                    <div className="text-neutral-900">See description</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">Job Description</h2>
                <div className="text-neutral-700 space-y-4">
                  <p>{job?.description || "No description provided by the designer."}</p>
                </div>
              </div>

              {/* Requirements & What we offer placeholders */}
              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">Model Requirements</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* We keep simple placeholders; designers can edit job description to include requirements */}
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-neutral-600 text-sm mb-1">Generic requirement</div>
                    <div className="text-neutral-900">See job description</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">How to Apply</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-neutral-700 mb-4">
                    Submit your application through Runway. Make sure your profile is updated with portfolio photos, measurements and recent work.
                  </p>
                  <div className="text-neutral-600 text-xs">
                    We recommend adding a short note when applying.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {!isOwner && (
                <button
                  onClick={handleApplyClick}
                  className={`w-full py-3 ${applied ? "bg-neutral-300 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-amber-600"} text-white rounded-lg mb-3`}
                  disabled={applied}
                >
                  {applied ? "Applied" : "Apply Now"}
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    // If owner, open job edit in your designer dashboard — navigate to profile and open drawer
                    navigate(`/profile/${job.profiles?.id}`);
                    // suggestion: you can pass UI state to open drawer or query param ?open=dashboard
                  }}
                  className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg mb-3"
                >
                  Edit Job
                </button>
              )}

              <button className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 mb-3 flex items-center justify-center gap-2">
                <Bookmark className="w-4 h-4" />
                Save Job
              </button>

              <button
                onClick={() => {
                  // message designer
                  const designerId = job?.profiles?.id;
                  if (designerId) navigate(`/messaging/${designerId}`);
                }}
                className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 mb-3 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Message Recruiter
              </button>

              <button className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-2">
                  <span className="font-medium">{applicantsCount ?? 0}</span>
                  <span>applicants</span>
                </div>
                <div className="text-neutral-500 text-xs">Be one of the first to apply</div>
              </div>
            </div>

            {/* Company About */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">About {job.profiles?.company_name || job.profiles?.full_name}</h3>
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-400 text-2xl">{(job.profiles?.company_name || job.profiles?.full_name || "M").charAt(0)}</span>
              </div>
              <p className="text-neutral-700 text-sm mb-4">{job.profiles?.bio || "No company bio."}</p>
              <button onClick={() => navigate(`/designer/${job.profiles?.id}`)} className="text-amber-600 hover:text-amber-700 text-sm">View Company Profile →</button>
            </div>

            {/* Related Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Related Opportunities</h3>
              <div className="space-y-4">
                {related.map((r) => (
                  <div key={r.id} className="border border-neutral-200 rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50/30 transition cursor-pointer" onClick={() => navigate(`/job/${r.id}`)}>
                    <h4 className="text-neutral-900 text-sm mb-2">{r.title}</h4>
                    <div className="text-neutral-600 text-xs mb-2">{r.company}</div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{r.location}</span>
                      <span>{r.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApply && job?.id && (
        <ApplyModal jobId={job.id} onClose={() => setShowApply(false)} onApplied={onApplied} />
      )}
    </div>
  );
}
