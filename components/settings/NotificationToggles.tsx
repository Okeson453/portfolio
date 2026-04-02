'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { useSettings } from '@/hooks/useSettings';

interface NotificationTogglesProps {
    type: 'email' | 'push';
    initialSettings: Record<string, boolean>;
}

export function NotificationToggles({ type, initialSettings }: NotificationTogglesProps) {
    const { updateNotificationSetting, isUpdating } = useSettings();
    const [settings, setSettings] = useState(initialSettings);

    const handleToggle = async (key: string, checked: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: checked }));
        await updateNotificationSetting(type, key, checked);
    };

    const notifications = [
        { key: 'security_alerts', label: 'Security alerts', description: 'Suspicious login attempts, password changes' },
        { key: 'new_devices', label: 'New device logins', description: 'When a new device accesses your account' },
        { key: 'marketing', label: 'Marketing updates', description: 'Product updates, features, and offers' },
        { key: 'comments', label: 'Comments and replies', description: 'Someone replies to your activity' },
    ];

    return (
        <div className="space-y-4">
            {notifications.map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor={`${type}-${key}`} className="text-sm font-medium">
                            {label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Switch
                        id={`${type}-${key}`}
                        checked={settings[key] || false}
                        onCheckedChange={(checked) => handleToggle(key, checked)}
                        disabled={isUpdating}
                    />
                </div>
            ))}
        </div>
    );
}
