import { SettingsCard } from '@/components/settings/SettingsCard';
import { PasswordChange } from '@/components/settings/PasswordChange';
import { TwoFactorStatus } from '@/components/settings/TwoFactorSetup';
import { auth } from '@/lib/security/auth/middleware';
import { getUserSecurityInfo } from '@/lib/services/securityService';

export const dynamic = 'force-dynamic';

export default async function SecurityOverviewPage() {
    const session = await auth();
    let securityInfo = { twoFactorEnabled: false };

    try {
        if (session?.user?.id) {
            securityInfo = await getUserSecurityInfo(session.user.id);
        }
    } catch (error) {
        console.error('Failed to fetch security info:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Security</h1>
                <p className="text-muted-foreground">
                    Manage your account security settings
                </p>
            </div>

            <SettingsCard title="Password" description="Change your password">
                <PasswordChange />
            </SettingsCard>

            <SettingsCard
                title="Two-factor authentication"
                description="Add an extra layer of security to your account"
            >
                <TwoFactorStatus enabled={securityInfo.twoFactorEnabled} />
            </SettingsCard>
        </div>
    );
}
