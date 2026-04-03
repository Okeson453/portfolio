'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="securestack-theme"
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}

// Re-export useTheme from next-themes
export function useTheme() {
    const theme = useNextTheme()

    return {
        theme: theme.theme,
        setTheme: theme.setTheme,
        resolvedTheme: theme.resolvedTheme,
        toggleTheme: () => theme.setTheme(theme.resolvedTheme === 'dark' ? 'light' : 'dark'),
        isDark: theme.resolvedTheme === 'dark',
        isLight: theme.resolvedTheme === 'light'
    }
}