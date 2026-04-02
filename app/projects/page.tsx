import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/seo';
import { 
  generateBreadcrumbSchema, 
  SchemaScript 
} from '@/lib/schema';

// Static page - project showcase doesn't change frequently
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: 'Security Projects',
    description:
      'Portfolio of cybersecurity projects including vulnerability scanning platforms, threat intelligence dashboards, penetration testing tools, and secure full-stack development platforms. OWASP-compliant applications built with React, Next.js, Python, and Node.js.',
    keywords: [
      'cybersecurity projects',
      'security tools portfolio',
      'vulnerability assessment',
      'penetration testing platform',
      'threat intelligence dashboard',
      'OWASP projects',
      'open source security',
    ],
    openGraph: {
        title: 'Security Projects | Portfolio',
        description: 'Cybersecurity projects showcase: vulnerability scanners, threat detection, and secure development platforms.',
        type: 'website',
        url: `${siteConfig.url}/projects`,
    },
    alternates: {
        canonical: `${siteConfig.url}/projects`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Security Projects Portfolio',
      description: 'Cybersecurity and full-stack development projects',
    },
};

const Projects = dynamic(() => import('@/components/Projects').then(mod => ({ default: mod.Projects })), {
    loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
});

export default function ProjectsPage() {
    const breadcrumbs = [
      { name: 'Home', url: siteConfig.url },
      { name: 'Projects', url: `${siteConfig.url}/projects` },
    ];

    return (
      <>
        <SchemaScript schema={generateBreadcrumbSchema(breadcrumbs)} />
        <Projects />
      </>
    );
}
