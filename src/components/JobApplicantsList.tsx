// src/components/JobApplicantsList.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, MapPin, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApplicantRow {
  id: string;
  created_at: string;
  status: string;
  profiles: {
    id: string;
    full_name: string | null;
    role: string | null;
    location: string | null;
    profile_image: string | null;
  };
}

export function JobApplicantsList({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchApplicants() {
    setLoading(true);

    // 1️⃣ Fetch raw applications
    const { data: apps, error: appsError } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (appsError) {
      console.error("Failed to load applicants:", appsError);
      setApplicants([]);
      setLoading(false);
      return;
    }

    if (apps.length === 0) {
      setApplicants([]);
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch related profiles
    const applicantIds = apps.map((a) => a.applicant_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, role, location, profile_image")
      .in("id", applicantIds);

    if (profilesError) {
      console.error("Failed to load profiles:", profilesError);
      setApplicants([]);
      setLoading(false);
      return;
    }

    // 3️⃣ Merge results manually
    const merged = apps.map((app) => ({
      id: app.id,
      created_at: app.created_at,
      status: app.status,
      profiles: profiles.find((p) => p.id === app.applicant_id),
    }));

    setApplicants(merged);
    setLoading(false);
  }

  fetchApplicants();
}, [jobId]);


  if (loading)
    return (
      <div className="py-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    );

  if (applicants.length === 0)
    return (
      <div className="text-neutral-500 py-6 text-center">
        No applicants yet.
      </div>
    );

  return (
    <div className="space-y-4">
      {applicants.map((a) => {
        const profile = a.profiles;
        const profileUrl =
          profile.role === "model"
            ? `/model/${profile.id}`
            : `/designer/${profile.id}`;

        return (
          <div
            key={a.id}
            onClick={() => navigate(profileUrl)}
            className="p-4 bg-neutral-50 rounded-xl border hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer flex items-center gap-4"
          >
            {/* Profile Image */}
            <img
              src={
                profile.profile_image ||
                "https://via.placeholder.com/80?text=User"
              }
              className="w-16 h-16 rounded-xl object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="text-neutral-900 font-medium mb-1">
                {profile.full_name || "Unknown User"}
              </div>

              <div className="flex gap-3 text-neutral-600 text-sm flex-wrap">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />{" "}
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="text-xs font-medium text-amber-600 bg-amber-100 px-3 py-1 rounded-lg">
              {a.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
