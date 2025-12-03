// src/components/ApplyModal.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";
import { applyToJob } from "../lib/jobsService";
import { supabase } from "../lib/supabaseClient";

export default function ApplyModal({
  jobId,
  onClose,
  onApplied,
}: {
  jobId: string;
  onClose: () => void;
  onApplied: () => void;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleApply = async () => {
    try {
      setErr(null);
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setErr("You must be logged in to apply.");
        setLoading(false);
        return;
      }

      await applyToJob(jobId, user.id, note || null);
      onApplied();
      onClose();
    } catch (e: any) {
      console.error("apply error", e);
      setErr(e.message || "Failed to apply.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center"style={{ pointerEvents: "auto" }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium mb-2">Apply to this job</h3>
        <p className="text-sm text-neutral-600 mb-3">
          Add a short note (optional). Your profile will also be sent to the designer.
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a short note (why you're a great fit)..."
          className="w-full border border-neutral-200 rounded-lg p-3 mb-3 h-28 resize-none"
        />

        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Application"}
          </button>

          <button onClick={onClose} className="px-4 py-3 border rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
}
