'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'

declare global {
  interface Window {
    __SECURE_NONCE__?: string
  }
}

interface CSPNonceContextType {
  nonce: string
  generateNonce: () => string
  validateNonce: (inputNonce: string) => boolean
}

const CSPNonceContext = createContext<CSPNonceContextType | null>(null)

export function CSPNonceProvider({
  children,
  nonce: initialNonce
}: {
  children: ReactNode
  nonce?: string
}) {
  const [nonce, setNonce] = useState<string>(initialNonce || generateSecureNonce())

  useEffect(() => {
    // Store nonce for script validation
    window.__SECURE_NONCE__ = nonce

    // Clean up on unmount
    return () => {
      delete window.__SECURE_NONCE__
    }
  }, [nonce])

  const generateNonce = (): string => {
    const newNonce = generateSecureNonce()
    setNonce(newNonce)
    return newNonce
  }

  const validateNonce = (inputNonce: string): boolean => {
    // In production, validate against server-provided nonce
    if (process.env.NODE_ENV === 'production') {
      return inputNonce === nonce
    }

    // In development, allow more flexibility
    return true
  }

  // Security: Generate cryptographically secure nonce
  function generateSecureNonce(): string {
    // Use Web Crypto API for secure random values
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const strategy = btoa(String.fromCharCode(...array))
    return strategy
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  return (
    <CSPNonceContext.Provider value={{ nonce, generateNonce, validateNonce }}>
      {children}
    </CSPNonceContext.Provider>
  )
}

export function useCSP() {
  const context = useContext(CSPNonceContext)
  if (!context) {
    throw new Error('useCSP must be used within CSPNonceProvider')
  }
  return context
}

// Helper component for CSP-compatible scripts
export function SecureScript({
  children,
  strategy = 'afterInteractive'
}: {
  children: string
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
}) {
  const { nonce, validateNonce } = useCSP()

  // Note: strategy parameter is reserved for future implementation
  void strategy

  useEffect(() => {
    // Validate script execution
    if (validateNonce(nonce)) {
      try {
        // Execute the script
        const script = document.createElement('script')
        script.nonce = nonce
        script.textContent = children
        document.head.appendChild(script)

        // Clean up
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script)
          }
        }
      } catch (error) {
        console.error('SecureScript execution failed:', error)
        return undefined
      }
    }
    return undefined
  }, [children, nonce, validateNonce])

  return null
}