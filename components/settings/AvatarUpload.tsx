'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';

export function AvatarUpload() {
    const { profile, uploadAvatar, isUploading } = useProfile();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        await uploadAvatar(file);
    };

    const handleRemove = () => {
        setPreview(null);
        // API call to remove avatar
    };

    return (
        <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-muted">
                {preview || profile?.avatar ? (
                    <Image
                        src={preview || profile?.avatar || ''}
                        alt="Avatar"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload avatar image"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload new'}
                </Button>
                {(preview || profile?.avatar) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        className="text-destructive"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                )}
                <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP. Max 2MB.</p>
            </div>
        </div>
    );
}
