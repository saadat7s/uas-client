// app/application/[section]/page.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";

import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioGroup from "@/components/form/RadioGroup";

import { SECTION_LABEL, SUBSECTIONS, slug, type SectionKey } from "@/lib/contants";

/** ---- TEST DATA (swap to API later) ---- */
const TEST_SECTION = {
  sectionKey: "profile" as SectionKey,
  sectionTitle: "Personal Information",
  status: "in_progress" as "in_progress" | "complete" | "not_started",
  values: {
    firstName: "Raja",
    middleName: "kabil",
    lastName: "Yaseen",
    suffix: "ii",
    street: "haishjdiaqjd12|3,4,55",
    email: "aahilumatiya64@gmail.com",
    hasPreferred: "no",
    citizen: "non-PK",
    primaryLang: "en",
  },
};
type FormValues = typeof TEST_SECTION.values;

export default function ApplicationSectionPage({ params }: { params: { section?: string } }) {
  const sectionKey = (params.section as SectionKey) ?? TEST_SECTION.sectionKey;
  const sectionLabel = SECTION_LABEL[sectionKey];
  const subsections = SUBSECTIONS[sectionKey];

  // hydration gate for client-only UI bits
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // state + localStorage persistence (TODO: swap to API)
  const storageKey = useMemo(() => `pcas:application:${sectionKey}`, [sectionKey]);
  const [values, setValues] = useState<FormValues>(TEST_SECTION.values);
  const [status, setStatus] = useState<"in_progress" | "complete" | "not_started">(TEST_SECTION.status);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { values: FormValues; status?: typeof status; savedAt?: string };
        setValues(parsed.values);
        if (parsed.status) setStatus(parsed.status);
        setSavedAt(parsed.savedAt ? new Date(parsed.savedAt) : null);
        setRenderKey((k) => k + 1);
      }
    } catch {}
  }, [storageKey]);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    const nextValues = { ...values, ...payload };
    setValues(nextValues);

    const isComplete = !!(nextValues.firstName?.trim() && nextValues.lastName?.trim());
    const nextStatus: typeof status = isComplete ? "in_progress" : "not_started";
    setStatus(nextStatus);

    const now = new Date();
    setSavedAt(now);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ values: nextValues, status: nextStatus, savedAt: now.toISOString() }));
    } catch {}
    setRenderKey((k) => k + 1);

    /** TODO(API):
     await fetch(`${API_BASE}/application/sections/${sectionKey}`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(nextValues),
     });
    */
  }, [sectionKey, storageKey, values, status]);

  // compute which subsections are "completed" to fill their dots
  const completed = useMemo(() => {
    const done = new Set<string>();
    const v = values;
    if (v.firstName?.trim() && v.lastName?.trim()) done.add(slug("Personal Information"));
    if (v.street?.trim()) done.add(slug("Address"));
    if (v.email?.trim()) done.add(slug("Contact Details"));
    if (v.citizen) done.add(slug("Demographics"));
    if (v.primaryLang) done.add(slug("Language"));
    return done;
  }, [values]);

  return (
    <main className="center-wrap with-mandala with-minar" role="main">
      <div className="dashboard-grid app-grid with-subpanel">
        <LeftRail />

        {/* Middle sub-panel: non-sticky, boxed rows with dotted/filled circles */}
        <SubPanel sectionLabel={sectionLabel} subsections={subsections} completed={completed} />

        {/* Center editor */}
        <section className="center-rail app-center">
          <section className="main-card editor-card thin-scrollbars">
            <div className="breadcrumb mb-2">
              My Common Application <span className="mx-1">|</span> {sectionLabel}
            </div>

            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-3 mb-3 border-b border-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight">{TEST_SECTION.sectionTitle}</h1>
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

            {/* FORM (remount after client rehydrate) */}
            <form key={mounted ? renderKey : "ssr"} className="space-y-7" onSubmit={onSubmit}>
              {/* ---- Personal Information ---- */}
              <SectionAnchor id={slug("Personal Information")} title="Legal name" />
              <div key={`k-${renderKey}-firstName`}>
                <TextField name="firstName" label="First/given name" required value={values.firstName} />
              </div>

              <div key={`k-${renderKey}-hasPreferred`}>
                <RadioGroup
                  name="hasPreferred"
                  label="Would you like to share a different first name that people call you?"
                  value={values.hasPreferred}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                />
                <button type="reset" className="outline-button h-9 px-3 text-sm">Clear answer</button>
              </div>

              <div key={`k-${renderKey}-middleName`}>
                <TextField name="middleName" label="Middle name" value={values.middleName} />
              </div>

              <div key={`k-${renderKey}-lastName`}>
                <TextField name="lastName" label="Last/family/surname" required value={values.lastName} />
              </div>

              <div key={`k-${renderKey}-suffix`}>
                <SelectField
                  name="suffix"
                  label="Suffix"
                  value={values.suffix}
                  options={[
                    { value: "", label: "- Choose an option -" },
                    { value: "jr", label: "Jr." },
                    { value: "sr", label: "Sr." },
                    { value: "Mr", label: "Mr." },
                    { value: "Mrs", label: "Mrs." },
                  ]}
                />
              </div>

              {/* ---- Address ---- */}
              <SectionAnchor id={slug("Address")} title="Address" />
              <div key={`k-${renderKey}-street`}>
                <TextField name="street" label="Street address" value={values.street} />
              </div>

              {/* ---- Contact Details ---- */}
              <SectionAnchor id={slug("Contact Details")} title="Contact Details" />
              <div key={`k-${renderKey}-email`}>
                <TextField name="email" label="Email" placeholder="you@example.com" value={values.email} />
              </div>

              {/* ---- Demographics ---- */}
              <SectionAnchor id={slug("Demographics")} title="Demographics" />
              <div key={`k-${renderKey}-citizen`}>
                <RadioGroup
                  name="citizen"
                  label="Citizenship"
                  value={values.citizen}
                  options={[{ value: "Pk", label: "P.K." }, { value: "non-PK", label: "Non-P.K." }]}
                />
              </div>

              {/* ---- Language ---- */}
              <SectionAnchor id={slug("Language")} title="Language" />
              <div key={`k-${renderKey}-primaryLang`}>
                <SelectField
                  name="primaryLang"
                  label="Primary language"
                  value={values.primaryLang}
                  options={[
                    { value: "", label: "- Choose an option -" },
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "ar", label: "Arabic" },
                  ]}
                />
              </div>


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

function SectionAnchor({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="anchor-target">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
    </section>
  );
}
