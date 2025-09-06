// components/application/SubPanel.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { slug } from "@/lib/contants";

export default function SubPanel({
  sectionLabel,
  subsections,
  completed,
}: {
  sectionLabel: string;
  subsections: string[];
  completed: Set<string>;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeSub, setActiveSub] = useState<string>(subsections[0] ?? "");

  useEffect(() => setMounted(true), []);
  useEffect(() => setActiveSub(subsections[0] ?? ""), [subsections]);

  // Scroll-spy: highlight the subsection as its anchor enters the viewport
  useEffect(() => {
    if (!mounted || subsections.length === 0) return;
    const ids = subsections.map(slug);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const idx = ids.indexOf(visible.target.id);
        if (idx >= 0) setActiveSub(subsections[idx]);
      },
      { root: null, rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [mounted, subsections]);

  const onPick = useCallback((label: string) => {
    setActiveSub(label);
    const id = slug(label);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-emerald-400", "rounded-xl");
      setTimeout(() => el.classList.remove("ring-2", "ring-emerald-400", "rounded-xl"), 900);
    }
  }, []);

  const items = useMemo(() => subsections.map((label) => {
    const isActive = activeSub === label;
    const isDone = completed.has(slug(label));
    return (
      <button
        key={label}
        className={`sidebar-panel-item ${isActive ? "active" : ""}`}
        onClick={() => onPick(label)}
        aria-current={isActive ? "page" : undefined}
      >
        <span className={`sidebar-dot${isDone ? " filled" : ""}`} />
        <span>{label}</span>
      </button>
    );
  }), [subsections, activeSub, completed, onPick]);

  return (
    <aside className="app-left-panel">{/* non-sticky by design */}
      <div className="sidebar-panel is-open">
        <div className="sidebar-panel-header">
          <div className="flex items-center gap-2">
            <span className="sidebar-dot" />
            <span className="capitalize">{sectionLabel}</span>
          </div>
        </div>

        <div className="sidebar-panel-content thin-scrollbars">
          {mounted && items}
        </div>
      </div>
    </aside>
  );
}
