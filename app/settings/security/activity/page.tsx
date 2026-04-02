import { SettingsCard } from '@/components/settings/SettingsCard';
import { SecurityActivityLog } from '@/components/settings/SecurityActivityLog';
import { auth } from '@/lib/security/auth/middleware';
import { getSecurityActivity } from '@/lib/services/securityService';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
    const session = await auth();
    let activities = [];

    try {
        if (session?.user?.id) {
            activities = await getSecurityActivity(session.user.id, 50);
        }
    } catch (error) {
        console.error('Failed to fetch activities:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Activity log</h1>
                <p className="text-muted-foreground">
                    Review recent security events on your account
                </p>
            </div>

            <SettingsCard>
                <SecurityActivityLog activities={activities} />
            </SettingsCard>
        </div>
    );
}
