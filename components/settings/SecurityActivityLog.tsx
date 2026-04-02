'use client';

import { format } from 'date-fns';
import { Shield, LogIn, Key, Smartphone, AlertTriangle } from 'lucide-react';

interface Activity {
    id: string;
    type: 'login' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'device_revoked' | 'security_alert';
    description: string;
    ip: string;
    location?: string;
    timestamp: string;
}

interface SecurityActivityLogProps {
    activities: Activity[];
}

const activityIcons = {
    login: LogIn,
    password_change: Key,
    '2fa_enabled': Shield,
    '2fa_disabled': Shield,
    device_revoked: Smartphone,
    security_alert: AlertTriangle,
};

export function SecurityActivityLog({ activities }: SecurityActivityLogProps) {
    return (
        <div className="space-y-4">
            {activities.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                    No security activity recorded yet
                </p>
            ) : (
                <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-px bg-border" />
                    <div className="space-y-6">
                        {activities.map((activity) => {
                            const Icon = activityIcons[activity.type] || Shield;
                            return (
                                <div key={activity.id} className="relative flex items-start gap-4 pl-10">
                                    <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{activity.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{format(new Date(activity.timestamp), 'PPP p')}</span>
                                            <span>•</span>
                                            <span>IP: {activity.ip}</span>
                                            {activity.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{activity.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
