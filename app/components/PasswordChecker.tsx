'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Check, X } from 'lucide-react';

interface PasswordScore {
    score: number;
    label: string;
    color: string;
}

const getPasswordScore = (password: string): PasswordScore => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 16) score++;

    const scores: Record<number, PasswordScore> = {
        0: { score: 0, label: 'Very Weak', color: 'bg-red-500' },
        1: { score: 1, label: 'Weak', color: 'bg-orange-500' },
        2: { score: 2, label: 'Fair', color: 'bg-yellow-500' },
        3: { score: 3, label: 'Good', color: 'bg-blue-500' },
        4: { score: 4, label: 'Strong', color: 'bg-green-500' },
        5: { score: 5, label: 'Very Strong', color: 'bg-emerald-500' },
    };

    return scores[score] || scores[0];
};

export default function PasswordChecker() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const score = getPasswordScore(password);

    const checks = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains uppercase letters', met: /[A-Z]/.test(password) },
        { label: 'Contains numbers', met: /[0-9]/.test(password) },
        { label: 'Contains special characters', met: /[^A-Za-z0-9]/.test(password) },
        { label: '16+ characters (bonus)', met: password.length >= 16 },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Input */}
            <div>
                <label className="block text-sm font-semibold mb-4">Test Password Strength</label>
                <div className="relative mb-6">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a password..."
                        className="pr-12"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>

                {/* Score bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strength:</span>
                        <span className={`text-sm font-bold ${score.color.replace('bg-', 'text-')}`}>{score.label}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${score.color} transition-all duration-300 ease-out`}
                            style={{ width: `${(score.score / 5) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Checklist */}
            <div>
                <label className="block text-sm font-semibold mb-4">Requirements</label>
                <div className="space-y-3">
                    {checks.map((check, index) => (
                        <div
                            key={index}
                            data-index={index}
                            className="animate-slideRight flex items-center gap-3"
                        >
                            {check.met ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <X className="w-5 h-5 text-gray-300" />
                            )}
                            <span className={`text-sm ${check.met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {check.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
