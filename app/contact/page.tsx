import dynamic from 'next/dynamic';

// Static shell - form submission via Server Action doesn't require dynamic rendering
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = {
  title: 'Contact | SecureStack',
  description: 'Get in touch with me for projects, collaborations, or inquiries.',
};

const Contact = dynamic(() => import('@/components/Contact').then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: true,
});

export default function ContactPage() {
  return <Contact />;
}
