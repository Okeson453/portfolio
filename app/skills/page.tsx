import dynamic from 'next/dynamic';

export const metadata = {
    title: 'Skills | SecureStack',
    description: 'Explore my technical skills in cybersecurity, development, and DevOps.',
};

const Skills = dynamic(() => import('@/components/Skills').then(mod => ({ default: mod.Skills })), {
    loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
});

const Contact = dynamic(() => import('@/components/Contact').then(mod => ({ default: mod.Contact })), {
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
});

export default function SkillsPage() {
    return (
        <>
            <Skills />
            <Contact />
        </>
    );
}
