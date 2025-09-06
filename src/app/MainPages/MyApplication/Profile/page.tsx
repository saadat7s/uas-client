"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";

import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioGroup from "@/components/form/RadioGroup";
import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/contants";

/* ---------- helpers ---------- */
const SECTION_KEY = "profile" as const;
const storageKey = "pcas:application:profile";

type Values = {
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  primaryLang: string;
  citizen: "PK" | "Non-PK" | "";
  cnic: string;
  gender: string;
  dob: string; // yyyy-mm-dd
  maritalStatus: string;
  phone: string;
  photoName: string;
  photoBytes: number;
};

const DEFAULTS: Values = {
  firstName: "",
  middleName: "",
  lastName: "",
  address: "",
  primaryLang: "",
  citizen: "",
  cnic: "",
  gender: "",
  dob: "",
  maritalStatus: "",
  phone: "",
  photoName: "",
  photoBytes: 0,
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

/** Small native date-picker wrapper (opens dropdown calendar) */
function DatePickerField({
  name,
  label,
  value,
  onChange,
  required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    if (el.showPicker) el.showPicker();
    else el.click();
  };
  const pretty = value ? new Date(value + "T00:00:00").toLocaleDateString() : "";

  return (
    <div>
      <label className="text-sm font-semibold block mb-1">
        {label}
        {required ? " *" : ""}
      </label>
      <button
        type="button"
        className="w-full rounded-xl border px-3 py-2 text-left"
        onClick={openPicker}
      >
        {pretty || "Select date"}
      </button>
      {/* actual input participates in form submission */}
      <input
        ref={ref}
        type="date"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}

export default function ProfilePage() {
  const sectionLabel = SECTION_LABEL[SECTION_KEY];
  const subsections = SUBSECTIONS[SECTION_KEY];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [values, setValues] = useState<Values>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<
    "not_started" | "in_progress" | "complete"
  >("not_started");
  const [renderKey, setRenderKey] = useState(0);

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          values: Values;
          status?: string;
          savedAt?: string;
        };
        setValues({ ...DEFAULTS, ...parsed.values });
        setStatus((parsed.status as any) ?? "in_progress");
        setSavedAt(parsed.savedAt ? new Date(parsed.savedAt) : null);
      }
    } catch {}
    setRenderKey((k) => k + 1);
  }, []);

  // file input handler
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      alert("Profile picture must be ≤ 5 MB.");
      return;
    }

    setValues((p) => ({
      ...p,
      photoName: f.name,
      photoBytes: f.size,
    }));
  };

  // SubPanel completion (fill dots)
  const completed = useMemo(() => {
    const done = new Set<string>();
    const v = values;

    if (!!v.firstName.trim() && !!v.lastName.trim())
      done.add(slug("Personal Information"));
    if (!!v.address.trim()) done.add(slug("Address"));
    if (!!v.primaryLang) done.add(slug("Language"));
    if (!!v.citizen) done.add(slug("Demographics"));

    // New groups
    const photoOk =
      !!v.photoName &&
      v.photoBytes > 0 &&
      v.photoBytes <= 5 * 1024 * 1024;
    if (photoOk) done.add(slug("Photo & IDs"));

    const contactOk =
      !!v.cnic.trim() &&
      !!v.gender.trim() &&
      !!v.dob &&
      !!v.maritalStatus.trim() &&
      !!v.phone.trim();
    if (contactOk) done.add(slug("Contact Details"));

    return done;
  }, [values]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const payload = asStringMap(fd);
      const next: Values = {
        ...values,
        ...payload,
        photoName: values.photoName,
        photoBytes: values.photoBytes,
      };
      setValues(next);

      const meetsRequired =
        !!next.firstName.trim() &&
        !!next.lastName.trim() &&
        !!next.address.trim() &&
        !!next.primaryLang &&
        !!next.citizen &&
        !!next.cnic.trim() &&
        !!next.gender.trim() &&
        !!next.dob &&
        !!next.maritalStatus.trim() &&
        !!next.phone.trim() &&
        !!next.photoName &&
        next.photoBytes > 0 &&
        next.photoBytes <= 5 * 1024 * 1024;

      const nextStatus: typeof status = meetsRequired
        ? "complete"
        : "in_progress";
      setStatus(nextStatus);

      const now = new Date();
      setSavedAt(now);
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            values: next,
            status: nextStatus,
            savedAt: now.toISOString(),
          })
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
        <SubPanel
          sectionLabel={sectionLabel}
          subsections={subsections}
          completed={completed}
        />

        <section className="center-rail app-center">
          <section className="main-card editor-card thin-scrollbars">
            <div className="breadcrumb mb-2">
              My Common Application <span className="mx-1">|</span>{" "}
              {sectionLabel}
            </div>

            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pb-3 mb-3 border-b border-black/10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight">
                    {sectionLabel}
                  </h1>
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-3">
                    <span className="status-dot" />
                    {status === "in_progress"
                      ? "In progress"
                      : status === "complete"
                      ? "Complete"
                      : "Not started"}
                    <span suppressHydrationWarning>
                      {mounted && savedAt
                        ? `· Saved ${savedAt.toLocaleTimeString()}`
                        : null}
                    </span>
                  </div>
                </div>
                <Link href="#" className="outline-button shrink-0">
                  Preview
                </Link>
              </div>
            </div>

            {/* FORM */}
            <form
              key={mounted ? renderKey : "ssr"}
              className="space-y-7"
              onSubmit={onSubmit}
            >
              {/* Personal Information */}
              <SectionAnchor
                id={slug("Personal Information")}
                title="Legal name"
              />
              <TextField
                name="firstName"
                label="First Name *"
                required
                value={values.firstName}
              />
              <TextField
                name="middleName"
                label="Middle Name"
                value={values.middleName}
              />
              <TextField
                name="lastName"
                label="Last Name *"
                required
                value={values.lastName}
              />

              {/* Address */}
              <SectionAnchor id={slug("Address")} title="Address *" />
              <TextField
                name="address"
                label="Street address"
                required
                value={values.address}
              />

              {/* Language */}
              <SectionAnchor id={slug("Language")} title="Primary language *" />
              <SelectField
                name="primaryLang"
                label="Primary language"
                value={values.primaryLang}
                options={[
                  { value: "", label: "- Choose an option -" },
                  { value: "en", label: "English" },
                  { value: "ur", label: "Urdu" },
                ]}
              />

              {/* Demographics */}
              <SectionAnchor
                id={slug("Demographics")}
                title="Demographics *"
              />
              <RadioGroup
                name="citizen"
                label="Demographic"
                value={values.citizen}
                options={[
                  { value: "PK", label: "PK" },
                  { value: "Non-PK", label: "Non-PK" },
                ]}
              />

              {/* Photo + IDs */}
              <SectionAnchor
                id={slug("Photo & IDs")}
                title="Profile picture & IDs"
              />
              <label className="text-sm font-semibold block mb-1">
                Profile Picture (4×4, blue/white background, ≤ 5 MB) *
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border px-3 py-2"
                onChange={onPhoto}
              />
              {values.photoName ? (
                <p className="text-xs text-gray-500 mt-1">
                  {values.photoName} ({Math.round(values.photoBytes / 1024)} KB)
                </p>
              ) : null}

              {/* Contact Details */}
              <SectionAnchor
                id={slug("Contact Details")}
                title="Contact Details"
              />
              <TextField name="cnic" label="CNIC *" required value={values.cnic} />
              <SelectField
                name="gender"
                label="Gender *"
                value={values.gender}
                options={[
                  { value: "", label: "- Choose an option -" },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />

              {/* DOB with dropdown calendar */}
              <DatePickerField
                name="dob"
                label="DOB"
                required
                value={values.dob}
                onChange={(next) => setValues((p) => ({ ...p, dob: next }))}
              />

              <SelectField
                name="maritalStatus"
                label="Marital Status *"
                value={values.maritalStatus}
                options={[
                  { value: "", label: "- Choose an option -" },
                  { value: "Married", label: "Married" },
                  { value: "Unmarried", label: "Unmarried" },
                ]}
              />
              <TextField
                name="phone"
                label="Phone Number *"
                required
                value={values.phone}
              />

              <div className="pt-3 pb-2">
                <div className="flex gap-3">
                  <button type="submit" className="normal-button">
                    Save
                  </button>
                  <button
                    type="submit"
                    name="submitAndContinue"
                    value="1"
                    className="outline-button"
                  >
                    Save & Continue
                  </button>
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
