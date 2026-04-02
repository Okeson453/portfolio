'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    User,
    Palette,
    Shield,
    Bell,
    Lock,
    History,
    Smartphone,
    KeyRound,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navItems = [
    { href: '/settings/profile', label: 'Profile', icon: User },
    { href: '/settings/appearance', label: 'Appearance', icon: Palette },
    {
        href: '/settings/security',
        label: 'Security',
        icon: Shield,
        children: [
            { href: '/settings/security/two-factor', label: 'Two-factor authentication', icon: KeyRound },
            { href: '/settings/security/devices', label: 'Devices', icon: Smartphone },
            { href: '/settings/security/activity', label: 'Activity log', icon: History },
        ],
    },
    { href: '/settings/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings/privacy', label: 'Privacy', icon: Lock },
];

export function SettingsSidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    const handleLogout = useCallback(() => {
        // Clear auth cookie and redirect
        fetch('/api/auth/logout').then(() => {
            window.location.href = '/login';
        });
    }, []);

    return (
        <aside className="sticky top-0 h-screen w-72 border-r bg-background p-6">
            <div className="flex h-full flex-col">
                <div className="space-y-1">
                    <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight">Settings</h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const hasChildren = item.children && item.children.length > 0;

                            return (
                                <div key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => onNavigate?.()}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                    {hasChildren && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => onNavigate?.()}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                                        pathname === child.href
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-muted'
                                                    )}
                                                >
                                                    <child.icon className="h-4 w-4" />
                                                    <span>{child.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto pt-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
