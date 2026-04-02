'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'SecureStack Portfolio',
    siteDescription: 'Cybersecurity & Fullstack Developer Portfolio',
    contactEmail: 'contact@securestack.local',
    enableComments: true,
    enableSearch: true,
    enableAnalytics: true,
    maintenanceMode: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name as any] : value,
    }));
  };

  const handleSave = async () => {
    try {
      // Mock save
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Configure site-wide settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Site Settings */}
        <div className="rounded-lg border border-cyber-blue/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Site Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-cyber-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Site Description
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-cyber-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-cyber-green focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="rounded-lg border border-cyber-blue/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Features</h2>
          <div className="space-y-4">
            {[
              { key: 'enableComments', label: 'Enable Comments' },
              { key: 'enableSearch', label: 'Enable Search' },
              { key: 'enableAnalytics', label: 'Enable Analytics' },
              { key: 'maintenanceMode', label: 'Maintenance Mode' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={settings[key as any]}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-cyber-green focus:ring-cyber-green"
                />
                <span className="text-sm font-medium text-slate-300">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="gap-2 bg-cyber-green hover:bg-cyber-green/90 text-black font-semibold"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
