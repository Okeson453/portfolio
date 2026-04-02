'use client';

import { useState } from 'react';
import { Smartphone, Laptop, Monitor, Tablet, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { formatDistanceToNow } from 'date-fns';

interface Device {
    id: string;
    name: string;
    type: 'mobile' | 'tablet' | 'desktop' | 'laptop' | 'other';
    browser: string;
    os: string;
    ip: string;
    lastActive: string;
    isCurrent: boolean;
}

interface DeviceListProps {
    devices: Device[];
}

const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
    laptop: Laptop,
    other: Monitor,
};

export function DeviceList({ devices }: DeviceListProps) {
    const [deviceList, setDeviceList] = useState(devices);

    const handleRevoke = async (deviceId: string) => {
        // API call to revoke device
        setDeviceList((prev) => prev.filter((d) => d.id !== deviceId));
    };

    return (
        <div className="divide-y">
            {deviceList.map((device) => {
                const Icon = deviceIcons[device.type];
                return (
                    <div key={device.id} className="flex items-center justify-between py-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-md border bg-muted/50 p-2">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{device.name}</p>
                                    {device.isCurrent && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {device.browser} on {device.os} • {device.ip}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Last active {formatDistanceToNow(new Date(device.lastActive), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {!device.isCurrent && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleRevoke(device.id)}
                                    >
                                        Revoke access
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
