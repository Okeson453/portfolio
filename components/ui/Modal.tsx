'use client';

import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { createFocusTrap } from '@/lib/client/focusTrap';
import { lockScroll, unlockScroll } from '@/lib/client/scrollLock';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeButton = true,
  onOpenChange,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<any>(null);

  // Size mappings
  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
  };

  useEffect(() => {
    if (isOpen) {
      lockScroll();
      if (contentRef.current) {
        focusTrapRef.current = createFocusTrap(contentRef.current);
      }
    } else {
      unlockScroll();
      focusTrapRef.current?.destroy();
    }

    return () => {
      if (isOpen) {
        unlockScroll();
        focusTrapRef.current?.destroy();
      }
    };
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    if (!open) onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                ref={contentRef}
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
                  'rounded-lg border border-border bg-background shadow-lg',
                  sizeClasses[size]
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="border-b border-border px-6 py-4">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="text-sm text-muted-foreground">
                      {description}
                    </Dialog.Description>
                  )}
                </div>

                {/* Body */}
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-4">
                  {children}
                </div>

                {/* Close button */}
                {closeButton && (
                  <Dialog.Close asChild>
                    <button
                      className={cn(
                        'absolute right-4 top-4 rounded-md',
                        'text-muted-foreground hover:bg-muted hover:text-foreground',
                        'transition-colors p-1'
                      )}
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                )}
              </motion.div>
            </Dialog.Content>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
