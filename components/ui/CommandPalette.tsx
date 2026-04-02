'use client';

import React, { useState, useEffect } from 'react';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { COMMANDS, getCommandsByCategory } from '@/lib/constants/commands';
import { useCommandPalette } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export function CommandPalette() {
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const { isOpen, close, searchQuery, setSearchQuery } = useCommandPalette();
    const [filteredCommands, setFilteredCommands] = useState(COMMANDS);

    // Filter commands based on search
    useEffect(() => {
        if (!searchQuery) {
            setFilteredCommands(COMMANDS);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            setFilteredCommands(
                COMMANDS.filter(
                    (cmd) =>
                        cmd.name.toLowerCase().includes(lowerQuery) ||
                        cmd.description?.toLowerCase().includes(lowerQuery) ||
                        cmd.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery))
                )
            );
        }
    }, [searchQuery]);

    const handleSelectCommand = (commandId: string) => {
        const command = COMMANDS.find((c) => c.id === commandId);
        if (!command) return;

        // Handle theme toggle
        if (commandId === 'theme-toggle') {
            setTheme(theme === 'dark' ? 'light' : 'dark');
        } else if (command.href) {
            router.push(command.href);
        } else if (command.action) {
            command.action();
        }

        close();
    };

    const navigationCommands = getCommandsByCategory('navigation');
    const actionCommands = getCommandsByCategory('action');
    const settingsCommands = getCommandsByCategory('settings');

    return (
        <CommandDialog open={isOpen} onOpenChange={close}>
            <CommandInput
                placeholder="Search commands..."
                value={searchQuery}
                onValueChange={setSearchQuery}
            />
            <CommandList>
                <CommandEmpty>No commands found.</CommandEmpty>

                {filteredCommands.length > 0 && (
                    <>
                        {navigationCommands.length > 0 && (
                            <>
                                <CommandGroup heading="Navigation">
                                    {navigationCommands
                                        .filter((cmd) =>
                                            searchQuery
                                                ? filteredCommands.find((fc) => fc.id === cmd.id)
                                                : true
                                        )
                                        .map((command) => (
                                            <CommandItem
                                                key={command.id}
                                                onSelect={() => handleSelectCommand(command.id)}
                                                className="cursor-pointer"
                                            >
                                                <span>{command.name}</span>
                                                {command.description && (
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {command.description}
                                                    </span>
                                                )}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                                <CommandSeparator />
                            </>
                        )}

                        {actionCommands.length > 0 && (
                            <>
                                <CommandGroup heading="Actions">
                                    {actionCommands
                                        .filter((cmd) =>
                                            searchQuery
                                                ? filteredCommands.find((fc) => fc.id === cmd.id)
                                                : true
                                        )
                                        .map((command) => (
                                            <CommandItem
                                                key={command.id}
                                                onSelect={() => handleSelectCommand(command.id)}
                                                className="cursor-pointer"
                                            >
                                                <span>{command.name}</span>
                                                {command.description && (
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {command.description}
                                                    </span>
                                                )}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                                <CommandSeparator />
                            </>
                        )}

                        {settingsCommands.length > 0 && (
                            <CommandGroup heading="Settings">
                                {settingsCommands
                                    .filter((cmd) =>
                                        searchQuery
                                            ? filteredCommands.find((fc) => fc.id === cmd.id)
                                            : true
                                    )
                                    .map((command) => (
                                        <CommandItem
                                            key={command.id}
                                            onSelect={() => handleSelectCommand(command.id)}
                                            className="cursor-pointer"
                                        >
                                            <span>{command.name}</span>
                                            {command.description && (
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {command.description}
                                                </span>
                                            )}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        )}
                    </>
                )}
            </CommandList>
            <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-2 py-1">Cmd+K</kbd> to
                toggle
            </div>
        </CommandDialog>
    );
}
