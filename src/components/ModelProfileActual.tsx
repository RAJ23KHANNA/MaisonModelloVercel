import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Instagram,
  Award,
  MessageCircle,
  UserPlus,
  Calendar,
  Play,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabaseClient";
import {
  sendConnectionRequest,
  getConnectionStatus,
} from "../lib/connectionUtils";

interface ModelProfileActualProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function ModelProfileActual({ onNavigate }: ModelProfileActualProps) {
  const { id: profileId } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // -----------------------------------------
  // ✅ Load profile + connection status
  // -----------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        setError("Invalid profile ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles_view")
          .select("*")
          .eq("id", profileId)
          .single();

        if (error) {
          setError("Profile not found or access restricted.");
          setProfile(null);
        } else {
          setProfile(data);
          setError(null);
        }

        // 🔍 Fetch connection state
        const connection = await getConnectionStatus(profileId);

        if (connection) {
          if (connection.status === "accepted") {
            setConnectionStatus("accepted");
          } else if (connection.userPerspective === "sent") {
            setConnectionStatus("pending"); // you sent the request
          } else {
            setConnectionStatus("none"); // no request from you yet
          }

          setConnectionRequestId(connection.id);
        } else {
          setConnectionStatus("none"); // no connection at all
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading the profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // 🚀 Real-time updates for connection acceptance
    const subscription = supabase
      .channel("connections-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "connections" },
        async (payload) => {
          if (payload.new.status === "accepted") {
            console.log("🔄 Connection accepted — refreshing profile data");

            const { data, error } = await supabase
              .from("profiles_view")
              .select("*")
              .eq("id", profileId)
              .single();

            if (!error) setProfile(data);

            // Optionally refresh connection status as well
            const connection = await getConnectionStatus(profileId);
            if (connection) {
              setConnectionStatus("accepted");
              setConnectionRequestId(connection.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileId]);

  // -----------------------------------------
  // ✅ Handle "Connect"
  // -----------------------------------------

  const handleConnect = async () => {
    try {
      if (!profileId) return;

      console.log("🔍 Checking existing connection...");
      const connection = await getConnectionStatus(profileId);
      console.log("ℹ️ Connection status result:", connection);

      if (!connection) {
        console.log("🟢 No existing connection — sending request...");
        await sendConnectionRequest(profileId);
        setConnectionStatus("sent");
        return;
      }

      if (connection.status === "pending") {
        if (connection.userPerspective === "sent") {
          alert("Request already sent");
        } else {
          alert("You have a pending request from this user");
        }
        return;
      }

      if (connection.status === "accepted") {
        alert("You are already connected");
        return;
      }

      if (connection.status === "rejected") {
        console.log("🟡 Old rejected connection — resending...");
        await sendConnectionRequest(profileId);
        setConnectionStatus("sent");
        return;
      }
    } catch (error) {
      console.error("❌ handleConnect error:", error);
    }
  };

  // -----------------------------------------
  // UI States
  // -----------------------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-neutral-500 text-lg">
        Loading profile...
      </div>
    );

  if (error)
    return <div className="p-10 text-center text-neutral-500">{error}</div>;

  if (!profile)
    return (
      <div className="p-10 text-center text-neutral-500">
        Profile not found.
      </div>
    );

  // Default placeholders
  const portfolioImages = profile.portfolio_images?.length
    ? profile.portfolio_images
    : [
        "https://images.unsplash.com/photo-1721003080966-423d4017d09d",
        "https://images.unsplash.com/photo-1627661364735-eab249361d46",
        "https://images.unsplash.com/photo-1675387117695-85ca09fe6b26",
        "https://images.unsplash.com/photo-1583981399285-7e22c78c9b2b",
      ];

  const endorsements = profile.endorsements?.length
    ? profile.endorsements
    : [
        {
          name: "Maison Élégance",
          role: "Creative Director",
          text: "Professional and captivating on the runway, she brings every design to life.",
        },
        {
          name: "Vogue Editorial Team",
          role: "Fashion Editor",
          text: "A visionary collaborator who elevates every photoshoot.",
        },
      ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Banner */}
      <div className="relative h-80">
        <ImageWithFallback
          src={
            profile.cover_image ||
            "https://images.unsplash.com/photo-1622079400278-b96fa6002733"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src={
                      profile.profile_image ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-neutral-900 mb-2 font-semibold text-2xl">
                      {profile.full_name || "Unnamed Model"}
                    </h1>

                    <div className="flex items-center gap-4 text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location || "Unknown"}</span>
                      </div>

                      {profile.experience && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{profile.experience}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-neutral-700 max-w-2xl">
                      {profile.bio ||
                        "Professional model specializing in fashion, editorial, and commercial work."}
                    </p>
                  </div>

                  {/* ----------------------------------------- */}
                  {/* ✅ ACTION BUTTONS (UPDATED)               */}
                  {/* ----------------------------------------- */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Message Button */}
                    <button
                      onClick={() => navigate(`/messaging/${profile.id}`)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>

                    {/* Dynamic Connection Button */}
                    {connectionStatus === "accepted" ? (
                      <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2">
                        Connected
                      </button>
                    ) : connectionStatus === "pending" ? (
                      <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2">
                        Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={handleConnect}
                        className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    )}

                    {/* Invite Button */}
                    <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Invite to Show
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                  <Stat
                    label="Instagram Followers"
                    value={profile.instagram_followers}
                  />
                  <Stat
                    label="TikTok Followers"
                    value={profile.tiktok_followers}
                  />
                  <Stat
                    label="Fashion Shows"
                    value={profile.fashion_shows || profile.shows}
                  />
                  <Stat label="Connections" value={profile.connections} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT + PORTFOLIO + ENDORSEMENTS */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Section title="About">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Height" value={profile.height} />
                <Field label="Measurements" value={profile.measurements} />
                <Field label="Hair" value={profile.hair} />
                <Field label="Eyes" value={profile.eyes} />
                <Field label="Experience" value={profile.experience} />
                <Field label="Languages" value={profile.languages} />
              </div>
            </Section>

            <Section title="Portfolio">
              <div className="grid grid-cols-2 gap-4">
                {portfolioImages.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer rounded-lg overflow-hidden aspect-[3/4]"
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                    {i === 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-neutral-800 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Endorsements & Reviews">
              {endorsements.map((e, i) => (
                <div
                  key={i}
                  className="border-b border-neutral-200 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-neutral-900">{e.name}</div>
                          <div className="text-neutral-600 text-sm">
                            {e.role}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="w-4 h-4 text-amber-500 fill-amber-500"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700">{e.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <Section title="Social Media Reach">
              <Social
                platform="Instagram"
                count={profile.instagram_followers}
              />
              <Social platform="TikTok" count={profile.tiktok_followers} />
            </Section>

            <Section title="Experience Highlights">
              <Highlight
                title="Paris Fashion Week"
                desc="Featured for Chanel, Dior, Givenchy."
              />
              <Highlight title="Vogue Cover" desc="Vogue Paris, March 2024." />
              <Highlight
                title="Brand Campaigns"
                desc="Collaborated with 40+ luxury brands."
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <div className="text-neutral-600 text-sm mb-1">{label}</div>
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

const Stat = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <div className="text-neutral-900">{value || 0}</div>
    <div className="text-neutral-600 text-sm">{label}</div>
  </div>
);

const Social = ({ platform, count }: { platform: string; count?: number }) => {
  const icon =
    platform === "Instagram" ? (
      <Instagram className="w-5 h-5 text-white" />
    ) : (
      <TrendingUp className="w-5 h-5 text-white" />
    );

  const bg =
    platform === "Instagram"
      ? "from-pink-500 to-orange-500"
      : "from-neutral-800 to-neutral-600";

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${bg} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <div className="text-neutral-900">{platform}</div>
          <div className="text-neutral-600 text-sm">{count || 0} followers</div>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-neutral-400" />
    </div>
  );
};

const Highlight = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex items-start gap-3 mb-3">
    <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
    <div>
      <div className="text-neutral-900">{title}</div>
      <div className="text-neutral-600 text-sm">{desc}</div>
    </div>
  </div>
);
