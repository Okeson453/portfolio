'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { label: 'Security Logs', href: '/admin/logs', icon: Settings },
    const pathname = usePathname();

return (
    <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 border-r border-cyber-blue/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-cyber-green">Admin</h1>
                <p className="text-xs text-slate-400">SecureStack</p>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className={`w-full justify-start gap-2 ${isActive
                                    ? 'bg-cyan-500/20 text-cyber-blue'
                                    : 'text-slate-400 hover:text-cyber-green'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300"
                    onClick={() => {
                        fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                            window.location.href = '/';
                        });
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
            <div className="sticky top-0 border-b border-cyber-blue/20 bg-slate-900/80 backdrop-blur px-8 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Admin Dashboard
                    </h2>
                </div>
            </div>

            <div className="p-8">{children}</div>
        </main>
    </div>
);
}
