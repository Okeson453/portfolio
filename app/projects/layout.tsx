import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Cybersecurity and full-stack development projects — secure dashboards, penetration testing tools, React applications, and blockchain dApps.',
  alternates: { canonical: `${siteConfig.url}/projects` },
  openGraph: {
    title: 'Projects | SecureStack',
    description: 'Explore my portfolio of cybersecurity and full-stack projects.',
    url: `${siteConfig.url}/projects`,
    type: 'website',
    images: [{ 
      url: `${siteConfig.url}/og-image.png`, 
      width: 1200, 
      height: 630,
      alt: 'Projects Portfolio',
    }],
  },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
