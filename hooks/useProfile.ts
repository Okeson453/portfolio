import { useState, useCallback } from 'react'

interface Profile {
    id?: string
    name: string
    email: string
    avatar?: string
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const uploadAvatar = useCallback(async (file: File) => {
        setIsLoading(true)
        try {
            // Stub implementation
            const reader = new FileReader()
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string
                setProfile(prev => prev ? { ...prev, avatar: dataUrl } : null)
            }
            reader.readAsDataURL(file)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateProfile = useCallback(
        async (data: Partial<Profile>) => {
            setIsUpdating(true)
            try {
                // Stub implementation - in real app would call an API
                setProfile(prev => prev ? { ...prev, ...data } : null)
            } finally {
                setIsUpdating(false)
            }
        },
        []
    )

    return {
        profile,
        uploadAvatar,
        updateProfile,
        isUploading: isLoading,
        isUpdating,
    }
}
