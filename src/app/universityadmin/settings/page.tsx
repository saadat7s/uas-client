"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { AdminLayout, PageHeader } from "@/components/university-admin/layout/AdminLayout";
import {
  UniversityInfoSettings,
  NotificationSettings as NotificationSettingsSection,
  IntegrationSettings as IntegrationSettingsSection,
  ApplicationSettings as ApplicationSettingsSection,
  AdminUsersList,
  AdminUserForm,
  SettingsSaveButton,
} from "@/components/university-admin/settings/SettingsManagement";
import { Button, Toast, LoadingSpinner, Badge } from "@/components/university-admin/ui";
import {
  useUniversitySettings,
  useNotificationSettings,
  useIntegrationSettings,
  useApplicationSettings,
  useAdminUsers,
  useUI,
} from "@/app/redux/hooks/useUniversityAdmin";
import {
  AdminUser,
  UniversitySettings as UniversitySettingsType,
  NotificationSettings as NotificationSettingsType,
  IntegrationSettings as IntegrationSettingsType,
  ApplicationSettings as ApplicationSettingsType,
} from "@/app/redux/features/universityAdmin";
import { ArrowLeft, Image as ImageIcon, Save, KeyRound, Link2, Copy } from "lucide-react";
import { Tooltip } from "recharts";

type RequiredDoc = ApplicationSettingsType["requiredDocs"][number];

const generateMockAdminUsers = (): AdminUser[] => [
  {
    id: "admin-1",
    name: "Registrar Office",
    email: "registrar@lums.edu.pk",
    role: "Owner",
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "admin-2",
    name: "Admissions Lead",
    email: "admissions@lums.edu.pk",
    role: "Admin",
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "admin-3",
    name: "Reviewer Team",
    email: "reviewers@lums.edu.pk",
    role: "Reviewer",
    isActive: true,
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function UniversitySettingsPage() {
  const { settings: universitySettings, updateSettings: updateUniversitySettings } = useUniversitySettings();
  const { settings: notificationSettings, updateSettings: updateNotificationSettings } = useNotificationSettings();
  const { settings: integrationSettings, updateSettings: updateIntegrationSettings, regenerateApiKey } = useIntegrationSettings();
  const { settings: applicationSettings, updateSettings: updateApplicationSettings } = useApplicationSettings();
  const { adminUsers, setAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useAdminUsers();
  const { isLoading, error, successMessage, setLoading, setSuccessMessage, clearMessages } = useUI();

  const [userFormOpen, setUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | undefined>(undefined);
  const [hasChanges, setHasChanges] = useState(false);

  // ---------- Seed admins ----------
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      if (adminUsers.length === 0) setAdminUsers(generateMockAdminUsers());
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [setAdminUsers, setLoading, adminUsers.length]);

  // ---------- Branding: Logo upload (quick action & in UniversityInfoSettings) ----------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_LOGO_BYTES = 1024 * 1024 * 2; // 2MB

  const handleLogoUpload = useCallback((file: File) => {
    if (!file) return;
    if (!/image\/(png|jpeg|jpg|svg\+xml)/.test(file.type)) {
      setSuccessMessage("Please upload a PNG, JPG, or SVG.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setSuccessMessage("Logo too large. Please upload ≤ 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateUniversitySettings({ logo: (e.target?.result as string) || "" });
      setHasChanges(true);
      setSuccessMessage("Logo updated.");
    };
    reader.readAsDataURL(file);
  }, [setSuccessMessage, updateUniversitySettings]);

  const onClickUploadLogo = () => fileInputRef.current?.click();

  // ---------- Update handlers ----------
  const handleUniversitySettingsUpdate = (updates: Partial<UniversitySettingsType>) => {
    updateUniversitySettings(updates);
    setHasChanges(true);
  };
  const handleNotificationSettingsUpdate = (updates: Partial<NotificationSettingsType>) => {
    updateNotificationSettings(updates);
    setHasChanges(true);
  };
  const handleIntegrationSettingsUpdate = (updates: Partial<IntegrationSettingsType>) => {
    updateIntegrationSettings(updates);
    setHasChanges(true);
  };
  const handleApplicationSettingsUpdate = (updates: Partial<ApplicationSettingsType>) => {
    updateApplicationSettings(updates);
    setHasChanges(true);
  };

  // ---------- Required documents ----------
  const handleAddRequiredDoc = () => {
    const newDocs = [...applicationSettings.requiredDocs, { label: "", required: false }];
    updateApplicationSettings({ requiredDocs: newDocs });
    setHasChanges(true);
  };
  const handleRemoveRequiredDoc = (index: number) => {
    const newDocs: RequiredDoc[] = applicationSettings.requiredDocs.filter((_doc: RequiredDoc, i: number) => i !== index);
    updateApplicationSettings({ requiredDocs: newDocs });
    setHasChanges(true);
  };
  const handleUpdateRequiredDoc = (index: number, updates: Partial<{ label: string; required: boolean }>) => {
    const newDocs: RequiredDoc[] = applicationSettings.requiredDocs.map(
      (doc: RequiredDoc, i: number): RequiredDoc =>
        i === index
          ? { label: updates.label ?? doc.label, required: updates.required ?? doc.required }
          : doc
    );
    updateApplicationSettings({ requiredDocs: newDocs });
    setHasChanges(true);
  };

  // ---------- Admin users ----------
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setUserFormOpen(true);
  };
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };
  const handleDeleteUser = (userId: string) => {
    deleteAdminUser(userId);
    setSuccessMessage("Admin user deleted successfully");
    setHasChanges(true);
  };
  const handleUserSubmit = (userData: Omit<AdminUser, "id">) => {
    if (selectedUser) {
      updateAdminUser(selectedUser.id, userData);
      setSuccessMessage("Admin user updated successfully");
    } else {
      addAdminUser({ ...userData, id: `admin-${Date.now()}` });
      setSuccessMessage("Admin user created successfully");
    }
    setUserFormOpen(false);
    setSelectedUser(undefined);
    setHasChanges(true);
  };

  // ---------- API key + webhook ----------
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => setSuccessMessage("Copied to clipboard"));
  };

  const handleRegenerateApiKey = () => {
    regenerateApiKey();
    setSuccessMessage("API key regenerated successfully");
    setHasChanges(true);
  };
  const handleTestWebhook = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateIntegrationSettings({ lastWebhookTest: new Date().toISOString() });
      setSuccessMessage("Webhook test completed successfully");
      setHasChanges(true);
    }, 800);
  };

  // ---------- Save / unsaved guard / shortcuts ----------
  const handleSaveAll = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasChanges(false);
      setSuccessMessage("All settings saved successfully");
    }, 600);
  }, [setLoading, setSuccessMessage]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  // Ctrl/Cmd+S to save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSaveAll]);

  // Toast cleanup
  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => clearMessages(), 2500);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, clearMessages]);

  if (isLoading && adminUsers.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="University Settings"
        description="Manage your university configuration, users, and integrations"
        breadcrumbs={[{ label: "Dashboard", href: "/universityadmin/dashboard" }, { label: "Settings" }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Quick branding actions */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Button variant="outline" onClick={onClickUploadLogo}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                  e.currentTarget.value = ""; // allow re-uploading the same file
                }}
              />
            </div>

            <Link href="/universityadmin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <SettingsSaveButton onSave={handleSaveAll} isLoading={isLoading} hasChanges={hasChanges} />
          </div>
        }
      />

      {/* Live brand preview bar (subtle, on-brand) */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
            {universitySettings.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={universitySettings.logo} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-sm text-slate-600">Brand Preview</div>
            <div className="font-semibold text-slate-900">
              {universitySettings.name || "Your University Name"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">Theme</Badge>
          <Badge variant="success">Real-time</Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* University info (has its own internal logo button too) */}
        <UniversityInfoSettings
          settings={universitySettings}
          onUpdate={handleUniversitySettingsUpdate}
          onLogoUpload={handleLogoUpload}
        />

        {/* Notifications */}
        <NotificationSettingsSection
          settings={notificationSettings}
          onUpdate={handleNotificationSettingsUpdate}
        />

        {/* Integrations with handy copy buttons */}
        <IntegrationSettingsSection
          settings={integrationSettings}
          onUpdate={handleIntegrationSettingsUpdate}
          onRegenerateApiKey={handleRegenerateApiKey}
          onTestWebhook={handleTestWebhook}
        />

        {/* Applications (required docs editable) */}
        <ApplicationSettingsSection
          settings={applicationSettings}
          onUpdate={handleApplicationSettingsUpdate}
          onAddRequiredDoc={handleAddRequiredDoc}
          onRemoveRequiredDoc={handleRemoveRequiredDoc}
          onUpdateRequiredDoc={handleUpdateRequiredDoc}
        />

        {/* Admin users */}
        <AdminUsersList
          users={adminUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onAdd={handleAddUser}
        />
      </div>

      {/* Admin user modal */}
      <AdminUserForm
        user={selectedUser}
        isOpen={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={handleUserSubmit}
        isLoading={isLoading}
      />

      <Toast message={successMessage} type="success" />
      <Toast message={error} type="error" />
    </AdminLayout>
  );
}
