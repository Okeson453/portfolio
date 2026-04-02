import { SettingsCard } from '@/components/settings/SettingsCard';
import { ThemeSelector } from '@/components/settings/ThemeSelector';

export default function AppearancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Appearance</h1>
                <p className="text-muted-foreground">
                    Customize the look and feel of your dashboard
                </p>
            </div>

            <SettingsCard title="Theme" description="Select your preferred theme">
                <ThemeSelector />
            </SettingsCard>
        </div>
    );
}
