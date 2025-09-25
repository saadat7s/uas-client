"use client";
import type { University } from "@/lib/uni-types";
import { X } from "lucide-react";

export default function UniversityDetailModal({
  uni, onClose, onAdd,
}: { uni: University; onClose: () => void; onAdd: () => void; }) {
  if (!uni) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border p-6 relative">
        <button className="absolute top-3 right-3 help-btn" onClick={onClose} aria-label="Close">
          <X className="w-4 h-4" />
        </button>
        <div className="mb-2 text-xs text-gray-500">{uni.estBadge ?? ""}</div>
        <h3 className="text-xl font-semibold text-emerald-900">{uni.name}</h3>
        <div className="text-gray-600">{uni.city}, {uni.province}</div>
        <p className="mt-3 text-gray-700">{uni.blurb}</p>
        <ul className="mt-4 text-sm text-gray-700 space-y-1">
          {uni.phone && <li>📞 {uni.phone}</li>}
          {uni.email && <li>✉️ {uni.email}</li>}
          {uni.website && <li>🌐 <a className="link-primary" href={uni.website} target="_blank">Visit website</a></li>}
          {uni.rating && <li>⭐ {uni.rating.toFixed(1)}</li>}
          {uni.studentsLabel && <li>👥 {uni.studentsLabel}</li>}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button className="outline-button" onClick={onClose}>Close</button>
          <button className="normal-button" onClick={onAdd}>Add to My Universities</button>
        </div>
      </div>
    </div>
  );
}
