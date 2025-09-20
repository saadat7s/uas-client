"use client";
import { useEffect } from "react";

export default function SavePopup({
  open,
  onClose,
  title = "Information saved successfully!",
  description = "Your changes have been stored.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 2200); // auto-close after 2.2s
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
      <div
        className="main-card p-6 rounded-[var(--radius-lg)] shadow-lg transform transition-all scale-95 animate-popIn text-center"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <h3 className="text-lg font-semibold text-[var(--pakistan-green)]">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <button
          onClick={onClose}
          className="mt-4 normal-button w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}
