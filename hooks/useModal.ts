'use client';

import { useState, useCallback } from 'react';

interface UseModalReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

/**
 * Custom hook for managing modal open/close state
 * Provides convenient methods for modal control
 *
 * @param initialOpen - Whether modal should be open initially (default: false)
 * @returns Modal state and control methods
 *
 * @example
 * const modal = useModal();
 * return (
 *   <>
 *     <button onClick={modal.open}>Open Modal</button>
 *     {modal.isOpen && <Modal onClose={modal.close} />}
 *   </>
 * );
 */
export function useModal(initialOpen: boolean = false): UseModalReturn {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}
