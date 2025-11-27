import { useState } from "react";
import { createPost } from "../lib/postService";
import { X, Image, Play } from "lucide-react";

export function CreatePost({ onClose, onCreated }: any) {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMediaUpload = (e: any) => {
    setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    setLoading(true);

    try {
      await createPost(content, mediaFiles);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-6 h-6 text-neutral-600" />
        </button>

        <h2 className="text-xl text-neutral-900 mb-4">Create Post</h2>

        <textarea
          className="w-full border border-neutral-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-amber-500"
          placeholder="Share something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Media Review */}
        {mediaFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {mediaFiles.map((file, idx) => (
              <div
                key={idx}
                className="w-full h-24 bg-neutral-200 rounded-lg flex items-center justify-center text-xs text-neutral-600"
              >
                {file.type.startsWith("image") ? "📷 Image" : "🎥 Video"}
              </div>
            ))}
          </div>
        )}

        {/* Media Upload */}
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
            <Image className="w-5 h-5" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleMediaUpload}
            />
          </label>

          <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
            <Play className="w-5 h-5" />
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleMediaUpload}
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
