'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, Lock, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';
import type { Project } from '@/types/projects';

interface ProjectCardProps extends Project {
  className?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  githubUrl,
  liveUrl,
  category,
  featured,
  securityLevel,
  technologies,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div
      ref={ref}
      className={`group relative h-full transition-all duration-500 ease-out ${isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
        }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />

      <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        {/* Image - Enforced aspect-video (16:9) for consistency */}
        <div className="relative aspect-video overflow-hidden">
          {!imageError ? (
            <Image
              src={image}
              alt={`${title} project - ${description}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Lock className="h-12 w-12 text-blue-500/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={category === 'Security' ? 'destructive' : 'default'}>
              {category}
            </Badge>
            {featured && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Security Level */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              <Lock className="h-3 w-3 text-green-400" />
              <span className="text-xs text-white font-medium">
                {securityLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                +{technologies.length - 3}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-6">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              {githubUrl && (
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="View source code"
                >
                  <Github className="h-5 w-5" />
                </Link>
              )}
              {liveUrl && (
                <Link
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="View live demo"
                >
                  <Eye className="h-5 w-5" />
                </Link>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="group/btn"
              asChild
            >
              <Link
                href={liveUrl || githubUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
                <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}