import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Briefcase,
  MessageCircle,
  UserPlus,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabaseClient";
import {
  sendConnectionRequest,
  getConnectionStatus,
} from "../lib/connectionUtils";

export function DesignerProfileActual() {
  const { id: designerId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------
  // 1. Load Designer Profile + Jobs + Connection Status
  // -------------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      if (!designerId) return;

      setLoading(true);

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", designerId)
        .single();

      setProfile(profileData || null);

      // Load jobs posted by this designer (from "jobs" table later)
      // TEMPORARY DUMMY jobs until your jobs table connects:
      setOpenJobs([
        {
          title: "Editorial Shoot Model",
          location: "Paris, France",
          date: "Feb 20, 2025",
          budget: "$800 - $1500",
          applicants: 32,
        },
        {
          title: "Runway Model – Spring Fashion Show",
          location: "Milan, Italy",
          date: "March 12, 2025",
          budget: "$1500 - $4000",
          applicants: 52,
        },
      ]);

      // Load connection status
      const status = await getConnectionStatus(designerId);
      if (status) {
        if (status.status === "accepted") setConnectionStatus("accepted");
        else if (status.userPerspective === "sent")
          setConnectionStatus("pending");
        else setConnectionStatus("none");

        setConnectionRequestId(status.id);
      } else {
        setConnectionStatus("none");
      }

      setLoading(false);
    };

    loadData();

    // Real-time update on connection acceptance
    const connChannel = supabase
      .channel("designer-conn")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "connections" },
        async (payload) => {
          if (payload.new.status === "accepted") {
            const refreshed = await getConnectionStatus(designerId);
            if (refreshed) setConnectionStatus("accepted");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connChannel);
    };
  }, [designerId]);

  // -------------------------------------------------------------
  // 2. Handle Connect
  // -------------------------------------------------------------
  const handleConnect = async () => {
    if (!designerId) return;

    const connection = await getConnectionStatus(designerId);

    // No connection → send request
    if (!connection) {
      await sendConnectionRequest(designerId);
      setConnectionStatus("pending");
      return;
    }

    // Already connected
    if (connection.status === "accepted") {
      alert("Already connected");
      return;
    }

    // Pending
    if (connection.status === "pending") {
      if (connection.userPerspective === "sent") {
        alert("Request already sent");
      } else {
        alert("They already sent you a request");
      }
      return;
    }

    // Rejected long ago → resend
    if (connection.status === "rejected") {
      await sendConnectionRequest(designerId);
      setConnectionStatus("pending");
      return;
    }
  };

  // -------------------------------------------------------------
  // UI States
  // -------------------------------------------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-neutral-500 text-lg">
        Loading designer profile...
      </div>
    );

  if (!profile)
    return (
      <div className="p-10 text-center text-neutral-500">
        Designer profile not found.
      </div>
    );

  const portfolio =
    profile.portfolio_photos?.length > 0
      ? profile.portfolio_photos
      : [
          "https://images.unsplash.com/photo-1649774934082-bb90e15f1b89",
          "https://images.unsplash.com/photo-1600185365483-26d19da0e6a3",
          "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
        ];

  // -------------------------------------------------------------
  // PROFILE UI
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Cover Image */}
      <div className="relative h-80">
        <ImageWithFallback
          src={
            profile.cover_image ||
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN CARD */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src={
                      profile.profile_image ||
                      "https://via.placeholder.com/150?text=Logo"
                    }
                    alt={profile.company_name || profile.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-semibold text-2xl mb-2 text-neutral-900">
                      {profile.company_name || profile.full_name || "Designer"}
                    </h1>

                    <div className="flex items-center gap-4 text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location || "Unknown"}</span>
                      </div>

                      {profile.category && (
                        <>
                          <span>•</span>
                          <span>{profile.category}</span>
                        </>
                      )}
                    </div>

                    <p className="text-neutral-700 max-w-2xl">
                      {profile.bio || "No description provided."}
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Message */}
                    <button
                      onClick={() => navigate(`/messaging/${profile.id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>

                    {/* Connect */}
                    {connectionStatus === "accepted" ? (
                      <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg">
                        Connected
                      </button>
                    ) : connectionStatus === "pending" ? (
                      <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg">
                        Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={handleConnect}
                        className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                  <Stat label="Followers" value={profile.instagram_followers} />
                  <Stat label="Connections" value={profile.connections} />
                  <Stat label="Projects" value={profile.projects || 0} />
                  <Stat label="Team Size" value={profile.team_size || 0} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TWO COL LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ABOUT */}
            <Section title="About the Designer">
              <p className="text-neutral-700">
                {profile.bio ||
                  "This designer has not added a description yet."}
              </p>
            </Section>

            {/* PORTFOLIO */}
            <Section title="Portfolio">
              <div className="grid grid-cols-2 gap-4">
                {portfolio.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative group rounded-lg overflow-hidden aspect-[3/4]"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* OPEN JOBS */}
            <Section title="Open Positions">
              {openJobs.length === 0 ? (
                <div className="text-neutral-500">No active jobs.</div>
              ) : (
                openJobs.map((job, i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 rounded-lg p-6 hover:bg-neutral-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-neutral-900 font-medium mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-neutral-600 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-neutral-900 font-medium">
                          {job.budget}
                        </div>
                        <div className="text-neutral-600 text-sm">
                          {job.applicants} applicants
                        </div>
                      </div>
                    </div>

                    <button className="px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 text-sm">
                      View Applications
                    </button>
                  </div>
                ))
              )}
            </Section>

            {/* ENDORSEMENTS */}
            <Section title="Endorsements & Reviews">
              {(profile.endorsements || []).map((e: any, i: number) => (
                <div
                  key={i}
                  className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neutral-300 rounded-full"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{e.name}</h4>
                      <p className="text-neutral-600 text-sm">{e.role}</p>
                      <p className="text-neutral-700 mt-2">{e.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <Section title="Contact Information">
              <div className="space-y-3 text-sm">
                <Field label="Location" value={profile.location} />
                <Field label="Email" value={profile.email} />
                <Field label="Website" value={profile.website} />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Components --------------------------------------------------------- */

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <div className="text-neutral-600 text-sm">{label}</div>
    <div className="text-neutral-900">{value || "—"}</div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <h2 className="text-neutral-900 mb-6 font-medium">{title}</h2>
    {children}
  </div>
);

const Stat = ({ label, value }: { label: string; value?: any }) => (
  <div>
    <div className="text-neutral-900 font-medium">{value || 0}</div>
    <div className="text-neutral-600 text-sm">{label}</div>
  </div>
);
