'use client'
import { useState } from 'react'

export default function QuickContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form data:', formData)
    
    setStatus('success')
    setFormData({ name: '', email: '', message: '' })
    
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <section id="contact" className="mb-16">
      <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-semibold">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block mb-2 font-semibold">Message</label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        
        {status === 'success' && (
          <p className="text-green-600 font-semibold">Message sent successfully!</p>
        )}
      </form>
      
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText('your.email@example.com')
            alert('Email copied!')
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          📧 Copy Email
        </button>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText('+234-XXX-XXX-XXXX')
            alert('Phone copied!')
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          📱 Copy Phone
        </button>
        
        <a
          href="/resume.pdf"
          download="Okeson_Resume.pdf"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📄 Download Resume
        </a>
      </div>
    </section>
  )
}
