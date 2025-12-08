// src/components/ApplicantsModal.tsx
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function ApplicantsModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[5000] bg-black/50 flex items-center justify-center p-4" style={{ pointerEvents: "auto" }}>
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        {/* Close Button */}
        <button
          className="rounded-full hover:bg-neutral-200"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
}
