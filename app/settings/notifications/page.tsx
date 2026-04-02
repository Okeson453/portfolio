import { SettingsCard } from '@/components/settings/SettingsCard';
import { NotificationToggles } from '@/components/settings/NotificationToggles';
import { auth } from '@/lib/security/auth/middleware';
import { getNotificationSettings } from '@/lib/services/settingsService';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const session = await auth();
    let settings = { email: {}, push: {} };

    try {
        if (session?.user?.id) {
            settings = await getNotificationSettings(session.user.id);
        }
    } catch (error) {
        console.error('Failed to fetch notification settings:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                    Configure how you receive notifications
                </p>
            </div>

            <SettingsCard title="Email notifications">
                <NotificationToggles
                    type="email"
                    initialSettings={settings.email}
                />
            </SettingsCard>

            <SettingsCard title="Push notifications">
                <NotificationToggles
                    type="push"
                    initialSettings={settings.push}
                />
            </SettingsCard>
        </div>
    );
}
