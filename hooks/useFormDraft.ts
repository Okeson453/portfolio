'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseFormDraftOptions {
    key: string;
    delay?: number;
    storage?: 'localStorage' | 'indexeddb';
}

/**
 * Custom hook for auto-saving form drafts
 * Persists form data to client storage and restores on mount
 *
 * @param initialData - Initial form data
 * @param options - Configuration options
 * @returns Draft data, save function, and clear function
 *
 * @example
 * const { data, saveDraft, clearDraft } = useFormDraft(
 *   { title: '', content: '' },
 *   { key: 'blog-editor' }
 * );
 *
 * useEffect(() => {
 *   saveDraft(formData);
 * }, [formData]);
 */
export function useFormDraft<T extends Record<string, any>>(
    initialData: T,
    options: UseFormDraftOptions
) {
    const { key, delay = 1000, storage = 'localStorage' } = options;
    const [data, setData] = useState<T>(initialData);
    const [isDirty, setIsDirty] = useState(false);
    const saveTimeoutRef = React.useRef<NodeJS.Timeout>();

    // Restore draft on mount
    useEffect(() => {
        const restoreDraft = async () => {
            try {
                if (storage === 'localStorage') {
                    const stored = localStorage.getItem(`draft-${key}`);
                    if (stored) {
                        setData(JSON.parse(stored));
                    }
                } else if (storage === 'indexeddb') {
                    // This would require IndexedDB wrapper
                    console.warn('IndexedDB draft restore not yet implemented');
                }
            } catch (error) {
                console.error('Error restoring draft:', error);
            }
        };

        restoreDraft();
    }, [key, storage]);

    const saveDraft = useCallback(
        (newData: T) => {
            setData(newData);
            setIsDirty(true);

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                try {
                    if (storage === 'localStorage') {
                        localStorage.setItem(`draft-${key}`, JSON.stringify(newData));
                    }
                    setIsDirty(false);
                } catch (error) {
                    console.error('Error saving draft:', error);
                }
            }, delay);
        },
        [key, storage, delay]
    );

    const clearDraft = useCallback(() => {
        setData(initialData);
        setIsDirty(false);

        if (storage === 'localStorage') {
            localStorage.removeItem(`draft-${key}`);
        }
    }, [initialData, key, storage]);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        data,
        isDirty,
        saveDraft,
        clearDraft,
    };
}

import React from 'react';
