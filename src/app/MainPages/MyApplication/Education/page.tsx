"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";
import TextField from "@/components/form/TextField";
import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/contants";

const SECTION_KEY = "education" as const;
const storageKey = "pcas:application:education";

type Values = {
  matricGrades: string;
  matricPicName: string;
  fscGrades: string;
  fscPicName: string;
  collegeName: string;
};

const DEFAULTS: Values = {
  matricGrades: "",
  matricPicName: "",
  fscGrades: "",
  fscPicName: "",
  collegeName: "",
};

const asStringMap = (fd: FormData) =>
  Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""])) as Record<string, string>;

function SectionAnchor({ id, title }: { id: string; title: string }) {
  return (<section id={id} className="anchor-target"><h2 className="text-lg font-semibold mb-3">{title}</h2></section>);
}

export default function EducationPage() {
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
    setRenderKey((k) => k + 1);
  }, []);

  const completed = useMemo(() => {
    const d = new Set<string>();
    if (!!values.matricGrades.trim() && !!values.matricPicName) d.add(slug("Matric (O-level Equivalence)"));
    if (!!values.fscGrades.trim() && !!values.fscPicName) d.add(slug("FSC (A-level Equivalence)"));
    if (!!values.collegeName.trim()) d.add(slug("College"));
    return d;
  }, [values]);

  const onFile = (name: "matricPicName" | "fscPicName") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return; setValues(p => ({ ...p, [name]: f.name }));
  };

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = asStringMap(fd);
    const next: Values = { ...values, ...payload };
    setValues(next);

    const meets =
      !!next.matricGrades.trim() && !!next.matricPicName &&
      !!next.fscGrades.trim() && !!next.fscPicName &&
      !!next.collegeName.trim();

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
              <SectionAnchor id={slug("Matric (O-level Equivalence)")} title="Matric (O-level Equivalence)" />
              <TextField name="matricGrades" label="Matric grades (equivalence) *" required value={values.matricGrades} />
              <label className="text-sm font-semibold block mb-1">Matric picture *</label>
              <input type="file" name="matricPic" className="w-full rounded-xl border px-3 py-2" onChange={onFile("matricPicName")} />
              <input type="hidden" name="matricPicName" value={values.matricPicName} />
              {values.matricPicName && <p className="text-xs text-gray-500 mt-1">{values.matricPicName}</p>}

              <SectionAnchor id={slug("FSC (A-level Equivalence)")} title="FSC (A-level Equivalence)" />
              <TextField name="fscGrades" label="FSC grades (equivalence) *" required value={values.fscGrades} />
              <label className="text-sm font-semibold block mb-1">FSC picture *</label>
              <input type="file" name="fscPic" className="w-full rounded-xl border px-3 py-2" onChange={onFile("fscPicName")} />
              <input type="hidden" name="fscPicName" value={values.fscPicName} />
              {values.fscPicName && <p className="text-xs text-gray-500 mt-1">{values.fscPicName}</p>}

              <SectionAnchor id={slug("College")} title="College" />
              <TextField name="collegeName" label="College name *" required value={values.collegeName} />

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
