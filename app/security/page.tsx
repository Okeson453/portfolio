import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Security | SecureStack',
    description: 'Manage your account security settings',
};

export default function SecurityPage() {
    // Redirect to the settings security page
    redirect('/settings/security');
}
