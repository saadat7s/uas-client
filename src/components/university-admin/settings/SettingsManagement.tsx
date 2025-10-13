"use client";
import React from 'react';
import {
  Settings,
  Building2,
  Bell,
  Key,
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  UploadCloud,
  RefreshCw,
  Link2,
  CheckCircle2,
  CalendarDays,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  Badge,
  EmptyState,
} from '../ui';
import {
  useUniversitySettings,
  useNotificationSettings,
  useIntegrationSettings,
} from '@/app/redux/hooks/useUniversityAdmin';

export const SettingsSection: React.FC<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, children, className = '' }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle icon={icon}>{title}</CardTitle>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const UniversityInfoSettings: React.FC<{
  settings: {
    name: string;
    logo?: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    description: string;
  };
  onUpdate: (updates: Partial<{
    name: string;
    logo?: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    description: string;
  }>) => void;
  onLogoUpload: (file: File) => void;
}> = ({ settings, onUpdate, onLogoUpload }) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLogoUpload(file);
  };
  return (
    <SettingsSection
      title="University Information"
      description="Manage your university's basic information and branding"
      icon={<Building2 className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input label="University Name" value={settings.name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder="Enter university name" />
          <Input label="Contact Email" value={settings.contactEmail} onChange={(e) => onUpdate({ contactEmail: e.target.value })} placeholder="contact@university.edu.pk" icon={<Mail className="w-4 h-4" />} />
          <Input label="Contact Phone" value={settings.contactPhone} onChange={(e) => onUpdate({ contactPhone: e.target.value })} placeholder="+92-XXX-XXXXXXX" icon={<Phone className="w-4 h-4" />} />
          <Input label="Website" value={settings.website} onChange={(e) => onUpdate({ website: e.target.value })} placeholder="https://www.university.edu.pk" icon={<Globe className="w-4 h-4" />} />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">University Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                {settings.logo ? <img src={settings.logo} alt="University logo" className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 text-slate-400" />}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </label>
                <p className="text-xs text-slate-500 mt-1">Recommended: 200x200px, PNG or JPG</p>
              </div>
            </div>
          </div>
          <Textarea label="Address" value={settings.address} onChange={(e) => onUpdate({ address: e.target.value })} placeholder="Enter university address" rows={3} />
          <Textarea label="Description" value={settings.description} onChange={(e) => onUpdate({ description: e.target.value })} placeholder="Brief description of your university" rows={3} />
        </div>
      </div>
    </SettingsSection>
  );
};

export const NotificationSettings: React.FC<{
  settings: {
    notifyApplicantOnStatusChange: boolean;
    notifyReviewerOnAssignment: boolean;
    defaultEmailFrom: string;
    templateSubject: string;
    templateBody: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  onUpdate: (updates: Partial<{
    notifyApplicantOnStatusChange: boolean;
    notifyReviewerOnAssignment: boolean;
    defaultEmailFrom: string;
    templateSubject: string;
    templateBody: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
  }>) => void;
}> = ({ settings, onUpdate }) => (
  <SettingsSection
    title="Notification Settings"
    description="Configure how notifications are sent to applicants and reviewers"
    icon={<Bell className="w-5 h-5" />}
  >
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', key: 'emailNotifications', hint: 'Send notifications via email' },
            { label: 'SMS Notifications', key: 'smsNotifications', hint: 'Send notifications via SMS' },
            { label: 'Notify Applicant on Status Change', key: 'notifyApplicantOnStatusChange', hint: 'Send notification when application status changes' },
            { label: 'Notify Reviewer on Assignment', key: 'notifyReviewerOnAssignment', hint: 'Send notification when reviewer is assigned' },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700">{row.label}</label>
                <p className="text-xs text-slate-500">{row.hint}</p>
              </div>
              <input
                type="checkbox"
                checked={(settings as any)[row.key]}
                onChange={(e) => onUpdate({ [row.key]: e.target.checked } as any)}
                className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
              />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Input label="Default From Email" value={settings.defaultEmailFrom} onChange={(e) => onUpdate({ defaultEmailFrom: e.target.value })} placeholder="admissions@university.edu.pk" icon={<Mail className="w-4 h-4" />} />
          <Input label="Email Subject Template" value={settings.templateSubject} onChange={(e) => onUpdate({ templateSubject: e.target.value })} placeholder="Your application status at {{university}}" />
          <Textarea label="Email Body Template" value={settings.templateBody} onChange={(e) => onUpdate({ templateBody: e.target.value })} placeholder="Hello {{student}}, ..." rows={6} />
          <div className="text-xs text-slate-500">
            <p className="font-medium mb-1">Available variables:</p>
            <p>{'{'}{`{student}`}{'}'}, {'{'}{`{application_id}`}{'}'}, {'{'}{`{status}`}{'}'}, {'{'}{`{university}`}{'}'}</p>
          </div>
        </div>
      </div>
    </div>
  </SettingsSection>
);

export const IntegrationSettings: React.FC<{
  settings: { webhookUrl: string; apiKey: string; isWebhookActive: boolean; lastWebhookTest?: string };
  onUpdate: (updates: Partial<{ webhookUrl: string; apiKey: string; isWebhookActive: boolean; lastWebhookTest?: string }>) => void;
  onRegenerateApiKey: () => void;
  onTestWebhook: () => void;
}> = ({ settings, onUpdate, onRegenerateApiKey, onTestWebhook }) => (
  <SettingsSection
    title="API & Integrations"
    description="Manage webhooks and API access for third-party integrations"
    icon={<Key className="w-5 h-5" />}
  >
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
            <Input value={settings.webhookUrl} onChange={(e) => onUpdate({ webhookUrl: e.target.value })} placeholder="https://hooks.yourdomain.com/pcas/events" icon={<Link2 className="w-4 h-4" />} />
            <div className="mt-2 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onTestWebhook}>
                <Link2 className="w-4 h-4 mr-1" />
                Test Webhook
              </Button>
              {settings.lastWebhookTest && <span className="text-xs text-slate-500">Last test: {new Date(settings.lastWebhookTest).toLocaleString()}</span>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Webhook Active</label>
              <p className="text-xs text-slate-500">Enable webhook notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.isWebhookActive}
              onChange={(e) => onUpdate({ isWebhookActive: e.target.checked })}
              className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Public API Key</label>
            <div className="flex items-center gap-2">
              <Input value={settings.apiKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={onRegenerateApiKey}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Use this key in client SDKs. Rotate if exposed.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Webhook Events</h4>
            <div className="space-y-1 text-xs text-slate-600">
              <p>• application.created</p>
              <p>• application.status_changed</p>
              <p>• application.reviewer_assigned</p>
              <p>• application.deadline_approaching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SettingsSection>
);

export const ApplicationSettings: React.FC<{
  settings: {
    autoCloseOnDeadline: boolean;
    requiredDocs: { label: string; required: boolean }[];
    reviewDeadline: number;
    allowLateApplications: boolean;
  };
  onUpdate: (updates: Partial<{
    autoCloseOnDeadline: boolean;
    requiredDocs: { label: string; required: boolean }[];
    reviewDeadline: number;
    allowLateApplications: boolean;
  }>) => void;
  onAddRequiredDoc: () => void;
  onRemoveRequiredDoc: (index: number) => void;
  onUpdateRequiredDoc: (index: number, updates: Partial<{ label: string; required: boolean }>) => void;
}> = ({ settings, onUpdate, onAddRequiredDoc, onRemoveRequiredDoc, onUpdateRequiredDoc }) => (
  <SettingsSection
    title="Application Settings"
    description="Configure application requirements and deadlines"
    icon={<CheckCircle2 className="w-5 h-5" />}
  >
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Auto-close on Deadline</label>
              <p className="text-xs text-slate-500">Automatically close applications after deadline</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoCloseOnDeadline}
              onChange={(e) => onUpdate({ autoCloseOnDeadline: e.target.checked })}
              className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Allow Late Applications</label>
              <p className="text-xs text-slate-500">Accept applications after deadline</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowLateApplications}
              onChange={(e) => onUpdate({ allowLateApplications: e.target.checked })}
              className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
            />
          </div>

          <Input label="Review Deadline (days)" type="number" min="1" max="90" value={settings.reviewDeadline} onChange={(e) => onUpdate({ reviewDeadline: parseInt(e.target.value) })} placeholder="14" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Required Documents</label>
              <Button variant="outline" size="sm" onClick={onAddRequiredDoc}>
                <Plus className="w-4 h-4 mr-1" />
                Add Document
              </Button>
            </div>
            <div className="space-y-2">
              {settings.requiredDocs.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={doc.required}
                    onChange={(e) => onUpdateRequiredDoc(index, { required: e.target.checked })}
                    className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
                  />
                  <Input
                    value={doc.label}
                    onChange={(e) => onUpdateRequiredDoc(index, { label: e.target.value })}
                    placeholder="Document name"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => onRemoveRequiredDoc(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </SettingsSection>
);

export const AdminUserForm: React.FC<{
  user?: {
    id: string;
    name: string;
    email: string;
    role: "Owner" | "Admin" | "Reviewer";
    isActive: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: { name: string; email: string; role: "Owner" | "Admin" | "Reviewer"; isActive: boolean }) => void; // FIXED typing
  isLoading?: boolean;
}> = ({ user, isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'Admin') as "Owner" | "Admin" | "Reviewer",
    isActive: user?.isActive ?? true
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const roleOptions = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Reviewer', label: 'Reviewer' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit Admin User' : 'Add Admin User'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} error={errors.name} placeholder="Enter full name" />
        <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} error={errors.email} placeholder="admin@university.edu.pk" />
        <Select label="Role" value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))} options={roleOptions} />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">User is active</label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" loading={isLoading}>{user ? 'Update User' : 'Add User'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export const AdminUsersList: React.FC<{
  users: Array<{ id: string; name: string; email: string; role: "Owner" | "Admin" | "Reviewer"; isActive: boolean; lastLogin?: string }>;
  onEdit: (user: { id: string; name: string; email: string; role: "Owner" | "Admin" | "Reviewer"; isActive: boolean; lastLogin?: string }) => void;
  onDelete: (userId: string) => void;
  onAdd: () => void;
}> = ({ users, onEdit, onDelete, onAdd }) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Owner': return 'error' as const;
      case 'Admin': return 'info' as const;
      case 'Reviewer': return 'default' as const;
      default: return 'default' as const;
    }
  };

  return (
    <SettingsSection title="Team & Access" description="Manage admin users and their permissions" icon={<Users className="w-5 h-5" />}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Admin User
          </Button>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--mint-100)] border border-[var(--pakistan-green-600)] flex items-center justify-center">
                  <span className="text-[var(--pakistan-green-600)] font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                  {user.lastLogin && (
                    <div className="text-xs text-slate-400">Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="No admin users"
            description="Add admin users to manage your university's applications."
            action={
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Admin User
              </Button>
            }
          />
        )}
      </div>
    </SettingsSection>
  );
};

export const SettingsSaveButton: React.FC<{ onSave: () => void; isLoading?: boolean; hasChanges?: boolean }> = ({
  onSave,
  isLoading = false,
  hasChanges = false
}) => (
  <div className="flex justify-end">
    <Button onClick={onSave} loading={isLoading} disabled={!hasChanges} icon={<Save className="w-4 h-4" />}>
      Save Changes
    </Button>
  </div>
);
