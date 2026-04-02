import { type NextRequest } from 'next/server';
import { siteConfig } from '@/lib/seo';

export async function GET(request: NextRequest) {
    // Get blog posts (you'll need to adapt this based on your blog structure)
    const blogPosts = [
        {
            title: 'Removing Framer Motion: How I Dropped LCP by 430ms',
            description: 'A deep dive into performance optimization techniques and alternatives to Framer Motion for animations.',
            url: 'devsecops-fintech',
            date: new Date('2026-03-15'),
            author: siteConfig.author,
        },
        {
            title: 'Common Security Mistakes in Web Applications',
            description: 'Explore the most common security vulnerabilities and how to prevent them in modern web applications.',
            url: 'security-mistakes',
            date: new Date('2026-03-10'),
            author: siteConfig.author,
        },
        {
            title: 'Understanding Vulnerability Scanning',
            description: 'A comprehensive guide to vulnerability scanning tools and techniques for securing your applications.',
            url: 'vulnerability-scanner',
            date: new Date('2026-03-05'),
            author: siteConfig.author,
        },
    ];

    const rssItems = blogPosts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${siteConfig.url}/blog/${post.url}</link>
      <guid>${siteConfig.url}/blog/${post.url}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <author>${post.author}</author>
      <category>Technology</category>
    </item>
  `
        )
        .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteConfig.url}/og-image.png</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}
