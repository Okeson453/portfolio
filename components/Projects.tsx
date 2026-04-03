'use client'
import { useState } from 'react'

const projects = [
  { 
    id: 1, 
    title: 'Secure Task Manager', 
    tags: ['fullstack', 'cyber'], 
    description: 'Full-stack app with JWT auth, SQL injection prevention, and XSS protection.',
    tech: ['Next.js', 'PostgreSQL', 'JWT'],
    link: 'https://github.com'
  },
  { 
    id: 2, 
    title: 'Vulnerability Scanner', 
    tags: ['cyber', 'tools'], 
    description: 'Python-based network vulnerability assessment tool.',
    tech: ['Python', 'Nmap', 'Scapy'],
    link: 'https://github.com'
  },
  { 
    id: 3, 
    title: 'E-commerce Platform', 
    tags: ['fullstack'], 
    description: 'Secure payment integration with Stripe and inventory management.',
    tech: ['React', 'Node.js', 'MongoDB'],
    link: 'https://github.com'
  },
]

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' 
    ? projects 
    : projects.filter(p => p.tags.includes(filter))

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Full-Stack', value: 'fullstack' },
    { label: 'Cybersecurity', value: 'cyber' },
    { label: 'Tools', value: 'tools' },
  ]

  return (
    <section id="projects" className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === btn.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(proj => (
            <motion.article
              key={proj.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{proj.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{proj.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tech.map(t => (
                  <span key={t} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
              
              <a 
                href={proj.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Project →
              </a>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
