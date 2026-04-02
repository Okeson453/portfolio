/**
 * Author Bio Component
 *
 * Displays author information below blog posts.
 * Provides E-E-A-T signals: credentials, links, proof of expertise
 */

import Link from 'next/link';
import Image from 'next/image';

interface AuthorBioProps {
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
}

export function AuthorBio({ publishedAt, updatedAt, readingTime }: AuthorBioProps) {
  const formattedPublishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedUpdatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <aside
      aria-label="About the author"
      className="mt-16 p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className="flex gap-6 items-start">
        {/* Author Avatar */}
        <Image
          src="/images/profile.jpg"
          alt="Okeson — Senior Systems Security Engineer"
          width={80}
          height={80}
          className="rounded-full flex-shrink-0 border-2 border-slate-700"
        />

        {/* Author Info */}
        <div className="flex-1">
          <div className="mb-2">
            <p className="font-bold text-lg text-white">
              <Link href="/about" className="hover:text-blue-400 transition-colors">
                Okeson
              </Link>
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Senior Systems Security Engineer &amp; Full-Stack Developer
            </p>
          </div>

          {/* Bio */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Security-first engineer specializing in threat intelligence, vulnerability research, and
            building secure full-stack applications with React, Next.js, and TypeScript. Passionate
            about secure architecture, DevSecOps practices, and sharing cybersecurity knowledge.
          </p>

          {/* Published/Updated Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-800 pt-3">
            <time dateTime={publishedAt}>
              <span className="font-medium text-slate-400">Published:</span> {formattedPublishedDate}
            </time>

            {formattedUpdatedDate && formattedUpdatedDate !== formattedPublishedDate && (
              <time dateTime={updatedAt}>
                <span className="font-medium text-slate-400">Updated:</span> {formattedUpdatedDate}
              </time>
            )}

            {readingTime && (
              <div>
                <span className="font-medium text-slate-400">Reading time:</span> {readingTime} min
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://github.com/Okeson453"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 text-xs transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/okeson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 text-xs transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="mailto:eolamide453@gmail.com"
              className="text-slate-400 hover:text-blue-400 text-xs transition-colors"
              aria-label="Email"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
