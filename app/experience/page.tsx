import dynamic from 'next/dynamic';

export const metadata = {
    title: 'Experience | SecureStack',
    description: 'My professional experience in cybersecurity and full-stack development.',
};

const Experience = dynamic(() => import('@/components/Experience').then(mod => ({ default: mod.Experience })), {
    loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
});

const Contact = dynamic(() => import('@/components/Contact').then(mod => ({ default: mod.Contact })), {
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
});

export default function ExperiencePage() {
    return (
        <>
            <Experience />
            <Contact />
        </>
    );
}
