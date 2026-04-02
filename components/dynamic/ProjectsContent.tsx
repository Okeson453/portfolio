'use client'

export function ProjectsContent() {
  const projects = [
    {
      id: 1,
      title: 'Advanced Security Scanner',
      description: 'Full-stack network reconnaissance tool with ML anomaly detection',
      tech: ['Python', 'React', 'FastAPI', 'PostgreSQL'],
      link: '#',
    },
    {
      id: 2,
      title: 'Vulnerability Assessment Platform',
      description: 'Automated CVE tracking and pentesting workflow management',
      tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Prisma'],
      link: '#',
    },
    {
      id: 3,
      title: 'Secure API Gateway',
      description: 'Rate-limiting, JWT auth, and encryption middleware',
      tech: ['Node.js', 'Express', 'Redis', 'Docker'],
      link: '#',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
