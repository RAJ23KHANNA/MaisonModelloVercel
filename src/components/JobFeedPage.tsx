// src/components/JobFeedPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Briefcase } from "lucide-react";
import { getJobsForDiscover, JobRow } from "../lib/jobsService";

// Helper component for a single job item
const JobItem = ({ job, onClick }: { job: JobRow & { profiles?: any }, onClick: (id: string) => void }) => {
  const companyName = job.profiles?.company_name || job.profiles?.full_name || job.company || "Unknown Company";
  
  return (
    <div
      key={job.id}
      onClick={() => job.id && onClick(job.id)}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-neutral-900 mb-2">{job.title || "Job Title"}</h3>
          <div className="text-amber-600 mb-3">
            {companyName}
          </div>
          <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location || "Remote"}</span>
            </div>
            {job.budget && <div>Budget: {job.budget}</div>}
            {(job.applicants !== undefined && job.applicants !== null) && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
              </div>
            )}
          </div>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition whitespace-nowrap">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export function JobFeedPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch jobs using the function from jobsService.ts
        const jobList = await getJobsForDiscover(50, 0);
        setJobs(jobList);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = (id: string) => {
    // Navigate to the JobDetailsPage using the job ID
    navigate(`/job/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-neutral-500 text-lg">
        <Briefcase className="w-6 h-6 animate-pulse mr-2" /> Loading job opportunities...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }
  
  const jobCount = jobs.length;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Job Opportunities</h1>
        
        <p className="mb-6 text-neutral-600">
          {jobCount} {jobCount === 1 ? 'job' : 'jobs'} found
        </p>

        {jobCount === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl shadow-sm">
            <Briefcase className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <p className="text-neutral-700 font-medium">No job opportunities posted yet.</p>
            <p className="text-neutral-500 text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobItem key={job.id} job={job} onClick={handleJobClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}