"use client";
import { useMemo, useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import {
  Settings, ArrowLeft, Save, UploadCloud, Plus, Trash2, RefreshCw, Link2, Users,
  Key, Bell, Building2, CalendarDays, CheckCircle2
} from "lucide-react";

// =====================================================
// PCAS UNIVERSITY SETTINGS (University-side)
// Route suggestion: /app/university/admin/settings/page.tsx
// Matches globals.css aesthetic; all actions are wired with optimistic UI + toasts
// =====================================================

const CURRENT_UNI = "LUMS" as const;
const PROGRAMS = [
  "BS Computer Science",
  "BBA",
  "MS Data Science",
  "MBA",
  "BE Electrical",
  "BS Economics",
] as const;

// -----------------------------
// Helpers & tokens
// -----------------------------
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const cardBase = "bg-white border border-[rgba(14,169,113,.14)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]";
const lightRing = "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0";

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 1800); return () => clearTimeout(t); }, [msg]);
  return { msg, push: (m: string) => setMsg(m) } as const;
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className={cn("fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] transition", message ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <div className="px-4 py-2 rounded-xl bg-[var(--pakistan-green)] text-white shadow-lg border border-[rgba(255,255,255,.15)]">{message}</div>
    </div>
  );
}

// -----------------------------
// Types and mock data
// -----------------------------

type Admin = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Reviewer" };

type ProgramSetting = { name: string; isOpen: boolean; deadline: string };

type AppSettings = {
  autoCloseOnDeadline: boolean;
  requiredDocs: { label: string; required: boolean }[];
};

type NotificationSettings = {
  notifyApplicantOnStatusChange: boolean;
  notifyReviewerOnAssignment: boolean;
  defaultEmailFrom: string;
  templateSubject: string;
  templateBody: string;
};

type IntegrationSettings = {
  webhookUrl: string;
  apiKey: string;
};

const initialAdmins: Admin[] = [
  { id: "u1", name: "Registrar Office", email: "registrar@lums.edu.pk", role: "Owner" },
  { id: "u2", name: "Admissions Lead", email: "admissions@lums.edu.pk", role: "Admin" },
  { id: "u3", name: "Reviewer Team", email: "reviewers@lums.edu.pk", role: "Reviewer" },
];

const initialPrograms: ProgramSetting[] = PROGRAMS.map((p, i) => ({
  name: p,
  isOpen: i % 2 === 0,
  deadline: new Date(2026, 0, (i + 1) * 3).toISOString().slice(0, 10),
}));

const initialAppSettings: AppSettings = {
  autoCloseOnDeadline: true,
  requiredDocs: [
    { label: "Personal Statement", required: true },
    { label: "High School Transcript", required: true },
    { label: "CNIC / Passport", required: true },
    { label: "Recommendation Letter", required: false },
  ],
};

const initialNotify: NotificationSettings = {
  notifyApplicantOnStatusChange: true,
  notifyReviewerOnAssignment: true,
  defaultEmailFrom: "admissions@lums.edu.pk",
  templateSubject: "Your application status at {{university}}",
  templateBody:
    "Hello {{student}},\n\nYour application ({{application_id}}) is now '{{status}}'.\n\nRegards,\n{{university}} Admissions",
};

const initialIntegrations: IntegrationSettings = {
  webhookUrl: "https://hooks.yourdomain.com/pcas/events",
  apiKey: "pk_live_************************",
};

// -----------------------------
// Page
// -----------------------------
export default function UniversitySettingsPage() {
  const toast = useToast();

  const [uniName, setUniName] = useState<string>(CURRENT_UNI);
  const [logo, setLogo] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [programs, setPrograms] = useState<ProgramSetting[]>(initialPrograms);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [notify, setNotify] = useState<NotificationSettings>(initialNotify);
  const [integrations, setIntegrations] = useState<IntegrationSettings>(initialIntegrations);

  function onLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  }

  function saveAll() {
    // TODO: Replace with server action / API call
    toast.push("Settings saved ✔");
  }

  function inviteAdmin() {
    const id = `u${Math.random().toString(36).slice(2, 6)}`;
    const newAdmin: Admin = { id, name: "New Admin", email: "new.admin@lums.edu.pk", role: "Admin" };
    setAdmins((prev) => [newAdmin, ...prev]);
    toast.push("Invitation sent to new.admin@lums.edu.pk");
  }

  function removeAdmin(id: string) {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.push("Admin removed");
  }

  function regenerateKey() {
    const key = `pk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    setIntegrations((prev) => ({ ...prev, apiKey: key }));
    toast.push("API key regenerated");
  }

  function testWebhook() {
    // Simulate a ping
    toast.push("Webhook test event sent");
  }

  function updateProgram(i: number, patch: Partial<ProgramSetting>) {
    setPrograms((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function toggleRequiredDoc(i: number) {
    setAppSettings((prev) => ({
      ...prev,
      requiredDocs: prev.requiredDocs.map((d, idx) => (idx === i ? { ...d, required: !d.required } : d)),
    }));
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/universityadmin/dashboard" className={cn("outline-button h-10 px-3", lightRing)}><ArrowLeft className="size-4 mr-2"/>Back</Link>
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--pakistan-green)] tracking-tight flex items-center gap-2">
          <Settings className="size-6"/> University Settings
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={saveAll} className={cn("normal-button h-10 px-3", lightRing)}><Save className="size-4 mr-2"/>Save changes</button>
        </div>
      </div>

      {/* Identity & Branding */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><Building2 className="size-4"/> Identity & Branding</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">University name</label>
            <input value={uniName} onChange={(e)=>setUniName(e.target.value)} className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Logo</label>
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-xl border border-slate-200 bg-white grid place-items-center overflow-hidden">
                {logo ? (<img src={logo} alt="Logo preview" className="object-cover w-full h-full"/>) : (<span className="text-xs text-slate-400">No logo</span>)}
              </div>
              <label className={cn("outline-button h-10 px-3 cursor-pointer", lightRing)}>
                <UploadCloud className="size-4 mr-2"/>Upload
                <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Deadlines */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><CalendarDays className="size-4"/> Programs & Deadlines</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programs.map((p, i) => (
            <div key={p.name} className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.isOpen ? "Applications are open" : "Closed"}</div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={p.isOpen} onChange={()=>updateProgram(i,{ isOpen: !p.isOpen })} />
                  <span>Open</span>
                </label>
              </div>
              <div className="mt-3">
                <label className="text-xs text-slate-500 mb-1 block">Deadline</label>
                <input type="date" value={p.deadline} onChange={(e)=>updateProgram(i,{ deadline: e.target.value })} className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Settings */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><CheckCircle2 className="size-4"/> Application Settings</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={appSettings.autoCloseOnDeadline} onChange={()=>setAppSettings((s)=>({ ...s, autoCloseOnDeadline: !s.autoCloseOnDeadline }))} />
            <span>Auto-close when deadline passes</span>
          </label>
          <div className="md:col-span-2">
            <div className="text-xs text-slate-500 mb-1">Required documents</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {appSettings.requiredDocs.map((d, i) => (
                <label key={i} className="inline-flex items-center gap-2 text-sm border border-slate-200 rounded-lg p-2">
                  <input type="checkbox" checked={d.required} onChange={()=>toggleRequiredDoc(i)} />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><Bell className="size-4"/> Notifications</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={notify.notifyApplicantOnStatusChange} onChange={()=>setNotify(s=>({ ...s, notifyApplicantOnStatusChange: !s.notifyApplicantOnStatusChange }))} />
            <span>Notify applicant on status change</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={notify.notifyReviewerOnAssignment} onChange={()=>setNotify(s=>({ ...s, notifyReviewerOnAssignment: !s.notifyReviewerOnAssignment }))} />
            <span>Notify reviewer on assignment</span>
          </label>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Default From address</label>
            <input value={notify.defaultEmailFrom} onChange={(e)=>setNotify(s=>({ ...s, defaultEmailFrom: e.target.value }))} className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Email subject</label>
            <input value={notify.templateSubject} onChange={(e)=>setNotify(s=>({ ...s, templateSubject: e.target.value }))} className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Email body</label>
            <textarea value={notify.templateBody} onChange={(e)=>setNotify(s=>({ ...s, templateBody: e.target.value }))} rows={6} className={cn("w-full px-3 py-2 rounded-xl border bg-white border-slate-200", lightRing)} />
            <p className="text-xs text-slate-500 mt-1">Variables: {"{{student}}"}, {"{{application_id}}"}, {"{{status}}"}, {"{{university}}"}</p>
          </div>
        </div>
      </section>

      {/* Team & Access */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><Users className="size-4"/> Team & Access</div>
        <div className="flex items-center mb-3">
          <button onClick={inviteAdmin} className={cn("outline-button h-9 px-3", lightRing)}><Plus className="size-4 mr-1"/>Invite admin</button>
        </div>
        <div className="divide-y divide-slate-100">
          {admins.map((a) => (
            <div key={a.id} className="py-3 flex items-center gap-3">
              <div className="size-9 rounded-full bg-[var(--mint-100)] grid place-items-center border border-[var(--pakistan-green-600)] text-[var(--pakistan-green-600)] font-semibold">
                {a.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-800 truncate">{a.name}</div>
                <div className="text-xs text-slate-500 truncate">{a.email}</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <select value={a.role} onChange={(e)=>setAdmins(prev=>prev.map(p=>p.id===a.id?{...p, role: e.target.value as Admin['role']}:p))} className={cn("h-9 px-2 rounded-lg border bg-white border-slate-200", lightRing)}>
                  {(["Owner","Admin","Reviewer"] as const).map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={()=>removeAdmin(a.id)} className={cn("outline-button h-9 px-3", lightRing)}><Trash2 className="size-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className={cn(cardBase, "p-4 mb-4")}>
        <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold mb-2"><Key className="size-4"/> API & Integrations</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500 mb-1 block">Webhook URL</label>
            <input value={integrations.webhookUrl} onChange={(e)=>setIntegrations(s=>({ ...s, webhookUrl: e.target.value }))} className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
            <div className="mt-2 flex items-center gap-2">
              <button onClick={testWebhook} className={cn("outline-button h-9 px-3", lightRing)}><Link2 className="size-4 mr-1"/>Test webhook</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Public API Key</label>
            <div className="flex items-center gap-2">
              <input value={integrations.apiKey} readOnly className={cn("w-full h-10 px-3 rounded-xl border bg-white border-slate-200", lightRing)} />
              <button onClick={regenerateKey} className={cn("outline-button h-9 px-3", lightRing)}><RefreshCw className="size-4"/></button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Use this key in client SDKs; rotate if exposed.</p>
          </div>
        </div>
      </section>

      {/* Save bar (sticky on mobile) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3">
        <button onClick={saveAll} className={cn("normal-button w-full h-12", lightRing)}><Save className="size-4 mr-2"/>Save changes</button>
      </div>

      <Toast message={toast.msg} />
    </div>
  );
}
