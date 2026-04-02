'use client';

import { useState, useCallback, useEffect } from 'react';
import type { DragReorderItem } from '@/types';

interface UseDragReorderReturn<T extends DragReorderItem> {
  items: T[];
  setItems: (items: T[]) => void;
  reorderItems: (fromIndex: number, toIndex: number) => T[];
  resetItems: () => void;
}

/**
 * Custom hook for drag-and-drop reordering
 * Manages item reordering with optimistic updates
 *
 * @param initialItems - Starting list of items
 * @returns Reorder state and control methods
 *
 * @example
 * const { items, reorderItems } = useDragReorder(initialItems);
 * const handleDragEnd = (event) => {
 *   const { active, over } = event;
 *   if (over) {
 *     const fromIndex = items.findIndex(i => i.id === active.id);
 *     const toIndex = items.findIndex(i => i.id === over.id);
 *     reorderItems(fromIndex, toIndex);
 *   }
 * };
 */
export function useDragReorder<T extends DragReorderItem>(
  initialItems: T[]
): UseDragReorderReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const reorderItems = useCallback(
    (fromIndex: number, toIndex: number): T[] => {
      const newItems = [...items];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      setItems(newItems);
      return newItems;
    },
    [items]
  );

  const resetItems = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    setItems,
    reorderItems,
    resetItems,
  };
}
