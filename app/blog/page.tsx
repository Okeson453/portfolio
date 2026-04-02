import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';
import { 
  generateBreadcrumbSchema, 
  SchemaScript 
} from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Security Blog',
  description:
    'Technical insights on cybersecurity, threat intelligence, incident response, DevSecOps, secure coding practices, and vulnerability research. In-depth guides and best practices.',
  keywords: [
    'cybersecurity blog',
    'threat intelligence',
    'security insights',
    'incident response',
    'secure development',
    'DevSecOps',
    'OWASP',
    'vulnerability research',
    'security best practices',
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteConfig.url}/blog`,
    title: 'Security Blog: Threat Intelligence & Secure Development',
    description:
      'Technical blog covering cybersecurity, threat intelligence, incident response, and secure coding practices.',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Okeson Security Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security Blog',
    description: 'Cybersecurity insights and technical security content',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

const Blog = dynamic(() => import('@/components/Blog').then(mod => ({ default: mod.Blog })), {
  loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: true,
});

const Contact = dynamic(() => import('@/components/Contact').then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: true,
});

export default function BlogPage() {
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blog` },
  ];

  return (
    <>
      <SchemaScript schema={generateBreadcrumbSchema(breadcrumbs)} />
      <Blog />
      <Contact />
    </>
  );
}
}
