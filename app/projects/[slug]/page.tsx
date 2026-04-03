import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/projectsData';
import { siteConfig } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all projects at build time
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

// Dynamic metadata per project
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const url = `${siteConfig.url}/projects/${slug}`;
  const projectImage = project.image || siteConfig.ogImage;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description,
      url,
      type: 'article',
      images: [
        {
          url: projectImage.startsWith('http') ? projectImage : `${siteConfig.url}${projectImage}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [projectImage.startsWith('http') ? projectImage : `${siteConfig.url}${projectImage}`],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  // Breadcrumb schema for SEO — displays breadcrumb navigation in SERPs
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Projects', url: `${siteConfig.url}/projects` },
    { name: project.title, url: `${siteConfig.url}/projects/${slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* 🔍 SoftwareApplication schema per project */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: project.title,
            description: project.longDescription || project.description,
            url: project.liveUrl ?? `${siteConfig.url}/projects/${slug}`,
            image: project.image?.startsWith('http')
              ? project.image
              : `${siteConfig.url}${project.image}`,
            datePublished: new Date().toISOString(),
            applicationCategory: 'WebApplication',
            operatingSystem: 'Web Browser',
            author: {
              '@type': 'Person',
              name: siteConfig.fullName,
              url: siteConfig.url,
            },
            ...(project.githubUrl && {
              codeRepository: project.githubUrl,
            }),
          }),
        }}
      />

      {/* 🔍 Breadcrumb schema for SERP breadcrumb display */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  View Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Project Image */}
          {project.image && (
            <div className="mb-12">
              <img
                src={project.image}
                alt={project.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="prose dark:prose-invert max-w-none">
            <h2>Overview</h2>
            <p>{project.longDescription || project.description}</p>

            {project.highlights && project.highlights.length > 0 && (
              <>
                <h2>Key Highlights</h2>
                <ul>
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </>
            )}

            {project.securityFeatures && project.securityFeatures.length > 0 && (
              <>
                <h2>Security Features</h2>
                <ul>
                  {project.securityFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
