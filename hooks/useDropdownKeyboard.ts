import { useRef, useEffect } from 'react';

interface UseDropdownKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  itemCount: number;
}

/**
 * Hook to manage WAI-ARIA keyboard navigation for dropdown menus
 * Supports: ArrowUp/Down, Home/End, Escape, Tab
 * 
 * @example
 * const { focusedIndex, handleKeyDown } = useDropdownKeyboard({
 *   isOpen,
 *   onClose,
 *   onOpen,
 *   triggerRef,
 *   itemCount: items.length
 * });
 */
export function useDropdownKeyboard({
  isOpen,
  onClose,
  onOpen,
  triggerRef,
  itemCount,
}: UseDropdownKeyboardProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusedIndexRef = useRef<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      // If closed, ArrowDown opens the menu
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onOpen();
      }
      return;
    }

    const { key } = e;

    switch (key) {
      case 'ArrowDown': {
        e.preventDefault();
        focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, itemCount - 1);
        itemRefs.current[focusedIndexRef.current]?.focus();
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
        itemRefs.current[focusedIndexRef.current]?.focus();
        break;
      }

      case 'Home': {
        e.preventDefault();
        focusedIndexRef.current = 0;
        itemRefs.current[0]?.focus();
        break;
      }

      case 'End': {
        e.preventDefault();
        focusedIndexRef.current = itemCount - 1;
        itemRefs.current[itemCount - 1]?.focus();
        break;
      }

      case 'Escape': {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
        focusedIndexRef.current = -1;
        break;
      }

      case 'Tab': {
        // Tab closes menu and moves focus naturally
        onClose();
        focusedIndexRef.current = -1;
        break;
      }
    }
  };

  // Reset focused index when menu opens
  useEffect(() => {
    if (isOpen) {
      focusedIndexRef.current = -1;
    }
  }, [isOpen]);

  return {
    itemRefs,
    handleKeyDown,
    focusedIndex: focusedIndexRef.current,
  };
}
