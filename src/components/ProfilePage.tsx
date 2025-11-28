import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  MapPin,
  Star,
  MessageCircle,
  UserPlus,
  Edit,
  Instagram,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import DesignerDashboardDrawer from "./DesignerDashboardDrawer";

/* ---------------------- SMALL COMPONENTS ---------------------- */

const ProfileField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <div className="text-neutral-600 text-sm mb-1">{label}</div>
    <div className="text-neutral-900">{value || "—"}</div>
  </div>
);

const SocialCard = ({
  platform,
  count,
}: {
  platform: string;
  count?: number;
}) => {
  const Icon =
    platform.toLowerCase() === "instagram"
      ? Instagram
      : platform.toLowerCase() === "tiktok"
      ? TrendingUp
      : null;

  const bgColor =
    platform.toLowerCase() === "instagram"
      ? "bg-gradient-to-br from-pink-500 to-orange-500"
      : platform.toLowerCase() === "tiktok"
      ? "bg-gradient-to-br from-neutral-800 to-neutral-600"
      : "bg-neutral-400";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        <div>
          <div className="text-neutral-900">{platform}</div>
          <div className="text-neutral-600 text-sm">{count || 0} followers</div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- MAIN PROFILE PAGE ---------------------- */

export function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openDesignerDashboard, setOpenDesignerDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------------- LOAD PROFILE ---------------------- */
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // Fetch logged-in user
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user || null;
      setCurrentUser(user);

      // If visiting /profile → redirect to /profile/:id
      if (!id && user) {
        navigate(`/profile/${user.id}`, { replace: true });
        return;
      }

      // Decide which profile to load
      const profileId = id || user?.id;

      if (!profileId) {
        console.warn("No valid profile ID found.");
        setLoading(false);
        return;
      }

      // Fetch profile from DB
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    loadProfile();
  }, [id, navigate]);

  /* ---------------------- LOADING / ERROR UI ---------------------- */

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading profile...</div>
    );

  if (!profile)
    return (
      <div className="p-10 text-center text-gray-500">
        Unable to load profile.
      </div>
    );

  const isCurrentUser = currentUser?.id === profile.id;

  /* ---------------------- PROFILE UI ---------------------- */

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Cover Banner */}
      <div className="relative h-80 bg-gradient-to-br from-neutral-200 to-neutral-300">
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

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={
                      profile.profile_image || "https://via.placeholder.com/150"
                    }
                    alt={profile.full_name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-neutral-900 mb-2">
                      {profile.full_name}
                    </h1>

                    <div className="flex items-center gap-4 text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location || "Location not set"}</span>
                      </div>

                      {profile.experience && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{profile.experience}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-neutral-700 max-w-2xl">
                      {profile.bio || "This profile has not added any bio yet."}
                    </p>
                  </div>

                  {/* Edit / Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                  {isCurrentUser ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate("/profile/setup")}
                        className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit Profile
                      </button>

                      {profile.role === "designer" && (
                        <button
                          onClick={() => setOpenDesignerDashboard(true)}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Designer Dashboard
                        </button>
                      )}
                    </div>
                  ) : (
                      <>
                        <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4" /> Message
                        </button>
                        <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4" /> Connect
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                  <div>
                    <div className="text-neutral-900">
                      {profile.instagram_followers || 0}
                    </div>
                    <div className="text-neutral-600 text-sm">
                      Instagram Followers
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-900">
                      {profile.tiktok_followers || 0}
                    </div>
                    <div className="text-neutral-600 text-sm">
                      TikTok Followers
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-900">
                      {profile.fashion_shows || profile.shows}
                    </div>
                    <div className="text-neutral-600 text-sm">
                      Fashion Shows
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-900">
                      {profile.connections}
                    </div>
                    <div className="text-neutral-600 text-sm">Connections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About + Social */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-neutral-900 mb-6">About</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileField label="Height" value={profile.height} />
                <ProfileField
                  label="Measurements"
                  value={profile.measurements}
                />
                <ProfileField label="Hair" value={profile.hair} />
                <ProfileField label="Eyes" value={profile.eyes} />
                <ProfileField label="Experience" value={profile.experience} />
                <ProfileField label="Languages" value={profile.languages} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Social Media Reach</h3>
              <div className="space-y-4">
                <SocialCard
                  platform="Instagram"
                  count={profile.instagram_followers}
                />
                <SocialCard
                  platform="TikTok"
                  count={profile.tiktok_followers}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openDesignerDashboard && (
  <DesignerDashboardDrawer
    designerId={profile.id}
    onClose={() => setOpenDesignerDashboard(false)}
  />
)}

    </div>
  );
}
