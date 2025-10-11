"use client";
import type { University } from "@/lib/uni-types";
import { X, Phone, Mail, Globe, Star, Users, MapPin, Calendar } from "lucide-react";

export default function UniversityDetailModal({
  uni, onClose, onAdd,
}: { uni: University; onClose: () => void; onAdd: () => void; }) {
  if (!uni) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 relative">
          <button 
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          {uni.estBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {uni.estBadge}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-white mb-2 pr-10">{uni.name}</h2>
          
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{uni.city}, {uni.province}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          {uni.blurb && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">About</h3>
              <p className="text-gray-700 leading-relaxed">{uni.blurb}</p>
            </div>
          )}

          {/* University Details Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Contact & Information</h3>
            
            <div className="grid gap-3">
              {uni.phone && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Phone</div>
                    <div className="text-sm text-gray-900">{uni.phone}</div>
                  </div>
                </div>
              )}
              
              {uni.email && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Email</div>
                    <a href={`mailto:${uni.email}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all">
                      {uni.email}
                    </a>
                  </div>
                </div>
              )}
              
              {uni.website && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Website</div>
                    <a 
                      href={uni.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                    >
                      Visit official website
                    </a>
                  </div>
                </div>
              )}
              
              {uni.rating && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Rating</div>
                    <div className="text-sm font-semibold text-gray-900">{uni.rating.toFixed(1)} / 5.0</div>
                  </div>
                </div>
              )}
              
              {uni.studentsLabel && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-0.5">Student Body</div>
                    <div className="text-sm text-gray-900">{uni.studentsLabel}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
            onClick={onAdd}
          >
            Add to My Universities
          </button>
        </div>
      </div>
    </div>
  );
}