"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { User, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ConnectionsNetwork() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const currentUserId = userData.user.id;

        // 1️⃣ Get all accepted connections where current user is sender or receiver
        const { data, error } = await supabase
          .from("connections")
          .select("id, sender_id, receiver_id, status")
          .eq("status", "accepted")
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

        if (error) throw error;

        if (!data?.length) {
          setConnections([]);
          setLoading(false);
          return;
        }

        // 2️⃣ Extract the IDs of other connected users
        const otherIds = data.map((c) =>
          c.sender_id === currentUserId ? c.receiver_id : c.sender_id
        );

        // 3️⃣ Fetch those users' profiles
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, role, location, profile_image")
          .in("id", otherIds);

        if (profileError) throw profileError;

        setConnections(profiles || []);
      } catch (err) {
        console.error("❌ Error loading network:", err);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-neutral-900 mb-6">My Network</h1>

        {connections.length === 0 ? (
          <div className="text-center text-neutral-500 py-20">
            You don’t have any connections yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {connections.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition p-6 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={
                      user.profile_image ||
                      "https://via.placeholder.com/100x100?text=User"
                    }
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-neutral-900">{user.full_name}</h3>
                <p className="text-neutral-600 text-sm">
                  {user.role || "User"}
                </p>
                <div className="flex items-center justify-center gap-1 text-neutral-500 text-sm mt-1 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location || "Unknown"}</span>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => navigate(`/messaging/${user.id}`)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => navigate(`/model/${user.id}`)}
                    className="flex-1 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition flex items-center justify-center gap-2 text-neutral-700"
                  >
                    <User className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
