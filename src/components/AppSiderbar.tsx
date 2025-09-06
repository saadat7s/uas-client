"use client";

import { useState, useMemo } from "react";



type SectionKey =
  | "profile" | "family" | "education" | "testing" | "activities" | "writing" | "coursesGrades";

const SECTIONS: Record<SectionKey, { label: string; items: string[] }> = {
  profile: { label: "Profile", items: [
    "Personal Information","Address","Contact Details","Demographics",
    "Language","Geography and Nationality","Common App Fee Waiver",
  ]},
  family: { label: "Family", items: ["Parents/Guardians","Siblings","Family Income"] },
  education: { label: "Education", items: ["High School","Colleges & Universities","Grades","Class Rank"] },
  testing: { label: "Testing", items: ["SAT/ACT Scores","AP Scores","Other Tests"] },
  activities: { label: "Activities", items: ["Extracurricular Activities","Work Experience","Volunteer Work"] },
  writing: { label: "Writing", items: ["Personal Essay","Additional Information"] },
  coursesGrades: { label: "Courses & Grades", items: ["Courses & Grades"] },
};

function slug(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }


export default function AppSidebar({
  onPickSubsection,
}: { onPickSubsection?: (section: SectionKey, item: string) => void }) {
  const [active, setActive] = useState<SectionKey>("profile");
  const panelTitle = useMemo(() => SECTIONS[active].label, [active]);

  

  return (
    <>
      {/* GRID ITEM 1: left sidebar */}
      <aside className="app-left">
        <div className="app-sidebar-container">
          <div className="sidebar-content">
            <div className="p-4 border-b border-black/10 flex items-center gap-3">
              <div className="sidebar-user-avatar" style={{ width: 32, height: 32 }}>C</div>
              <div className="leading-tight">
                <div className="font-semibold">common</div>
                <div className="font-semibold -mt-1">app</div>
              </div>
            </div>

            <div className="sidebar-content-inner p-2">
              {/* primary */}
              <button className="sidebar-section-button mb-2">
                <span className="sidebar-dot" /><span>Dashboard</span>
              </button>
              <button className="sidebar-section-button active mb-2">
                <span className="sidebar-dot" />
                <span className="text-left">
                  <div>My Common</div><div>Application</div>
                </span>
              </button>

              {/* sections */}
              <div className="sidebar-sections">
                {(Object.keys(SECTIONS) as SectionKey[]).map(key => {
                  const isActive = key === active;
                  return (
                    <button
                      key={key}
                      className={`sidebar-section-button ${isActive ? "active" : ""} mb-2`}
                      onClick={() => setActive(key)}
                    >
                      <span className="sidebar-chevron">›</span>
                      <span className="sidebar-dot" />
                      <span>{SECTIONS[key].label}</span>
                    </button>
                  );
                })}
              </div>

              {/* secondary */}
              <div className="sidebar-footer">
                <button className="sidebar-section-button"><span>🎓</span><span>Colleges</span></button>
                <button className="sidebar-section-button"><span>🔎</span><span>Search</span></button>
                <button className="sidebar-section-button"><span>✉️</span><span>Messages</span></button>
                <button className="sidebar-section-button"><span>💵</span><span>Payment</span></button>

                <div className="sidebar-user-card">
                  <div className="sidebar-user-avatar">RY</div>
                  <div>
                    <div className="font-medium leading-tight">Raja Yaseen</div>
                    <div className="text-xs text-gray-500">CAID 47247138</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* GRID ITEM 2: right sub-panel */}
      <aside className="app-left-panel">
        <div className="sidebar-panel is-open">
          <div className="sidebar-panel-header">
            <div className="flex items-center gap-2">
              <span className="sidebar-dot" />
              <span className="capitalize">{panelTitle}</span>
            </div>
            {/* optional close: keep visible for now */}
            <button className="sidebar-panel-close" aria-label="Close">‹</button>
          </div>

          <div className="sidebar-panel-content thin-scrollbars">
            {SECTIONS[active].items.map(item => (
              <button
                key={item}
                className="sidebar-panel-item"
                onClick={() => onPickSubsection?.(active, item)}
                data-subsection={slug(item)}
              >
                <span className="sidebar-dot" /><span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
