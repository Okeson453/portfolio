'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';

interface TwoFactorSetupProps {
    enabled: boolean;
    secret?: string;
    qrCode?: string;
}

export function TwoFactorSetup({ enabled, secret, qrCode }: TwoFactorSetupProps) {
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [step, setStep] = useState<'disabled' | 'setup' | 'verify'>(
        enabled ? 'verify' : 'disabled'
    );
    const [verificationCode, setVerificationCode] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);

    const enable2FA = async () => {
        // Mock implementation
        return true;
    };

    const disable2FA = async () => {
        // Mock implementation
        return true;
    };

    const verify2FA = async (code: string): Promise<boolean> => {
        // Mock implementation - in production verify with API
        return code.length === 6;
    };

    const generateBackupCodes = async (): Promise<string[]> => {
        // Mock implementation - replace with actual API call
        return Array.from({ length: 8 }, () =>
            Math.random().toString(36).substring(2, 10).toUpperCase()
        );
    };

    const handleEnable = async () => {
        const result = await enable2FA();
        if (result) {
            setStep('setup');
        }
    };

    const handleVerify = async () => {
        const success = await verify2FA(verificationCode);
        if (success) {
            const codes = await generateBackupCodes();
            setBackupCodes(codes);
            setIsEnabled(true);
            setStep('verify');
        }
    };

    const handleDisable = async () => {
        await disable2FA();
        setIsEnabled(false);
        setStep('disabled');
    };

    if (step === 'setup') {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    {qrCode && (
                        <div className="flex-shrink-0">
                            <Image src={qrCode} alt="QR Code" width={160} height={160} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Scan this QR code with your authenticator app</p>
                        <p className="text-xs text-muted-foreground">
                            Can't scan? Use this secret key instead:
                        </p>
                        <code className="rounded bg-muted px-2 py-1 text-xs">{secret}</code>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                        Verification code
                    </label>
                    <Input
                        id="code"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="w-32"
                    />
                    <Button onClick={handleVerify} className="mt-2">
                        Verify and enable
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 'verify' && isEnabled) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Two-factor authentication is enabled</p>
                        <p className="text-sm text-muted-foreground">
                            Your account is more secure
                        </p>
                    </div>
                    <Switch checked={isEnabled} onCheckedChange={handleDisable} />
                </div>

                {backupCodes.length > 0 && (
                    <div className="rounded-md border bg-muted/50 p-4">
                        <p className="mb-2 text-sm font-medium">Backup codes</p>
                        <p className="text-xs text-muted-foreground">
                            Save these codes in a safe place. You can use them to access your account if you lose your device.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {backupCodes.map((code) => (
                                <code key={code} className="rounded bg-background px-2 py-1 text-xs">
                                    {code}
                                </code>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Disabled state
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">Two-factor authentication is disabled</p>
                <p className="text-sm text-muted-foreground">
                    Protect your account with an extra layer of security
                </p>
            </div>
            <Button onClick={handleEnable}>Enable 2FA</Button>
        </div>
    );
}

// Re-export for convenience
export const TwoFactorStatus = TwoFactorSetup;
