'use client'
import { useState, useEffect } from 'react'

const commands = [
  { label: 'Go to Projects', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Go to About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Go to Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Download Resume', action: () => window.open('/resume.pdf', '_blank') },
  { label: 'Toggle Dark Mode', action: () => document.documentElement.classList.toggle('dark') },
  { label: 'Copy Email', action: () => navigator.clipboard.writeText('your.email@example.com') },
]

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  const executeCommand = (cmd: typeof commands[0]) => {
    cmd.action()
    setIsOpen(false)
    setSearch('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 p-4"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command..."
              className="w-full p-3 border-b border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-800"
              autoFocus
            />
            
            <div className="mt-2 max-h-64 overflow-y-auto">
              {filtered.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => executeCommand(cmd)}
                  className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {cmd.label}
                </button>
              ))}
              
              {filtered.length === 0 && (
                <p className="p-3 text-gray-500 text-center">No commands found</p>
              )}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 text-center">
              Press ESC to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
