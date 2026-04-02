'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for command palette state management
 * Integrates with cmdk library for keyboard navigation
 *
 * @returns Command palette state and control methods
 *
 * @example
 * const { isOpen, open, close } = useCommandPalette();
 * return (
 *   <>
 *     <CommandPalette isOpen={isOpen} onClose={close} />
 *   </>
 * );
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // ESC to close
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    searchQuery,
    setSearchQuery,
  };
}
