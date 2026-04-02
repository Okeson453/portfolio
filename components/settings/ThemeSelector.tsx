'use client';

import { useTheme } from '@/hooks/useTheme';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
];

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-4"
        >
            {themes.map(({ value, label, icon }) => (
                <div key={value}>
                    <RadioGroupItem
                        value={value}
                        id={`theme-${value}`}
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor={`theme-${value}`}
                        className={cn(
                            'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-colors',
                            theme === value && 'border-primary'
                        )}
                    >
                        <span className="text-2xl">{icon}</span>
                        <span className="text-sm font-medium">{label}</span>
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}
