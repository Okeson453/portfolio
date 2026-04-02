'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const { profile, updateProfile, isUpdating } = useProfile();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.name || '',
            email: profile?.email || '',
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        await updateProfile(data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                    Display name
                </label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email address
                </label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {success && <p className="text-sm text-emerald-600">Profile updated successfully</p>}

            <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
}
