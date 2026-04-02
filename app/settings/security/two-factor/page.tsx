import { SettingsCard } from '@/components/settings/SettingsCard';
import { TwoFactorSetup } from '@/components/settings/TwoFactorSetup';
import { auth } from '@/lib/security/auth/middleware';
import { getTwoFactorStatus } from '@/lib/services/securityService';

export const dynamic = 'force-dynamic';

export default async function TwoFactorPage() {
    const session = await auth();
    let twoFactorData = { enabled: false, secret: '', qrCode: '' };

    try {
        if (session?.user?.id) {
            twoFactorData = await getTwoFactorStatus(session.user.id);
        }
    } catch (error) {
        console.error('Failed to fetch 2FA status:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Two-factor authentication</h1>
                <p className="text-muted-foreground">
                    Add an extra layer of security to your account
                </p>
            </div>

            <SettingsCard>
                <TwoFactorSetup
                    enabled={twoFactorData.enabled}
                    secret={twoFactorData.secret}
                    qrCode={twoFactorData.qrCode}
                />
            </SettingsCard>
        </div>
    );
}
