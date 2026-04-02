'use client'
import { useState, useEffect } from 'react'

const shortcuts = [
  { key: 'Cmd/Ctrl + K', action: 'Open command palette' },
  { key: '?', action: 'Show this guide' },
  { key: 'D', action: 'Toggle dark mode' },
  { key: 'H', action: 'Go to home/top' },
  { key: 'P', action: 'Go to projects' },
  { key: 'C', action: 'Go to contact' },
]

export default function ShortcutGuide() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'd' || e.key === 'D') {
        document.documentElement.classList.toggle('dark')
      }
      if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      if (e.key === 'p' || e.key === 'P') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (e.key === 'c' || e.key === 'C') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-40"
        aria-label="Show keyboard shortcuts"
      >
        <span className="text-lg">?</span>
      </button>

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h3>
              
              <div className="space-y-3">
                {shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                    <kbd className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
