import { useEffect, useState } from "react";
import { MapPin, Calendar, Users } from "lucide-react";
import { fetchJobsByDesigner, JobRow } from "../lib/jobsService";

export function DesignerJobList({ designerId }: { designerId: string }) {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchJobsByDesigner(designerId);
        setJobs(data || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
      setLoading(false);
    }
    load();
  }, [designerId]);

  if (loading)
    return (
      <div className="p-6 text-center text-neutral-500">
        Loading jobs...
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-neutral-900">Open Positions</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="text-neutral-500">No open positions.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-neutral-200 rounded-lg p-6 hover:border-amber-300 hover:bg-amber-50/30 transition cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-neutral-900 mb-2">{job.title}</h3>

                  <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    )}

                    {job.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-neutral-900 font-semibold">
                    {job.budget || "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
