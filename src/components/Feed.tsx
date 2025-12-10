// src/components/Feed.tsx
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  TrendingUp,
  Image as ImageIcon,
  X,            // Added
  Plus,         // Added
  Film,         // Added
  GripVertical, // Added
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CreatePost } from "./CreatePost";
import { getFeedPosts } from "../lib/postService";
import MediaCarousel from "./MediaCarousel";
import { getConnectionCount } from "../lib/connectionService";


/**
 * Feed.tsx
 * - Shows feed (all posts sorted newest -> oldest)
 * - Create post (text + optional image/video upload to bucket "posts")
 * - Like / Unlike
 * - Comments (modal)
 * - Delete post (if owner)
 *
 * Uses DB tables:
 * posts (id, user_id, content, media_urls text[], created_at)
 * post_likes (post_id, user_id)
 * post_comments (post_id, user_id, content)
 *
 * NOTE: ensure a storage bucket named "posts" exists, or change storage bucket variable.
 */

const STORAGE_BUCKET = "posts";

interface PostRow {
  id: string;
  user_id: string | null;
  content?: string | null;
  media_urls?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  // relationships (if returned)
  profiles?: {
    id?: string;
    full_name?: string;
    profile_image?: string;
    role?: string;
    location?: string;
    connections?: number;
  };
  post_likes?: { id: string }[]; // if relationship included
  post_comments?: { id: string }[]; // if relationship included
}

export function Feed({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [commentingPost, setCommentingPost] = useState<PostRow | null>(null);

  // local map of liked posts by current user for quick UI
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  // maps postId -> like count
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  // comment count map
  const [commentCountMap, setCommentCountMap] = useState<
    Record<string, number>
  >({});
  // loading states for actions
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [activeDeletePostId, setActiveDeletePostId] = useState(null);

  // Function to handle the click of the three dots button
  const handleMoreClick = (postId) => {
    // Toggle visibility of the delete button for the clicked post
    setActiveDeletePostId((prevPostId) =>
      prevPostId === postId ? null : postId
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) setCurrentUser(userData.user);

      await loadPosts(userData?.user?.id ?? null);

      // optionally subscribe to posts changes (Realtime) if you want:
      // const postsSub = supabase
      //   .channel('public:posts')
      //   .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
      //     // refresh posts on change
      //     loadPosts(userData?.user?.id ?? null);
      //   })
      //   .subscribe();

      setLoading(false);

      // return () => supabase.removeChannel(postsSub);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  async function uploadPostFiles(userId: string, files: File[]) {
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}-${file.name.replace(
        /\s+/g,
        "_"
      )}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(filePath, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        uploaded.push(publicData.publicUrl);
      }
    }

    return uploaded;
  }

  async function loadPosts(currentUserId: string | null) {
    setLoading(true);
    try {
      // try to use relationships (profiles, post_likes, post_comments) if available
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles:user_id(id, full_name, profile_image, role, location),
          post_likes(id, user_id),
          post_comments(id)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.warn(
          "Could not fetch posts with relationships, falling back to minimal fetch:",
          error
        );
        // fallback: fetch posts only, then fetch related counts separately
        const { data: postsOnly, error: postsErr } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (postsErr) {
          console.error("Error fetching posts:", postsErr);
          setPosts([]);
        } else {
          setPosts(postsOnly || []);
          // then compute counts...
          await computeCountsForPosts(postsOnly || [], currentUserId);
        }
      } else {
        const rows = (data || []) as PostRow[];
        setPosts(rows);
        // compute like/comment counts & whether current user liked
        const likeMap: Record<string, number> = {};
        const likeUserMap: Record<string, boolean> = {};
        const commentMap: Record<string, number> = {};
        rows.forEach((r) => {
          likeMap[r.id] = r.post_likes ? r.post_likes.length : 0;
          commentMap[r.id] = r.post_comments ? r.post_comments.length : 0;
          // check if current user liked this post
          likeUserMap[r.id] = !!(
            currentUserId &&
            r.post_likes &&
            r.post_likes.find((l) => l.user_id === currentUserId)
          );
        });
        setLikeCountMap(likeMap);
        setCommentCountMap(commentMap);
        setLikedMap(likeUserMap);
      }
    } catch (err) {
      console.error("loadPosts catch err:", err);
    } finally {
      setLoading(false);
    }
  }

  async function computeCountsForPosts(
    postRows: any[],
    currentUserId: string | null
  ) {
    // When relationships weren't available, compute like/comment counts in batches.
    const ids = postRows.map((p) => p.id);
    if (ids.length === 0) return;
    try {
      const { data: likes, error: likesErr } = await supabase
        .from("post_likes")
        .select("post_id, user_id", { count: "exact" })
        .in("post_id", ids);

      // Using a separate query per count is expensive, but this is a fallback.
      const likeMap: Record<string, number> = {};
      const likeUserMap: Record<string, boolean> = {};
      if (!likesErr && likes) {
        // aggregate counts
        likes.forEach((row: any) => {
          likeMap[row.post_id] = (likeMap[row.post_id] || 0) + 1;
          if (row.user_id && currentUserId && row.user_id === currentUserId) {
            likeUserMap[row.post_id] = true;
          }
        });
      }

      const { data: comments, error: commentsErr } = await supabase
        .from("post_comments")
        .select("post_id", { count: "exact" })
        .in("post_id", ids);

      const commentMap: Record<string, number> = {};
      if (!commentsErr && comments) {
        comments.forEach((c: any) => {
          commentMap[c.post_id] = (commentMap[c.post_id] || 0) + 1;
        });
      }

      setLikeCountMap((s) => ({ ...s, ...likeMap }));
      setCommentCountMap((s) => ({ ...s, ...commentMap }));
      setLikedMap((s) => ({ ...s, ...likeUserMap }));
    } catch (err) {
      console.error("computeCountsForPosts err:", err);
    }
  }

  // ------------------ Actions ------------------

  async function handleLikeToggle(postId: string) {
    if (!currentUser) {
      alert("Please login to like posts.");
      return;
    }
    setActionLoading((s) => ({ ...s, [postId]: true }));
    try {
      const liked = !!likedMap[postId];

      if (liked) {
        // unlike: delete row
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .match({ post_id: postId, user_id: currentUser.id });
        if (error) throw error;
        setLikedMap((s) => ({ ...s, [postId]: false }));
        setLikeCountMap((s) => ({
          ...s,
          [postId]: Math.max(0, (s[postId] || 1) - 1),
        }));
      } else {
        // like: insert
        const { error } = await supabase.from("post_likes").insert([
          {
            post_id: postId,
            user_id: currentUser.id,
          },
        ]);
        if (error) {
          // unique constraint will throw if already exists
          if ((error as any).code === "23505") {
            // already liked, ignore
            setLikedMap((s) => ({ ...s, [postId]: true }));
          } else throw error;
        } else {
          setLikedMap((s) => ({ ...s, [postId]: true }));
          setLikeCountMap((s) => ({ ...s, [postId]: (s[postId] || 0) + 1 }));
        }
      }
    } catch (err) {
      console.error("toggle like error:", err);
      alert("Could not toggle like. See console.");
    } finally {
      setActionLoading((s) => ({ ...s, [postId]: false }));
    }
  }

  async function handleDeletePost(postId: string) {
    if (!currentUser) {
      alert("Not authenticated");
      return;
    }
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      setPosts((p) => p.filter((x) => x.id !== postId));
    } catch (err) {
      console.error("delete post error:", err);
      alert("Could not delete post.");
    }
  }

  // Share increments a local share count (no table provided). We will
  // update a local counter per-post so UI feels responsive.
  function handleShare(postId: string) {
    // simplistic: bump a local share count stored in state as commentCountMap's sibling
    setCommentCountMap((s) => s); // no-op keep comments
    alert(
      "Share flow: you can copy link or share externally (not implemented)."
    );
  }

  // ------------------ Create Post ------------------
  async function createPost({
    text,
    files,
  }: {
    text?: string;
    files?: File[];
  }) {
    if (!currentUser) {
      alert("Please sign in to post.");
      return;
    }
    setActionLoading((s) => ({ ...s, create: true }));
    try {
      const mediaUrls: string[] = [];

      // upload files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          const ext = file.name.split(".").pop();
          const path = `${currentUser.id}/${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;

          const { error: uploadErr } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, { cacheControl: "3600", upsert: false });

          if (uploadErr) {
            console.error("upload error:", uploadErr);
            // continue (fail-safe)
            continue;
          }

          // get public URL
          const { data: pub } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);

          if (pub?.publicUrl) {
            mediaUrls.push(pub.publicUrl);
          }
        }
      }

      const insertPayload: any = {
        user_id: currentUser.id,
        content: text ?? null,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
      };

      const { data: newPost, error } = await supabase
        .from("posts")
        .insert(insertPayload)
        .select(
          `*, profiles:user_id(id, full_name, profile_image, role, location, connections)`
        );

      if (error) throw error;
      // newPost is array
      const row = (newPost && newPost[0]) as PostRow;
      setPosts((p) => [row, ...p]);
    } catch (err) {
      console.error("create post err:", err);
      alert("Post failed. See console.");
    } finally {
      setActionLoading((s) => ({ ...s, create: false }));
      setShowCreate(false);
    }
  }

  // ------------------ Comments ------------------
  async function fetchCommentsForPost(postId: string) {
    const { data, error } = await supabase
      .from("post_comments")
      .select("*, profiles:user_id(id, full_name, profile_image)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetchComments error:", error);
      return [];
    }
    return data;
  }

  async function addComment(postId: string, content: string) {
    if (!currentUser) {
      alert("Please sign in to comment.");
      return null;
    }
    const { data, error } = await supabase
      .from("post_comments")
      .insert([
        {
          post_id: postId,
          user_id: currentUser.id,
          content,
        },
      ])
      .select("*, profiles:user_id(id, full_name, profile_image)");
    if (error) {
      console.error("addComment error:", error);
      alert("Could not post comment.");
      return null;
    }
    // increment comment count
    setCommentCountMap((s) => ({ ...s, [postId]: (s[postId] || 0) + 1 }));
    return data && data[0];
  }

  // ------------------ Render ------------------

  return (
    <>
    <div className="min-h-screen bg-neutral-50 py-8 overflow-x-hidden">
      <div className="min-h-screen bg-neutral-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3 w-full">
            <div className="lg:sticky lg:top-24 space-y-6">
                <ProfileCard currentUser={currentUser} onNavigate={onNavigate} />
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-neutral-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => onNavigate("search")}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm"
                    >
                      Find Models
                    </button>
                    <button
                      onClick={() => onNavigate("job")}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm"
                    >
                      Browse Jobs
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm">
                      Events Near You
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="col-span-12 lg:col-span-6">
              {/* Create Post input (opens modal) */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex-1 text-left px-4 py-3 bg-neutral-50 border border-orange-400 rounded-full focus:outline-none"
                  >
                    Share your latest work or update...
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Photo</span>
                  </button>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm"
                  >
                    <Play className="w-5 h-5" />
                    <span>Video</span>
                  </button>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Achievement</span>
                  </button>
                </div>
              </div>

              {/* Posts list */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12 text-neutral-500">
                    Loading posts...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    No posts yet.
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm w-full lg:max-w-[500px] xl:max-w-xl"
                    >
                      <div className="p-4 sm:p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (currentUser?.id === post.user_id) {
                                  onNavigate("/profile");
                                  return;
                                }
                              
                                const role = post.profiles?.role?.toLowerCase();
                                onNavigate(`/${role}/${post.user_id}`);
                              }}
                              className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0 overflow-hidden"
                            >
                              {post.profiles?.profile_image ? (
                                <ImageWithFallback
                                  src={post.profiles.profile_image}
                                  alt={post.profiles.full_name || "User"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center">
                                  <span className="text-amber-400">
                                    {(post.profiles?.full_name || "U").charAt(0)}
                                  </span>
                                </div>
                              )}
                            </button>
                            <div>
                              <div className="text-neutral-900 font-medium">
                                {post.profiles?.full_name || "Unknown"}
                              </div>
                              <div className="text-neutral-600 text-sm">
                                {post.profiles?.role || "Member"} •{" "}
                                {post.created_at
                                  ? new Date(post.created_at).toLocaleString()
                                  : ""}
                              </div>
                            </div>
                          </div>
                          <div>
                            {/* Three dots button */}
                            <div className="flex items-center gap-3">
                              <button
                                className="text-neutral-400 hover:text-neutral-600"
                                onClick={() => handleMoreClick(post.id)} // Pass post.id here
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Conditional rendering for Delete button */}
                            {currentUser?.id === post.user_id &&
                              activeDeletePostId === post.id && (
                                <div className="p-4 border-t border-neutral-100 flex justify-end">
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-xs text-red-600"
                                  >
                                    Delete post
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                        <p className="text-neutral-700">{post.content}</p>
                      </div>

                      {post.media_urls && post.media_urls.length > 0 && (
                          <MediaCarousel urls={post.media_urls} />
                      )}


                      <div className="p-4 sm:p-6 pt-4">
                        <div className="flex items-center justify-between mb-4 text-neutral-600 text-sm">
                          <span>
                            {(likeCountMap[post.id] || 0).toLocaleString()} likes
                          </span>
                          <div className="flex items-center gap-4">
                            <span>
                              {commentCountMap[post.id] ||
                                (post.post_comments
                                  ? post.post_comments.length
                                  : 0)}{" "}
                              comments
                            </span>
                            <span>0 shares</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 px-6">
                          <button
                            onClick={() => handleLikeToggle(post.id)}
                            disabled={!!actionLoading[post.id]}
                            className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                likedMap[post.id] ? "text-amber-500" : ""
                              }`}
                            />
                            <span className="text-sm">
                              {likedMap[post.id] ? "Unlike" : "Like"}
                            </span>
                          </button>
                          <button
                            onClick={async () => {
                              // open comments modal
                              setCommentingPost(post);
                            }}
                            className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">Comment</span>
                          </button>
                          <button
                            onClick={() => handleShare(post.id)}
                            className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition"
                          >
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm">Share</span>
                          </button>
                          <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition">
                            <Bookmark className="w-5 h-5" />
                            <span className="text-sm">Save</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-neutral-900 mb-4">Trending</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-neutral-600 text-xs mb-1">
                        Fashion Events
                      </div>
                      <div className="text-neutral-900 text-sm">
                        Paris Fashion Week 2025
                      </div>
                      <div className="text-neutral-500 text-xs">2.4K posts</div>
                    </div>
                    <div>
                      <div className="text-neutral-600 text-xs mb-1">
                        Industry News
                      </div>
                      <div className="text-neutral-900 text-sm">
                        Sustainable Fashion Movement
                      </div>
                      <div className="text-neutral-500 text-xs">1.8K posts</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-neutral-900 mb-4">People to Follow</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-neutral-900 truncate text-sm">
                            Model Name
                          </div>
                          <div className="text-neutral-600 text-xs">
                            Paris, France
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 text-xs">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
      {/* Create post modal */}
        {showCreate && (
          <CreatePostModal
            onClose={() => setShowCreate(false)}
            onCreate={createPost}
            loading={!!actionLoading.create}
          />
        )}

        {/* Comment modal */}
        {commentingPost && (
          <CommentModal
            post={commentingPost}
            onClose={() => setCommentingPost(null)}
            fetchComments={fetchCommentsForPost}
            onAddComment={addComment}
          />
        )}
    </div>
    </>
  );
}

/* --------------------- ProfileCard --------------------- */
function ProfileCard({
  currentUser,
  onNavigate,
}: {
  currentUser: any;
  onNavigate: (p: string) => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setProfile(null);
        setConnectionCount(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles_view")
        .select("id, full_name, profile_image, role, location, connections")
        .eq("id", currentUser.id)
        .single();
      if (error) {
        console.warn("ProfileCard fetch error:", error);
        return;
      } else{
      setProfile(data);
      }
      try {
        const count = await getConnectionCount(currentUser.id);
        setConnectionCount(count);
      } catch (err) {
        console.error("Error getting connection count:", err);
        // Fallback to legacy column if RPC fails
        if (data?.connections != null) {
          setConnectionCount(data.connections);
        }
      }
    })();
  }, [currentUser]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-br from-neutral-200 to-neutral-300"></div>
      <div className="px-6 pb-6">
        <div className="relative -mt-10 mb-4">
          <div className="w-20 h-20 bg-neutral-200 rounded-full border-4 border-white overflow-hidden">
            {profile?.profile_image ? (
              <ImageWithFallback
                src={profile.profile_image}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
        <h3 className="text-neutral-900 mb-1">
          {profile?.full_name || "Your Profile"}
        </h3>
        <p className="text-neutral-600 text-sm mb-4">
          {profile?.role || "Model"} • {profile?.location || "Unknown"}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Profile views</span>
            <span className="text-amber-600">234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Connections</span>
            <span className="text-amber-600">{profile?.connections}</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          className="w-full mt-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition text-sm flex justify-center items-center"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

/* --------------------- CreatePostModal --------------------- */
// Helper interface for our unified state
interface MediaItem {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

function CreatePostModal({
  onClose,
  onCreate,
  loading,
}: {
  onClose: () => void;
  onCreate: (payload: { text?: string; files?: File[] }) => Promise<void>;
  loading?: boolean;
}) {
  const [text, setText] = useState("");
  
  // 1. UNIFIED STATE: Keeps file and preview together for easier reordering
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  
  // 2. DRAG STATE: Tracks which item is being dragged
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ESC-to-close functionality
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Cleanup URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      mediaFiles.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, []);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map(file => ({
      id: crypto.randomUUID(), // Unique ID for React keys
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image' as const
    }));

    setMediaFiles((prev) => [...prev, ...newFiles]);
    
    // Reset input
    if (fileRef.current) fileRef.current.value = '';
  }

  function removeMedia(idToDelete: string) {
    setMediaFiles((prev) => {
      const itemToDelete = prev.find(item => item.id === idToDelete);
      if (itemToDelete) URL.revokeObjectURL(itemToDelete.url); // Cleanup
      return prev.filter((item) => item.id !== idToDelete);
    });
  }

  // --- DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    // This tells the browser we are moving an element
    e.dataTransfer.effectAllowed = "move";
    // Optional: hide the ghost image or style it
    // e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedIndex === null || draggedIndex === index) return;

    // Reorder logic
    const newItems = [...mediaFiles];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1); // Remove from old spot
    newItems.splice(index, 0, draggedItem); // Insert at new spot

    setMediaFiles(newItems);
    setDraggedIndex(index); // Update index to follow the item
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    // Extract just the files to send back to parent
    const filesOnly = mediaFiles.map(m => m.file);
    onCreate({ text: text.trim() || undefined, files: filesOnly });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto z-50" style={{ pointerEvents: "auto" }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg animate-scaleIn">
        <div className="bg-white rounded-2xl p-6 w-full max-w-xl h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-lg">Create Post</h3>
            <button onClick={onClose} className="text-neutral-600">✕</button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share something..."
            className="w-full h-32 p-3 border border-neutral-200 rounded-lg mb-4 resize-none flex-shrink-0"
          ></textarea>

          {/* File Input */}
          <div className="flex items-center gap-4 mb-4 flex-shrink-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                ref={fileRef}
                onChange={handleFiles}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
              />
              <ImageIcon className="w-5 h-5 text-neutral-600" />
              <span className="text-sm text-neutral-600">Photo / Video</span>
            </label>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
            >
              Choose files
            </button>
            <div className="text-sm text-neutral-500 ml-auto">
              {mediaFiles.length} selected
            </div>
          </div>

          {/* MEDIA PREVIEW SECTION (Updated with Drag & Drop) */}
{mediaFiles.length > 0 && (
  <div className="px-1 pb-2 mt-4 flex-1 overflow-y-auto">
    {/* Optional Hint */}
    {mediaFiles.length > 1 && (
      <p className="text-xs text-neutral-400 mb-2">Drag items to reorder</p>
    )}
    
    {/* Scrollable container for the media grid */}
    <div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mediaFiles.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              relative group w-full h-32 rounded-lg overflow-hidden border bg-neutral-100 cursor-move transition-all
              ${draggedIndex === index ? 'opacity-50 scale-95 ring-2 ring-blue-500' : 'opacity-100'}
            `}
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start when clicking remove
                removeMedia(item.id);
              }}
              className="absolute top-1 right-1 z-20 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>

            {item.type === 'video' ? (
              <video
                src={item.url}
                className="w-full h-full object-cover pointer-events-none" // prevent video controls from blocking drag
              />
            ) : (
              <img
                src={item.url}
                className="w-full h-full object-cover pointer-events-none" // prevent default img drag behavior
                alt="preview"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}


          <div className="flex items-center gap-3 mt-4 flex-shrink-0">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-neutral-900 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <button onClick={onClose} className="px-4 py-3 border rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

/* --------------------- CommentModal --------------------- */
function CommentModal({
  post,
  onClose,
  fetchComments,
  onAddComment,
}: {
  post: PostRow;
  onClose: () => void;
  fetchComments: (postId: string) => Promise<any[]>;
  onAddComment: (postId: string, content: string) => Promise<any>;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const c = await fetchComments(post.id);
      setComments(c || []);
      setLoading(false);
    })();
  }, [post, fetchComments]);

  async function handleAdd() {
    if (!text.trim()) return;
    const newComment = await onAddComment(post.id, text.trim());
    if (newComment) {
      setComments((s) => [...s, newComment]);
      setText("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Comments</h3>
            <button onClick={onClose} className="text-neutral-600">
              ✕
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto divide-y divide-neutral-100">
            {loading ? (
              <div className="py-8 text-center text-neutral-500">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">
                No comments yet — be the first.
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-4 flex gap-4">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex-shrink-0 overflow-hidden">
                    {c.profiles?.profile_image ? (
                      <ImageWithFallback
                        src={c.profiles.profile_image}
                        alt={c.profiles.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {c.profiles?.full_name || "User"}
                    </div>
                    <div className="text-sm text-neutral-700">{c.content}</div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-3 bg-neutral-900 text-white rounded-lg"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
