import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    role: "model",
    location: "",
    height: "",
    measurements: "",
    hair: "",
    eyes: "",
    experience: "",
    languages: "",
    bio: "",
    instagram_followers: "",
    tiktok_followers: "",
    profile_image: "",
    cover_image: "",
  });
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch profile
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      setUser(user);

      if (!user) return setLoading(false);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          ...form,
          ...data,
        });
      }

      setLoading(false);
    })();
  }, []);

  // 💾 Save profile
  const handleSave = async () => {
    if (!user) return alert("No user found.");
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });

    setLoading(false);
    if (error) {
      console.error("Error saving profile:", error.message);
      alert("Error saving profile. Please try again.");
    } else {
      alert("Profile saved successfully!");
      onComplete();
    }
  };

  // 📤 Upload function
  const uploadImage = async (event: any, type: "profile" | "cover") => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file || !user) return;

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${type}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert(`Upload failed: ${uploadError.message}`);
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const imageUrl = publicData.publicUrl;

      await supabase
        .from("profiles")
        .update({
          [type === "profile" ? "profile_image" : "cover_image"]: imageUrl,
        })
        .eq("id", user.id);

      setForm({
        ...form,
        [type === "profile" ? "profile_image" : "cover_image"]: imageUrl,
      });

      alert(
        `${
          type === "profile" ? "Profile" : "Cover"
        } image uploaded successfully!`
      );
    } catch (error: any) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (type: "profile" | "cover") => {
    if (!user) return;
    const field = type === "profile" ? "profile_image" : "cover_image";

    try {
      // Optional: Delete from Supabase Storage (if desired)
      const filePath = `${user.id}/${type}.*`; // delete all versions (any ext)
      await supabase.storage
        .from("profile-images")
        .remove([`${user.id}/${type}.jpg`, `${user.id}/${type}.png`]);

      // Reset in Supabase table
      const { error } = await supabase
        .from("profiles")
        .update({ [field]: "" })
        .eq("id", user.id);

      if (error) throw error;

      // Reset locally in UI
      setForm({ ...form, [field]: "" });

      alert(
        `${
          type === "profile" ? "Profile" : "Cover"
        } image removed successfully.`
      );
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Failed to remove image. Try again.");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
        Edit Your Profile
      </h2>

      {/* 🖼️ Image Upload Section */}
      {/* 🖼️ Image Upload Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={
              form.profile_image ||
              "https://via.placeholder.com/120x120?text=Profile+Photo"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mb-3 border"
          />
          <div className="flex gap-2">
            <label className="cursor-pointer bg-amber-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-amber-600">
              {uploading ? "Uploading..." : "Upload Profile"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e, "profile")}
                disabled={uploading}
              />
            </label>

            {form.profile_image && (
              <button
                onClick={() => removeImage("profile")}
                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="flex flex-col items-center">
          <img
            src={
              form.cover_image ||
              "https://via.placeholder.com/300x100?text=Cover+Photo"
            }
            alt="Cover"
            className="w-full h-28 object-cover rounded-lg mb-3 border"
          />
          <div className="flex gap-2">
            <label className="cursor-pointer bg-amber-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-amber-600">
              {uploading ? "Uploading..." : "Upload Cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e, "cover")}
                disabled={uploading}
              />
            </label>

            {form.cover_image && (
              <button
                onClick={() => removeImage("cover")}
                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 💬 Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="model">Model</option>
            <option value="designer">Designer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="City, Country"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Experience
          </label>
          <input
            type="text"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="e.g., 3 Years"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">Height</label>
          <input
            type="text"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            placeholder="e.g., 5'10''"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Measurements
          </label>
          <input
            type="text"
            value={form.measurements}
            onChange={(e) => setForm({ ...form, measurements: e.target.value })}
            placeholder="e.g., 34-24-36"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Hair Color
          </label>
          <input
            type="text"
            value={form.hair}
            onChange={(e) => setForm({ ...form, hair: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Eye Color
          </label>
          <input
            type="text"
            value={form.eyes}
            onChange={(e) => setForm({ ...form, eyes: e.target.value })}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Languages
          </label>
          <input
            type="text"
            value={form.languages}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            placeholder="e.g., English, Hindi"
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Instagram Followers
          </label>
          <input
            type="number"
            value={form.instagram_followers}
            onChange={(e) =>
              setForm({ ...form, instagram_followers: e.target.value })
            }
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            TikTok Followers
          </label>
          <input
            type="number"
            value={form.tiktok_followers}
            onChange={(e) =>
              setForm({ ...form, tiktok_followers: e.target.value })
            }
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-neutral-700 mb-1">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-8 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition"
      >
        Save Profile
      </button>
    </div>
  );
}
