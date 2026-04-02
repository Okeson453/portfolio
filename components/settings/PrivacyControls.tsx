'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { useSettings } from '@/hooks/useSettings';

interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showActivity: boolean;
    allowTracking: boolean;
}

interface PrivacyControlsProps {
    initialSettings: PrivacySettings;
}

export function PrivacyControls({ initialSettings }: PrivacyControlsProps) {
    const { updatePrivacySetting, isUpdating } = useSettings();
    const [settings, setSettings] = useState(initialSettings);

    const handleSwitchChange = async (key: keyof PrivacySettings, checked: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: checked }));
        await updatePrivacySetting(key, checked);
    };

    const handleProfileVisibility = async (value: PrivacySettings['profileVisibility']) => {
        setSettings((prev) => ({ ...prev, profileVisibility: value }));
        await updatePrivacySetting('profileVisibility', value);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="profile-visibility" className="text-sm font-medium">
                    Profile visibility
                </Label>
                <Select
                    value={settings.profileVisibility}
                    onValueChange={handleProfileVisibility}
                    disabled={isUpdating}
                >
                    <SelectTrigger id="profile-visibility" className="w-full sm:w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public - visible to everyone</SelectItem>
                        <SelectItem value="contacts">Contacts only</SelectItem>
                        <SelectItem value="private">Private - only me</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="show-email" className="text-sm font-medium">
                            Show email address
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Display your email on your public profile
                        </p>
                    </div>
                    <Switch
                        id="show-email"
                        checked={settings.showEmail}
                        onCheckedChange={(checked) => handleSwitchChange('showEmail', checked)}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="show-activity" className="text-sm font-medium">
                            Show recent activity
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Display your security contributions and badges
                        </p>
                    </div>
                    <Switch
                        id="show-activity"
                        checked={settings.showActivity}
                        onCheckedChange={(checked) => handleSwitchChange('showActivity', checked)}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="allow-tracking" className="text-sm font-medium">
                            Allow usage analytics
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Help us improve by sending anonymous usage data
                        </p>
                    </div>
                    <Switch
                        id="allow-tracking"
                        checked={settings.allowTracking}
                        onCheckedChange={(checked) => handleSwitchChange('allowTracking', checked)}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
}
