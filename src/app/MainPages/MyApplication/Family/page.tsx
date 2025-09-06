"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";

import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";

import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/contants";

// ---------- helpers ----------
const SECTION_KEY = "family" as const;
const storageKey = "pcas:application:family";

type Values = {
  fatherName: string;
  motherName: string;
  fatherOccupation: "govt" | "non-govt" | "";
};

const DEFAULTS: Values = {
  fatherName: "",
  motherName: "",
  fatherOccupation: "",
};

const asStringMap = (fd: FormData) =>
  Object.fromEntries(
    Array.from(fd.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""])
  ) as Record<string, string>;

function SectionAnchor({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="anchor-target">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
    </section>
  );
}

export default function FamilyPage() {
  const sectionLabel = SECTION_LABEL[SECTION_KEY];
  const subsections = SUBSECTIONS[SECTION_KEY];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [values, setValues] = useState<Values>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "complete">("not_started");
  const [renderKey, setRenderKey] = useState(0);

  // load persisted
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

  // SubPanel completion (fill dots)
  const completed = useMemo(() => {
    const done = new Set<string>();
    const v = values;
    if (!!v.fatherName.trim() && !!v.motherName.trim() && !!v.fatherOccupation)
      done.add(slug("Parents/Guardians"));
    return done;
  }, [values]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const payload = asStringMap(fd);

      const next: Values = { ...values, ...payload } as Values;
      setValues(next);

      const meetsRequired =
        !!next.fatherName.trim() && !!next.motherName.trim() && !!next.fatherOccupation;

      const nextStatus: typeof status = meetsRequired ? "in_progress" : "not_started";
      setStatus(nextStatus);

      const now = new Date();
      setSavedAt(now);
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ values: next, status: nextStatus, savedAt: now.toISOString() })
        );
      } catch {}
      setRenderKey((k) => k + 1);
    },
    [values, status]
  );

  return (
    <main className="center-wrap with-mandala with-minar" role="main">
      <div className="dashboard-grid app-grid with-subpanel">
        <LeftRail />
        <SubPanel sectionLabel={sectionLabel} subsections={subsections} completed={completed} />

        {/* Center editor (layout unchanged) */}
        <section className="center-rail app-center">
          <section className="main-card editor-card thin-scrollbars">
            <div className="breadcrumb mb-2">
              My Common Application <span className="mx-1">|</span> {sectionLabel}
            </div>

            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-3 mb-3 border-b border-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight">{sectionLabel}</h1>
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-3">
                    <span className="status-dot" />
                    {status === "in_progress" ? "In progress" : status === "complete" ? "Complete" : "Not started"}
                    <span suppressHydrationWarning>
                      {mounted && savedAt ? `· Saved ${savedAt.toLocaleTimeString()}` : null}
                    </span>
                  </div>
                </div>
                <Link href="#" className="outline-button shrink-0">Preview</Link>
              </div>
            </div>

            {/* FORM */}
            <form key={mounted ? renderKey : "ssr"} className="space-y-7" onSubmit={onSubmit}>
              <SectionAnchor id={slug("Parents/Guardians")} title="Parents / Guardians" />
              <TextField name="fatherName" label="Father's Name *" required value={values.fatherName} />
              <TextField name="motherName" label="Mother's Name *" required value={values.motherName} />
              <SelectField
                name="fatherOccupation"
                label="Father's Occupation *"
                value={values.fatherOccupation}
                options={[
                  { value: "", label: "- Choose an option -" },
                  { value: "govt", label: "Govt" },
                  { value: "non-govt", label: "Non-govt" },
                ]}
              />

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
