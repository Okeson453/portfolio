import { useState, useCallback } from 'react'

interface User {
    id?: string
    email?: string
    name?: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = useCallback(async (email: string, _password: string) => {
        setIsLoading(true)
        try {
            // Stub implementation - just set minimal user data
            setUser({ email })
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        setIsLoading(true)
        try {
            // Stub implementation - in real app would validate current password and set new one
            if (!currentPassword || !newPassword) {
                throw new Error('Both passwords are required')
            }
            // Password change successful
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        user,
        login,
        logout,
        changePassword,
        isLoading,
    }
}
