'use client'

const testimonials = [
  { 
    name: 'Sarah Johnson', 
    role: 'CTO, TechCorp',
    quote: 'Okeson built a secure authentication system that exceeded our security audit requirements.',
    avatar: '👩‍💼'
  },
  { 
    name: 'Dr. Michael Chen', 
    role: 'Security Consultant',
    quote: 'Impressive cybersecurity knowledge combined with practical development skills.',
    avatar: '👨‍🏫'
  },
  { 
    name: 'Aisha Mohammed', 
    role: 'Product Manager',
    quote: 'Delivered a robust full-stack solution on time with excellent documentation.',
    avatar: '👩‍💻'
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">What Others Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="text-center mb-4">
              <span className="text-5xl">{t.avatar}</span>
            </div>
            <p className="text-lg italic mb-4 text-center">"{t.quote}"</p>
            <div className="text-center">
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
