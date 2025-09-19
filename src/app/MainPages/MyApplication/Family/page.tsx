"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useEffect } from "react";

import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";
import AuthGuard from "@/components/guards/AuthGuard";
import SectionAnchor from "@/components/ui/SectionAnchor";

import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";

import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/constants";
import { useAuth } from "@/app/redux/hooks";
import { useFamily } from "@/app/redux/hooks/useFamily";

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

export default function FamilyPage() {
  const sectionLabel = SECTION_LABEL[SECTION_KEY];
  const subsections = SUBSECTIONS[SECTION_KEY];
  const { user } = useAuth();
  const {
    family,
    isLoading,
    error,
    lastSaved,
    loadFamily,
    saveFamilyData,
    clearFamilyError
  } = useFamily();

  const [values, setValues] = useState<Values>(DEFAULTS);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "complete">("not_started");
  const [renderKey, setRenderKey] = useState(0);

  // Load family data from Redux and local storage
  const loadFamilyData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Try to load from Redux/Server first
      if (!family) {
        loadFamily();
      }
      
      // If we have family data from Redux, use it
      if (family) {
        const loadedValues: Values = {
          fatherName: family.fatherName || '',
          motherName: family.motherName || '',
          fatherOccupation: family.fatherOccupation || '',
        };
        setValues(loadedValues);
        setStatus("complete");
        return;
      }
      
      // Fallback to local storage
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          values: Values;
          status?: string;
          savedAt?: string;
        };
        setValues({ ...DEFAULTS, ...parsed.values });
        setStatus((parsed.status as "not_started" | "in_progress" | "complete") ?? "in_progress");
      }
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setRenderKey((k) => k + 1);
    }
  }, [user, family, loadFamily]);

  // Load data when component mounts or family changes
  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);

  const saveForm = useCallback(async (newValues: Values) => {
    clearFamilyError();
    
    try {
      setValues(newValues);

      const meetsRequired = !!newValues.fatherName.trim() && !!newValues.motherName.trim() && !!newValues.fatherOccupation;
      const nextStatus: typeof status = meetsRequired ? "complete" : "in_progress";
      setStatus(nextStatus);

      // Prepare data for Redux/Server
      const familyData = {
        fatherName: newValues.fatherName,
        motherName: newValues.motherName,
        fatherOccupation: newValues.fatherOccupation as 'govt' | 'non-govt',
      };

      // Save to Redux/Server
      saveFamilyData(familyData);

      // Also save to local storage as backup
      const now = new Date();
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            values: newValues,
            status: nextStatus,
            savedAt: now.toISOString(),
          })
        );
      } catch (localError) {
        console.error('Failed to save to local storage:', localError);
      }
      
      setRenderKey((k) => k + 1);
    } catch (error) {
      console.error('Error saving family data:', error);
    }
  }, [clearFamilyError, saveFamilyData]);

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
      saveForm(next);
    },
    [values, saveForm]
  );

  return (
    <AuthGuard>
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
                        {lastSaved ? `· Saved ${new Date(lastSaved).toLocaleTimeString()}` : null}
                      </span>
                      {isLoading && <span className="text-blue-600">Saving...</span>}
                    </div>
                    {error && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    )}
                  </div>
                  <Link href="#" className="outline-button shrink-0">Preview</Link>
                </div>
              </div>

              {/* FORM */}
              <form key={renderKey} className="space-y-7" onSubmit={onSubmit}>
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
                    <button 
                      type="submit" 
                      className="normal-button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      type="submit" 
                      name="submitAndContinue" 
                      value="1" 
                      className="outline-button"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save & Continue'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </section>

          <RightRail />
        </div>
      </main>
    </AuthGuard>
  );
}
