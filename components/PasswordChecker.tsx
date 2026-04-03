'use client'
import { useState } from 'react'

export default function PasswordChecker() {
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState('')
  const [feedback, setFeedback] = useState<string[]>([])

  const checkStrength = (pw: string) => {
    const feedbackArr: string[] = []
    
    if (pw.length === 0) {
      setStrength('')
      setFeedback([])
      return
    }
    
    if (pw.length < 8) {
      feedbackArr.push('At least 8 characters needed')
    }
    if (!/[a-z]/.test(pw)) {
      feedbackArr.push('Add lowercase letters')
    }
    if (!/[A-Z]/.test(pw)) {
      feedbackArr.push('Add uppercase letters')
    }
    if (!/\d/.test(pw)) {
      feedbackArr.push('Add numbers')
    }
    if (!/[@$!%*?&]/.test(pw)) {
      feedbackArr.push('Add special characters')
    }
    
    setFeedback(feedbackArr)
    
    if (feedbackArr.length === 0) {
      setStrength('Strong')
    } else if (feedbackArr.length <= 2) {
      setStrength('Medium')
    } else {
      setStrength('Weak')
    }
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 'Strong': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'Weak': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  return (
    <section id="cyber-demo" className="mb-16">
      <h2 className="text-3xl font-bold mb-4">Cybersecurity Demo Tool</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Interactive password strength checker using industry-standard regex patterns.
      </p>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg max-w-md">
        <label htmlFor="password" className="block font-semibold mb-2">
          Test Password Strength
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            checkStrength(e.target.value)
          }}
          placeholder="Enter a password..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
          aria-describedby="strength-result"
        />
        
        {strength && (
          <div className="mt-4">
            <p id="strength-result" className={`text-lg font-bold ${getStrengthColor()}`}>
              Strength: {strength}
            </p>
            
            {feedback.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                {feedback.map((fb, idx) => (
                  <li key={idx}>{fb}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
