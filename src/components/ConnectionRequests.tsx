"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Check, X, Loader2, Search, Users } from "lucide-react"; // Added Users icon for network
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../lib/connectionUtils";

// Placeholder for your network component – replace with actual import
import { ConnectionsNetwork } from "./ConnectionsNetwork"; // Assuming this is your network component

export function ConnectionRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "network">("requests"); // Tab state
  const [requestCount, setRequestCount] = useState(0); // Counter for pending requests

  const loadRequests = async () => {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log("👤 Logged in:", userId);

    const { data: pending, error } = await supabase
      .from("connections")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("Error loading requests:", error);
      setLoading(false);
      return;
    }

    setRequestCount(pending?.length || 0); // Update counter

    console.log("🟡 Pending:", pending);

    if (!pending?.length) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const senderIds = pending.map((p) => p.sender_id);
    const { data: senders } = await supabase
      .from("profiles")
      .select("id, full_name, role, profile_image, location")
      .in("id", senderIds);

    const merged = pending.map((r) => ({
      ...r,
      sender: senders?.find((s) => s.id === r.sender_id),
    }));

    console.log("✅ Merged:", merged);
    setRequests(merged);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await acceptConnectionRequest(id);
      await loadRequests(); // Refresh to update counter and list
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectConnectionRequest(id);
      await loadRequests();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const filtered = requests.filter((r) =>
    (r.sender?.full_name || "")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  if (loading && activeTab === "requests")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "requests"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Invitations {requestCount > 0 && `(${requestCount})`} {/* Counter */}
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "network"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Users className="inline w-4 h-4 mr-1" /> Network
          </button>
        </div>

        {/* Search Bar (Shared or Per-Tab) */}
        {activeTab === "requests" && (
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              placeholder="Search invitations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "requests" ? (
          // Your existing requests view
          !filtered.length ? (
            <div className="text-center text-neutral-500 py-20">
              No pending invitations.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        r.sender?.profile_image ||
                        "https://via.placeholder.com/80?text=User"
                      }
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-neutral-900">
                        {r.sender?.full_name || "Unknown"}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {r.sender?.role || "User"} •{" "}
                        {r.sender?.location || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(r.id)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600"
                    >
                      <Check className="inline w-4 h-4 mr-1" /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="flex-1 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      <X className="inline w-4 h-4 mr-1" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Network Tab – Render your network component here
          <ConnectionsNetwork /> // Replace with your actual network component
        )}
      </div>
    </div>
  );
}
