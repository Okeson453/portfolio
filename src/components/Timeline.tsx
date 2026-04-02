'use client'
import { useState, useEffect } from 'react'

const timelineData = [
  {
    year: '2024',
    title: 'Started Cybersecurity Journey',
    desc: 'Completed CompTIA Security+ and TryHackMe paths.',
    icon: '🎓'
  },
  {
    year: '2025',
    title: 'Built First Full-Stack App',
    desc: 'Secure task manager with OWASP compliance.',
    icon: '🚀'
  },
  {
    year: '2025',
    title: 'Advanced Web Security',
    desc: 'Implemented zero-trust architecture and OAuth 2.0.',
    icon: '🔒'
  },
]

export default function Timeline() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render static version on first load
    return (
      <section id="timeline" className="mb-16">
        <div className="relative border-l-2 border-blue-500 pl-8">
          {timelineData.map((item, idx) => (
            <div
              key={idx}
              className="mb-8 relative opacity-0 animate-fadeIn"
              data-index={idx}
            >
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[42px] mt-1.5" />
              <div className="absolute text-2xl -left-[52px] -top-1">{item.icon}</div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-1">
                  {item.year} - {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // After hydration, use animations
  return (
    <section id="timeline" className="mb-16">
      <div className="relative border-l-2 border-blue-500 pl-8">
        <AnimatePresence>
          {timelineData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="mb-8 relative"
            >
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[42px] mt-1.5" />
              <div className="absolute text-2xl -left-[52px] -top-1">{item.icon}</div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-1">
                  {item.year} - {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
