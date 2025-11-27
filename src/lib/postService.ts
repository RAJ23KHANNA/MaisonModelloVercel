import { supabase } from "./supabaseClient";

// Upload a single file (image/video)
export async function uploadMedia(file: File) {
  const ext = file.name.split(".").pop();
  const filePath = `${Date.now()}-${Math.random()}.${ext}`;

  const { error } = await supabase.storage
    .from("posts")
    .upload(filePath, file, { upsert: false });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("posts")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}

// Create post
export async function createPost(content: string, mediaFiles: File[]) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) throw new Error("Must be logged in");

  let mediaUrls: string[] = [];

  for (const file of mediaFiles) {
    const url = await uploadMedia(file);
    mediaUrls.push(url);
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
      media_urls: mediaUrls,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// Fetch feed posts from: you + your connections
export async function getFeedPosts(userId: string) {
  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  const connectedIds = new Set([userId]);

  connections?.forEach((c) => {
    connectedIds.add(c.sender_id);
    connectedIds.add(c.receiver_id);
  });

  const idsArray = [...connectedIds];

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .in("user_id", idsArray)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return posts;
}

// Fetch posts for a specific profile page
export async function getUserPosts(profileId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
