'use client'

import dynamic from 'next/dynamic'

// Lazy load Projects component with loading fallback
const ProjectsContent = dynamic(
  () => import('./ProjectsContent').then(mod => mod.ProjectsContent),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded mb-4" />
          <div className="h-40 bg-gradient-to-r from-gray-700 to-gray-800 rounded" />
        </div>
      </div>
    ),
    ssr: true, // SSR for SEO (projects visible by crawlers)
  }
)

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground">Security-focused projects & pentesting tools</p>
        </div>
        <ProjectsContent />
      </div>
    </section>
  )
}
