'use client';

import { useCallback, useRef, useState } from 'react';

interface FileUploadOptions {
  accept?: string;
  maxSize?: number; // in bytes
  onSuccess?: (file: File, preview: string) => void;
  onError?: (error: string) => void;
}

interface UseFileUploadReturn {
  file: File | null;
  preview: string | null;
  upload: (file: File) => Promise<void>;
  clear: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

/**
 * Custom hook for file uploading with preview
 * Handles file validation and preview generation
 *
 * @param options - Configuration options
 * @returns Upload state and control methods
 *
 * @example
 * const { file, preview, upload, clear } = useFileUpload({
 *   accept: 'image/*',
 *   maxSize: 5 * 1024 * 1024, // 5MB
 * });
 */
export function useFileUpload(
  options: FileUploadOptions = {}
): UseFileUploadReturn {
  const {
    accept = '*/*',
    maxSize = 10 * 1024 * 1024, // 10MB default
    onSuccess,
    onError,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (uploadFile: File) => {
      try {
        // Validate file type
        if (accept !== '*/*' && !uploadFile.type.match(accept.replace(/\*/g, '.*'))) {
          throw new Error(`File type not accepted. Expected: ${accept}`);
        }

        // Validate file size
        if (uploadFile.size > maxSize) {
          throw new Error(
            `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
          );
        }

        setFile(uploadFile);

        // Generate preview for images
        if (uploadFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const previewUrl = e.target?.result as string;
            setPreview(previewUrl);
            onSuccess?.(uploadFile, previewUrl);
          };
          reader.readAsDataURL(uploadFile);
        } else {
          onSuccess?.(uploadFile, '');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onError?.(errorMessage);
      }
    },
    [accept, maxSize, onSuccess, onError]
  );

  const clear = useCallback(() => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return {
    file,
    preview,
    upload,
    clear,
    inputRef,
    isDragging,
    setIsDragging,
  };
}
