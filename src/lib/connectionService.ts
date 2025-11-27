// src/lib/connectionService.ts
import { supabase } from "./supabaseClient";

/**
 * Get the number of accepted connections for a user.
 * Uses the `count_user_connections` RPC we created in Supabase.
 */
export async function getConnectionCount(userId: string): Promise<number> {
  if (!userId) return 0;

  const { data, error } = await supabase.rpc("count_user_connections", {
    uid: userId,
  });

  if (error) {
    console.error("Failed to fetch connection count:", error);
    return 0;
  }

  // data is an integer returned by the RPC
  return data ?? 0;
}
