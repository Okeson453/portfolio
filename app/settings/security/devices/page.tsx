import { SettingsCard } from '@/components/settings/SettingsCard';
import { DeviceList } from '@/components/settings/DeviceList';
import { auth } from '@/lib/security/auth/middleware';
import { getUserDevices } from '@/lib/services/securityService';

export const dynamic = 'force-dynamic';

export default async function DevicesPage() {
    const session = await auth();
    let devices = [];

    try {
        if (session?.user?.id) {
            devices = await getUserDevices(session.user.id);
        }
    } catch (error) {
        console.error('Failed to fetch devices:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Devices</h1>
                <p className="text-muted-foreground">
                    Manage devices that have access to your account
                </p>
            </div>

            <SettingsCard>
                <DeviceList devices={devices} />
            </SettingsCard>
        </div>
    );
}
