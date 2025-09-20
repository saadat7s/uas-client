"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import LeftRail from "@/components/bars/LeftRail";
import SubPanel from "@/components/bars/SubPanel";
import RightRail from "@/components/bars/RightRail";

import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioGroup from "@/components/form/RadioGroup";
import { SECTION_LABEL, SUBSECTIONS, slug } from "@/lib/contants";
import { useAuth } from "@/app/redux/hooks";
import { useProfile } from "@/app/redux/hooks/useProfile";
import { useApplication } from "@/app/redux/hooks/useApplication";
import ServerStatus from "@/components/debug/ServerStatus";
import SavePopup from "@/components/ui/SavePopup";

/* ---------- helpers ---------- */
const SECTION_KEY = "profile" as const;
/* ⬇️ use the same key style as Family so LeftRail sees it */
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
  const { user, isAuthenticated } = useAuth();
  const {
    profile,
    isLoading,
    error,
    lastSaved,
    loadProfile,
    saveProfileData,
    clearProfileError
  } = useProfile();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<Values>(DEFAULTS);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "complete">("not_started");
  const [renderKey, setRenderKey] = useState(0);

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [continueAfterSave, setContinueAfterSave] = useState(false);
  const navigateTimer = useRef<number | null>(null); // timer id so we can cancel if user clicks OK

  useEffect(() => setMounted(true), []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/Login');
    }
  }, [isAuthenticated, router]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (navigateTimer.current) {
        clearTimeout(navigateTimer.current);
        navigateTimer.current = null;
      }
    };
  }, []);

  // Load profile data from Redux and local storage
  const loadProfileData = useCallback(async () => {
    if (!user || !isAuthenticated) return;
    
    try {
      if (!profile) {
        loadProfile();
      }
      if (profile) {
        const loadedValues: Values = {
          firstName: profile.firstName || '',
          middleName: profile.middleName || '',
          lastName: profile.lastName || '',
          address: profile.address || '',
          primaryLang: profile.primaryLang || '',
          citizen: profile.citizen || '',
          cnic: profile.cnic || '',
          gender: profile.gender || '',
          dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
          maritalStatus: profile.maritalStatus || '',
          phone: profile.phone || '',
          photoName: profile.photoName || '',
          photoBytes: profile.photoBytes || 0,
        };
        setValues(loadedValues);
        setStatus("complete");
        return;
      }

      // Fallback to local storage
      // ⬇️ read new flat key; if not found, also try legacy per-user key once
      const legacyKey = `pcas:application:profile:${user.id}`;
      const raw = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyKey);
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
      console.error('Error loading profile data:', error);
    } finally {
      setRenderKey((k) => k + 1);
    }
  }, [user, isAuthenticated, profile, loadProfile]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

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

  // SubPanel completion (aligned with constants)
  const completed = useMemo(() => {
    const done = new Set<string>();
    const v = values;

    if (v.firstName.trim() && v.lastName.trim()) done.add(slug("Legal name"));
    if (v.address.trim()) done.add(slug("Address"));
    if (v.primaryLang) done.add(slug("Language"));
    if (v.citizen) done.add(slug("Demographics"));

    const photoOk = !!v.photoName && v.photoBytes > 0 && v.photoBytes <= 5 * 1024 * 1024;
    if (photoOk) done.add(slug("Photo & IDs"));

    const contactOk =
      !!v.cnic.trim() && !!v.gender.trim() && !!v.dob && !!v.maritalStatus.trim() && !!v.phone.trim();
    if (contactOk) done.add(slug("Contact Details"));

    return done;
  }, [values]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      clearProfileError();
      
      try {
        const fd = new FormData(e.currentTarget);

        // Detect "Save & Continue" via submit button name/value
        const isContinue = fd.get("submitAndContinue") === "1";
        setContinueAfterSave(isContinue);

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

        const nextStatus: typeof status = meetsRequired ? "complete" : "in_progress";
        setStatus(nextStatus);

        // Save to Redux/Server (unchanged)
        const profileData = {
          firstName: next.firstName,
          middleName: next.middleName,
          lastName: next.lastName,
          address: next.address,
          primaryLang: next.primaryLang as 'en' | 'ur',
          citizen: next.citizen as 'PK' | 'Non-PK',
          cnic: next.cnic,
          gender: next.gender as 'Male' | 'Female',
          dob: next.dob,
          maritalStatus: next.maritalStatus as 'Married' | 'Unmarried',
          phone: next.phone,
          photoName: next.photoName,
          photoBytes: next.photoBytes,
        };
        saveProfileData(profileData);

        // Also save to local storage as backup — using flat key so LeftRail finds it
        const now = new Date();
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ values: next, status: nextStatus, savedAt: now.toISOString() })
          );
        } catch (localError) {
          console.error('Failed to save to local storage:', localError);
        }
        
        setRenderKey((k) => k + 1);

        // Show popup for both buttons
        setPopupOpen(true);

        // If "Save & Continue", auto-redirect after 5s
        if (isContinue) {
          if (navigateTimer.current) {
            clearTimeout(navigateTimer.current);
          }
          navigateTimer.current = window.setTimeout(() => {
            setPopupOpen(false);
            router.push("/MainPages/MyApplication/Family");
          }, 5000);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    },
    [values, clearProfileError, saveProfileData, user?.id, router, status]
  );

  // When user presses OK on the popup:
  const handlePopupClose = () => {
    setPopupOpen(false);
    if (navigateTimer.current) {
      clearTimeout(navigateTimer.current);
      navigateTimer.current = null;
    }
    if (continueAfterSave) {
      router.push("/MainPages/MyApplication/Family"); // absolute route
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="center-wrap with-mandala with-minar">
        <div className="main-card p-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <main className="center-wrap with-mandala with-minar" role="main">
      <div className="dashboard-grid app-grid with-subpanel">
        <LeftRail />
        <SubPanel sectionLabel={sectionLabel} subsections={subsections} completed={completed} />

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
                      {mounted && lastSaved ? `· Saved ${new Date(lastSaved).toLocaleTimeString()}` : null}
                    </span>
                    {isLoading && <span className="text-blue-600">Saving...</span>}
                  </div>
                  <ServerStatus className="mt-2" />
                  {error && <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
                </div>
                <Link href="#" className="outline-button shrink-0">
                  Preview
                </Link>
              </div>
            </div>

            {/* FORM */}
            <form key={mounted ? renderKey : "ssr"} className="space-y-7" onSubmit={onSubmit}>
              {/* Legal name */}
              <SectionAnchor id={slug("Legal name")} title="Legal name *" />
              <TextField name="firstName" label="First Name" required value={values.firstName} />
              <TextField name="middleName" label="Middle Name" value={values.middleName} />
              <TextField name="lastName" label="Last Name" required value={values.lastName} />

              {/* Address */}
              <SectionAnchor id={slug("Address")} title="Address *" />
              <TextField name="address" label="Street address" required value={values.address} />

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
              <SectionAnchor id={slug("Demographics")} title="Demographics *" />
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
              <SectionAnchor id={slug("Photo & IDs")} title="Profile picture & IDs" />
              <label className="text-sm font-semibold block mb-1">
                Profile Picture (4×4, blue/white background, ≤ 5 MB) *
              </label>
              <input type="file" accept="image/*" className="w-full rounded-xl border px-3 py-2" onChange={onPhoto} />
              {values.photoName ? (
                <p className="text-xs text-gray-500 mt-1">
                  {values.photoName} ({Math.round(values.photoBytes / 1024)} KB)
                </p>
              ) : null}

              {/* Contact Details */}
              <SectionAnchor id={slug("Contact Details")} title="Contact Details" />
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
              <TextField name="phone" label="Phone Number *" required value={values.phone} />

              <div className="pt-3 pb-2">
                <div className="flex gap-3">
                  <button type="submit" className="normal-button" disabled={isLoading}>
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

      {/* Popup visible on both Save & Save & Continue */}
      <SavePopup open={popupOpen} onClose={handlePopupClose} />
    </main>
  );
}
