import { useCallback } from 'react'
import toast from 'react-hot-toast'

interface ToastOptions {
    title?: string
    description: string
    variant?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export function useToast() {
    const showToast = useCallback(
        ({
            title,
            description,
            variant = 'info',
            duration = 4000,
        }: ToastOptions) => {
            const message = title ? `${title}: ${description}` : description

            switch (variant) {
                case 'success':
                    return toast.success(message, { duration })
                case 'error':
                    return toast.error(message, { duration })
                case 'warning':
                    return toast(message, {
                        duration,
                        style: {
                            background: '#fef3c7',
                            color: '#92400e'
                        }
                    })
                case 'info':
                default:
                    return toast(message, { duration })
            }
        },
        []
    )

    return {
        toast: showToast,
    }
}
