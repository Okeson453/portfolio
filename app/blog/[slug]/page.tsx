import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic metadata per blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const url = `${siteConfig.url}/blog/${slug}`;
  const ogImage = `${siteConfig.url}/api/og/blog?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.name,
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: siteConfig.twitterHandle || undefined,
    },
    keywords: [...post.tags, post.category],
    authors: [
      {
        name: post.author.name,
        url: siteConfig.url,
      },
    ],
  };
}

const BlogPost = dynamic(
  () => import('@/components/Blog').then((mod) => ({ default: mod.BlogPost })),
  {
    loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />,
    ssr: true,
  }
);

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${siteConfig.url}/api/og/blog?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPost slug={slug} />
    </>
  );
}
