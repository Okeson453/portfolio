import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setThemeState] = useState<string>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get initial theme from localStorage or system preference
        const stored = localStorage.getItem('theme');
        if (stored) {
            setThemeState(stored);
        }
    }, []);

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);

        // Update document theme
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            // system
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    return { theme: mounted ? theme : 'system', setTheme };
}
