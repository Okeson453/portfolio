// # Profile settings (avatar, name, email)
import { ProfileForm } from '@/components/settings/ProfileForm';
import { AvatarUpload } from '@/components/settings/AvatarUpload';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { Suspense } from 'react';

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your public profile information
        </p>
      </div>

      <SettingsCard title="Avatar" description="Update your profile picture">
        <Suspense fallback={<div>Loading avatar...</div>}>
          <AvatarUpload />
        </Suspense>
      </SettingsCard>

      <SettingsCard
        title="Personal Information"
        description="Update your name and email address"
      >
        <ProfileForm />
      </SettingsCard>

      <SettingsCard
        title="Danger Zone"
        description="Irreversible account actions"
        variant="destructive"
      >
        {/* DangerZone component placed here or as separate card */}
        <div className="space-y-4">
          <p className="text-sm text-destructive">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
            Delete account
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}