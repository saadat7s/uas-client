"use client";

import LeftRail from "@/components/bars/LeftRail";
import RightRail from "@/components/bars/RightRail";
import { useAuth } from "@/app/redux/hooks";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();

  // Local state mirrors form values. Replace with real API later.
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notif, setNotif] = useState({ email: true, sms: false });

  return (
    <main className="center-wrap with-mandala">
      <div className="dashboard-grid">
        <LeftRail />
        <section className="center-rail">
          <div className="main-card main-card-lg" style={{ margin: 0 }}>
            <header className="mb-4">
              <h2 className="title-primary text-left">Settings</h2>
              <p className="text-gray-700 mt-1 text-sm">Manage your account, security and notifications.</p>
            </header>

            {/* Account details */}
            <section className="rounded-2xl border p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-900">Account</h3>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">Full name</span>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={fullName} onChange={e=>setFullName(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">Email</span>
                  <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">Phone</span>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="03xx-xxxxxxx" value={phone} onChange={e=>setPhone(e.target.value)} />
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="normal-button">Save changes</button>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border p-5 shadow-sm mt-4">
              <h3 className="text-lg font-semibold text-emerald-900">Security</h3>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">Current password</span>
                  <input type="password" className="mt-1 w-full border rounded-lg px-3 py-2" value={passwords.current} onChange={e=>setPasswords({ ...passwords, current: e.target.value })} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">New password</span>
                  <input type="password" className="mt-1 w-full border rounded-lg px-3 py-2" value={passwords.next} onChange={e=>setPasswords({ ...passwords, next: e.target.value })} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-emerald-900">Confirm new password</span>
                  <input type="password" className="mt-1 w-full border rounded-lg px-3 py-2" value={passwords.confirm} onChange={e=>setPasswords({ ...passwords, confirm: e.target.value })} />
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="normal-button">Update password</button>
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border p-5 shadow-sm mt-4">
              <h3 className="text-lg font-semibold text-emerald-900">Notifications</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notif.email} onChange={e=>setNotif({ ...notif, email: e.target.checked })} />
                  Email notifications
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notif.sms} onChange={e=>setNotif({ ...notif, sms: e.target.checked })} />
                  SMS notifications
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="normal-button">Save preferences</button>
              </div>
            </section>

            {/* Danger zone */}
            <section className="rounded-2xl border p-5 shadow-sm mt-4">
              <h3 className="text-lg font-semibold text-red-700">Danger zone</h3>
              <p className="text-sm text-gray-600 mt-1">Delete your account permanently. This cannot be undone.</p>
              <div className="mt-3">
                <button className="bg-red-600 text-white px-3 py-2 rounded-lg">Delete my account</button>
              </div>
            </section>
          </div>
        </section>
        <RightRail />
      </div>
    </main>
  );
}


