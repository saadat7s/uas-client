"use client";
import { useDispatch, useSelector } from "react-redux";
import { selectPicks, selectCatalog, removePick, setField, toggleRankedProgram, moveRank } from "@/app/redux/slices/universitiesSlice";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import LeftRail from "@/components/bars/LeftRail";
import RightRail from "@/components/bars/RightRail";

export default function MyUniversitiesPage() {
  const picks = useSelector(selectPicks);
  const catalog = useSelector(selectCatalog);
  const dispatch = useDispatch();

  return (
    <main className="center-wrap with-mandala">
      <div className="dashboard-grid">
        <LeftRail />
        <section className="center-rail">
          <div className="main-card main-card-lg" style={{ margin: 0 }}>
            <header className="mb-4">
              <h2 className="title-primary text-left">My Universities</h2>
              <p className="text-gray-700 mt-1 text-sm">
                Pick your <strong>field of study</strong> for each university and then select / rank the programs (1st, 2nd, …).
              </p>
            </header>

          <div className="mt-4 grid gap-4">
            {picks.length === 0 && (
              <div className="text-gray-600">No universities added yet. Go to <a className="link-primary" href="/universities/search">Search</a> to pick up to 5.</div>
            )}

            {picks.map(p => {
              const u = catalog[p.uniId];
              const fields = Object.keys(u?.programsByField ?? {});
              const programs = p.fieldOfStudy ? (u?.programsByField[p.fieldOfStudy] ?? []) : [];
              return (
                <article key={p.uniId} className="rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{u?.established ? `Est. ${u.established}` : ""}</div>
                        <h3 className="text-lg font-semibold text-emerald-900">{u?.name}</h3>
                        <div className="text-gray-600 text-sm">{u?.city}, {u?.province}</div>
                        {(u?.applicationFeePKR || u?.deadlineISO) && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-700">
                            {u?.applicationFeePKR && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border text-emerald-800">
                                Fee: {Math.round((u.applicationFeePKR)/1000)}k PKR
                              </span>
                            )}
                            {u?.deadlineISO && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border text-orange-800">
                                Deadline: {new Date(u.deadlineISO).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button className="help-btn" onClick={() => dispatch(removePick({ uniId: p.uniId }))} aria-label="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Field of study */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-emerald-900 mb-1">Field of study</label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={p.fieldOfStudy ?? ""}
                        onChange={e => dispatch(setField({ uniId: p.uniId, field: e.target.value }))}
                      >
                        <option value="" disabled>Select a field…</option>
                        {fields.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    {/* Programs chooser */}
                    {p.fieldOfStudy && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-emerald-900 mb-1">Select & rank programs</label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {programs.map(pr => {
                            const selected = p.rankedProgramIds.includes(pr.id);
                            const rankIndex = p.rankedProgramIds.indexOf(pr.id);
                          return (
                              <div
                                key={pr.id}
                                role="button"
                                tabIndex={0}
                                className={`text-left border rounded-xl px-3 py-2 cursor-pointer ${selected ? "bg-mint-100 border-emerald-400" : ""}`}
                                onClick={() => dispatch(toggleRankedProgram({ uniId: p.uniId, programId: pr.id }))}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch(toggleRankedProgram({ uniId: p.uniId, programId: pr.id })); } }}
                              >
                                <div className="font-medium">{pr.name}</div>
                                <div className="text-xs text-gray-600 mt-0.5">Avg semester: {Math.round(pr.avgSemesterFeePKR/1000)}k PKR</div>
                                {selected && (
                                  <div className="flex items-center gap-2 mt-2 text-xs">
                                    <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-600 text-white">#{rankIndex + 1}</span>
                                    <button
                                      className="help-btn"
                                      onClick={(e) => { e.stopPropagation(); if (rankIndex > 0) dispatch(moveRank({ uniId: p.uniId, from: rankIndex, to: rankIndex - 1 })); }}
                                    ><ChevronUp className="w-4 h-4" /></button>
                                    <button
                                      className="help-btn"
                                      onClick={(e) => { e.stopPropagation(); if (rankIndex < p.rankedProgramIds.length - 1) dispatch(moveRank({ uniId: p.uniId, from: rankIndex, to: rankIndex + 1 })); }}
                                    ><ChevronDown className="w-4 h-4" /></button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Tap to select/deselect. Use arrows to change ranking.</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

            {/* CTA row */}
            <div className="mt-6 flex justify-end">
              <a href="/checkout" className="normal-button">Send Application</a>
            </div>
          </div>
        </section>
        <RightRail />
      </div>
    </main>
  );
}
