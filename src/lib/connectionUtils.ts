import { supabase } from "./supabaseClient";

/** --- Send Connection Request --- */
export async function sendConnectionRequest(receiverId: string) {
  const { data: auth } = await supabase.auth.getUser();
  const senderId = auth?.user?.id;
  if (!senderId) throw new Error("User not logged in");
  if (senderId === receiverId) throw new Error("Cannot connect with yourself");

  // 🔹 Check if connection exists in either direction
  const { data: existing, error: existingErr } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
    )
    .maybeSingle();

  if (existingErr) throw existingErr;

  // 🔹 Allow new request if previous was rejected
  if (existing) {
    if (existing.status === "pending" || existing.status === "accepted") {
      console.log("Connection already active:", existing.status);
      return existing;
    }
    if (existing.status === "rejected") {
      console.log("Old rejected connection found — deleting & resending...");
      await supabase.from("connections").delete().eq("id", existing.id);
    }
  }

  // 🔹 Create a new request
  const { data, error } = await supabase
    .from("connections")
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  console.log("✅ New connection request sent:", data);
  return data;
}

/** --- Get Connection Status --- */
// ✅ Corrected getConnectionStatus()
export async function getConnectionStatus(otherUserId: string) {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const currentUserId = auth?.user?.id;
      if (!currentUserId) return null;
  
      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
        )
        .maybeSingle();
  
      if (error) {
        console.error("❌ Error fetching connection status:", error);
        return null;
      }
  
      if (!data) return null;
  
      let label = data.status;
      if (data.status === "pending") {
        label = data.sender_id === currentUserId ? "sent" : "received";
      }
  
      return { ...data, userPerspective: label };
    } catch (err) {
      console.error("❌ Connection status check failed:", err);
      return null;
    }
  }
  

/** --- Accept Connection --- */
export async function acceptConnectionRequest(requestId: string) {
  try {
    console.log("🔹 Accepting connection:", requestId);

    // 1️⃣ Mark the connection as accepted
    const { error: updateError } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (updateError) throw updateError;

    console.log("✅ Connection status updated → accepted");

    // ❌ REMOVED: No need to manually increment 'profiles.connections' anymore.
    // The 'profiles_view' will automatically calculate the new count next time we fetch it.

    return { success: true };
  } catch (error) {
    console.error("❌ Error accepting connection:", error);
    throw error;
  }
}

/** --- Reject Connection --- */
export async function rejectConnectionRequest(requestId: string) {
  console.log("🔹 Rejecting request:", requestId);
  const { error } = await supabase
    .from("connections")
    .update({ status: "rejected" })
    .eq("id", requestId);
  if (error) throw error;
  console.log("❌ Connection rejected:", requestId);
  return { success: true };
}
