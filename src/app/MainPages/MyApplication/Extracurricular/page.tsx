"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";
import TextField from "@/components/form/TextField";
import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/contants";

const SECTION_KEY = "extracurricular" as const;
const storageKey = "pcas:application:extracurricular";

type Values = { clubs: string; certDocName: string; };
const DEFAULTS: Values = { clubs: "Debate, Football, Rugby", certDocName: "" };

const asStringMap = (fd: FormData) =>
  Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""])) as Record<string, string>;

function SectionAnchor({ id, title }: { id: string; title: string }) {
  return (<section id={id} className="anchor-target"><h2 className="text-lg font-semibold mb-3">{title}</h2></section>);
}

export default function ExtracurricularPage() {
  const sectionLabel = SECTION_LABEL[SECTION_KEY];
  const subsections = SUBSECTIONS[SECTION_KEY];

  const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);
  const [values, setValues] = useState<Values>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "complete">("not_started");
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { values: Values; status?: string; savedAt?: string };
        setValues({ ...DEFAULTS, ...parsed.values });
        setStatus((parsed.status as any) ?? "in_progress");
        setSavedAt(parsed.savedAt ? new Date(parsed.savedAt) : null);
      }
    } catch {}
    setRenderKey(k => k + 1);
  }, []);

  const completed = useMemo(() => {
    const d = new Set<string>();
    if (!!values.clubs.trim()) d.add(slug("Clubs"));
    if (!!values.certDocName.trim()) d.add(slug("Certificates"));
    return d;
  }, [values]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setValues(p => ({ ...p, certDocName: f.name }));
  };

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = asStringMap(fd);
    const next: Values = { ...values, ...payload };
    setValues(next);

    const meets = !!next.clubs.trim();
    const nextStatus = meets ? "in_progress" : "not_started";
    setStatus(nextStatus);

    const now = new Date(); setSavedAt(now);
    try { localStorage.setItem(storageKey, JSON.stringify({ values: next, status: nextStatus, savedAt: now.toISOString() })); } catch {}
    setRenderKey(k => k + 1);
  }, [values, status]);

  return (
    <main className="center-wrap with-mandala with-minar" role="main">
      <div className="dashboard-grid app-grid with-subpanel">
        <LeftRail />
        <SubPanel sectionLabel={sectionLabel} subsections={subsections} completed={completed} />
        <section className="center-rail app-center">
          <section className="main-card editor-card thin-scrollbars">
            <div className="breadcrumb mb-2">My Common Application <span className="mx-1">|</span> {sectionLabel}</div>
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-3 mb-3 border-b border-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight">{sectionLabel}</h1>
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-3">
                    <span className="status-dot" />
                    {status === "in_progress" ? "In progress" : status === "complete" ? "Complete" : "Not started"}
                    <span suppressHydrationWarning>{mounted && savedAt ? `· Saved ${savedAt.toLocaleTimeString()}` : null}</span>
                  </div>
                </div>
                <Link href="#" className="outline-button shrink-0">Preview</Link>
              </div>
            </div>

            <form key={mounted ? renderKey : "ssr"} className="space-y-7" onSubmit={onSubmit}>
              <SectionAnchor id={slug("Clubs")} title="Clubs *" />
              <TextField name="clubs" label="List your clubs" required value={values.clubs} />
              <SectionAnchor id={slug("Certificates")} title="Certificates (relevant docs)" />
              <label className="text-sm font-semibold block mb-1">Upload (optional)</label>
              <input type="file" name="certDoc" className="w-full rounded-xl border px-3 py-2" onChange={onFile} />
              <input type="hidden" name="certDocName" value={values.certDocName} />
              {values.certDocName && <p className="text-xs text-gray-500 mt-1">{values.certDocName}</p>}
              <div className="pt-3 pb-2">
                <div className="flex gap-3">
                  <button type="submit" className="normal-button">Save</button>
                  <button type="submit" name="submitAndContinue" value="1" className="outline-button">Save & Continue</button>
                </div>
              </div>
            </form>
          </section>
        </section>
        <RightRail />
      </div>
    </main>
  );
}
