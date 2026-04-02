'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ScanResult {
    domain: string;
    ssl: boolean;
    headers: boolean;
    vulnerabilities: number;
}

export default function SecurityScanner() {
    const [domain, setDomain] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);

    const handleScan = async () => {
        if (!domain) return;
        setScanning(true);

        // Simulate scan
        await new Promise(r => setTimeout(r, 2000));

        setResult({
            domain,
            ssl: Math.random() > 0.3,
            headers: Math.random() > 0.5,
            vulnerabilities: Math.floor(Math.random() * 5),
        });

        setScanning(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Input Section */}
            <div className="mb-8">
                <label className="block text-sm font-semibold mb-4">Enter Domain to Scan</label>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        disabled={scanning}
                    />
                    <Button onClick={handleScan} disabled={scanning || !domain}>
                        {scanning ? 'Scanning...' : 'Scan'}
                    </Button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div
                    className="space-y-4"
                >
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-bold text-lg mb-4">Scan Results for {result.domain}</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <span className="font-medium">SSL Certificate</span>
                                {result.ssl ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <span className="font-medium">Security Headers</span>
                                {result.headers ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                <span className="font-medium">Vulnerabilities Found</span>
                                <span className={`font-bold ${result.vulnerabilities === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {result.vulnerabilities}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
