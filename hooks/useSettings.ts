import { useState, useCallback } from 'react';
import type { UserSettings } from '@/types';

interface UseSettingsReturn {
  settings: Partial<UserSettings>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  updateNotificationSetting: (type: 'email' | 'push', key: string, value: boolean) => Promise<void>;
  updatePrivacySetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => Promise<void>;
  isSaving: boolean;
  isUpdating: boolean;
}

export function useSettings(): UseSettingsReturn {
    const [settings, setSettings] = useState<Partial<UserSettings>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
        setIsSaving(true)
        try {
            setSettings(prev => ({ ...prev, ...newSettings }))
        } finally {
            setIsSaving(false)
        }
    }, [])

    const updateNotificationSetting = useCallback(
        async (type: 'email' | 'push', key: string, value: boolean) => {
            setIsUpdating(true)
            try {
                setSettings(prev => ({
                    ...prev,
                    [`${type}_${key}`]: value,
                }))
            } finally {
                setIsUpdating(false)
            }
        },
        []
    )

    const updatePrivacySetting = useCallback(async <K extends keyof UserSettings>(
        key: K,
        value: UserSettings[K]
    ) => {
        setIsUpdating(true)
        try {
            setSettings(prev => ({
                ...prev,
                [key]: value,
            }))
        } finally {
            setIsUpdating(false)
        }
    }, [])

    return {
        settings,
        updateSettings,
        updateNotificationSetting,
        updatePrivacySetting,
        isSaving,
        isUpdating,
    }
}
