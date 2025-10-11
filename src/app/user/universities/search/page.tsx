"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPick, cacheResults, selectPicks, selectCatalog } from "@/app/redux/slices/universitiesSlice";
import type { University } from "@/lib/uni-types";
import UniversityDetailModal from "@/components/UniversityDetailModal";
import { Info } from "lucide-react";
import LeftRail from "@/components/bars/LeftRail";
import RightRail from "@/components/bars/RightRail";

// Example mock data (use now; replace with API later)
const SEED_UNIS: University[] = [
  {
    id: "uok",
    name: "University of Karachi",
    city: "Karachi",
    province: "Sindh",
    established: 1951,
    website: "https://uok.edu.pk",
    phone: "+92-21-99231581",
    email: "info@uok.edu.pk",
    rating: 4.8,
    studentsLabel: "32K+ students",
    badgeRank: "#1",
    estBadge: "Est. 1951",
    blurb: "The largest university in Pakistan, offering diverse academic programs with excellence in research and teaching.",
    applicationFeePKR: 3000,
    deadlineISO: new Date(new Date().getFullYear(), 10, 15).toISOString(),
    programsByField: {
      Engineering: [
        { id: "cs_bs", name: "BS Computer Science", avgSemesterFeePKR: 120000 },
        { id: "ee_bs", name: "BS Electrical Engineering", avgSemesterFeePKR: 145000 },
      ],
      Business: [
        { id: "bba", name: "BBA", avgSemesterFeePKR: 110000 },
        { id: "mba", name: "MBA", avgSemesterFeePKR: 150000 },
      ],
    },
  },
  {
    id: "pu",
    name: "University of the Punjab",
    city: "Lahore",
    province: "Punjab",
    established: 1882,
    website: "https://pu.edu.pk",
    rating: 4.7,
    studentsLabel: "40K+ students",
    badgeRank: "#2",
    estBadge: "Est. 1882",
    blurb: "One of the oldest and most prestigious universities in Pakistan with a broad spectrum of programs.",
    applicationFeePKR: 3500,
    deadlineISO: new Date(new Date().getFullYear(), 11, 5).toISOString(),
    programsByField: {
      Sciences: [
        { id: "chem_bs", name: "BS Chemistry", avgSemesterFeePKR: 100000 },
        { id: "phy_bs", name: "BS Physics", avgSemesterFeePKR: 105000 },
      ],
      Arts: [
        { id: "eng_ba", name: "BA English", avgSemesterFeePKR: 90000 },
      ],
    },
  },
];

export default function UniversitySearchPage() {
  const dispatch = useDispatch();
  const picks = useSelector(selectPicks);
  const catalog = useSelector(selectCatalog);
  const [active, setActive] = useState<null | string>(null); // uniId for modal

  // API-friendly: hydrate catalog once
  useEffect(() => {
    if (Object.keys(catalog).length === 0) {
      // For now, use mock data
      dispatch(cacheResults(SEED_UNIS));
      // When the API is ready, replace the line above with the one below:
      // fetch('/api/universities').then(r => r.json()).then((data: University[]) => dispatch(cacheResults(data)));
    }
  }, [catalog, dispatch]);

  const pickedIds = new Set(picks.map(p => p.uniId));
  const canAddMore = picks.length < 5;

  return (
    <main className="center-wrap with-mandala">
      <div className="dashboard-grid">
        <LeftRail />
        <section className="center-rail">
          <div className="main-card main-card-lg" style={{ margin: 0 }}>
            <header className="mb-4">
              <h2 className="title-primary text-left">University Search</h2>
              <p className="text-sm text-gray-700 mt-2 flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> You’ll pick specific programs under <em>My Universities</em>.
                  Those pages include full details plus the <strong>average semester price</strong> for each degree (e.g., <strong>1–1.5 lakh</strong>).
                </span>
              </p>
            </header>

            <ul className="grid sm:grid-cols-2 gap-3">
              {Object.values(catalog).map(u => (
                <li key={u.id} className="rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">{u.estBadge ?? ""}</div>
                        <div className="font-semibold text-[1.05rem] text-emerald-900 truncate">{u.name}</div>
                        <div className="text-gray-600 text-sm">{u.city}, {u.province}</div>
                      </div>
                      {u.badgeRank && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-800 border">{u.badgeRank}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">{u.blurb}</p>
                  </div>
                  <div className="px-4 pb-4 flex items-center justify-between gap-2">
                    <button className="outline-button" onClick={() => setActive(u.id)}>View details</button>
                    <button
                      className="normal-button"
                      disabled={pickedIds.has(u.id) || !canAddMore}
                      onClick={() => dispatch(addPick({ uniId: u.id }))}
                    >
                      {pickedIds.has(u.id) ? "Added" : "Add (max 5)"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <RightRail />
      </div>

      {/* Detail modal */}
      {active && <UniversityDetailModal uni={catalog[active]} onClose={() => setActive(null)} onAdd={() => {
        if (canAddMore) dispatch(addPick({ uniId: active }));
        setActive(null);
      }} />}
    </main>
  );
}
