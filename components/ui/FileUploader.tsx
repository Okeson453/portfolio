'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '@/hooks';
import { Upload, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    onFileSelect: (file: File, preview?: string) => void;
    onError?: (error: string) => void;
}

export function FileUploader({
    accept = '*/*',
    maxSize = 10 * 1024 * 1024,
    multiple = false,
    onFileSelect,
    onError,
}: FileUploaderProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { file, preview, upload, clear, isDragging, setIsDragging } = useFileUpload({
        accept,
        maxSize,
        onSuccess: (selectedFile, previewUrl) => {
            onFileSelect(selectedFile, previewUrl);
            setIsLoading(false);
        },
        onError: (errorMsg) => {
            setError(errorMsg);
            onError?.(errorMsg);
            setIsLoading(false);
        },
    });

    const handleDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setIsDragging(false);
            if (acceptedFiles.length === 0) return;

            setIsLoading(true);
            setError(null);
            await upload(acceptedFiles[0]);
        },
        [upload, setIsDragging]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept:
            accept === '*/*'
                ? undefined
                : {
                    [accept]: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                },
        maxSize,
        multiple: false,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false),
    });

    return (
        <div className="space-y-4">
            {/* Upload zone */}
            {!file && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'rounded-lg border-2 border-dashed p-8 text-center',
                        'transition-colors cursor-pointer',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="font-medium">Drag and drop your file here</p>
                            <p className="text-sm text-muted-foreground">
                                or click to browse ({Math.round(maxSize / 1024 / 1024)}MB max)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* File preview */}
            {file && (
                <div className="space-y-3">
                    {preview && (
                        <div className="flex justify-center">
                            <img src={preview} alt="Preview" className="h-48 w-48 rounded-lg object-cover" />
                        </div>
                    )}

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {Math.round(file.size / 1024)}KB
                            </p>
                        </div>

                        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                        {!isLoading && error && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {!isLoading && !error && !preview && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}

                        {!isLoading && (
                            <button
                                onClick={clear}
                                className="ml-2 rounded-md p-1 hover:bg-muted transition-colors"
                                aria-label="Remove file"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
}
