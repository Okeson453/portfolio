import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { siteConfig } from '@/lib/seo';

// Static page - doesn't change frequently
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: `About ${siteConfig.fullName} | ${siteConfig.name}`,
  description: 'Security architect, full-stack developer, and cybersecurity specialist. Learn about my background, expertise, and experience building secure applications.',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    type: 'profile',
    title: `About ${siteConfig.fullName}`,
    description: 'Security architect with expertise in DevSecOps, secure application development, and enterprise security architecture.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.fullName} - ${siteConfig.name}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${siteConfig.fullName}`,
    description: 'Security architect, full-stack developer, and cybersecurity specialist.',
    images: [siteConfig.ogImage],
  },
  keywords: [
    'security architect',
    'cybersecurity',
    'full-stack developer',
    'next.js',
    'devops',
    ...siteConfig.keywords,
  ],
};

const About = dynamicImport(() => import('@/components/About').then(mod => ({ default: mod.About })), {
  loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: true,
});

const Contact = dynamicImport(() => import('@/components/Contact').then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: true,
});

export default function AboutPage() {
  // 🔍 JSON-LD: Person schema for About page
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.fullName,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: 'Security Architect & Full-Stack Developer',
    image: siteConfig.ogImage,
    location: {
      '@type': 'Place',
      name: siteConfig.location,
    },
    sameAs: [
      siteConfig.githubUrl,
      siteConfig.linkedinUrl,
    ],
    description: 'Security architect with expertise in building secure, scalable web applications.',
    knowsAbout: [
      'Cybersecurity',
      'DevSecOps',
      'Full-Stack Development',
      'Cloud Security',
      'Penetration Testing',
      'Secure Architecture',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <About />
      <Contact />
    </>
  );
}
