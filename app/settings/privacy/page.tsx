import { SettingsCard } from '@/components/settings/SettingsCard';
import { PrivacyControls } from '@/components/settings/PrivacyControls';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/security/auth/middleware';
import { getPrivacySettings } from '@/lib/services/settingsService';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
    const session = await auth();
    let settings = { profileVisibility: 'private' as const, showEmail: false, showActivity: false, allowTracking: false };

    try {
        if (session?.user?.id) {
            settings = await getPrivacySettings(session.user.id);
        }
    } catch (error) {
        console.error('Failed to fetch privacy settings:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Privacy</h1>
                <p className="text-muted-foreground">
                    Control your data and privacy preferences
                </p>
            </div>

            <SettingsCard title="Data sharing">
                <PrivacyControls initialSettings={settings} />
            </SettingsCard>

            <SettingsCard
                title="Export data"
                description="Download a copy of your personal data"
                variant="default"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You can request an archive of your profile, settings, and activity logs.
                    </p>
                    <Button variant="outline">Request data export</Button>
                </div>
            </SettingsCard>
        </div>
    );
}
