'use client'

import { useState, useEffect } from 'react'
import {
  Cpu,
  Shield,
  Lock,
  Zap,
  Terminal,
  Key,
  Network,
  Fingerprint,
  AlertCircle
} from 'lucide-react'
import styles from './LoadingSpinner.module.css'


const speedMultiplier = {
  slow: 800,
  normal: 500,
  fast: 200,
  turbo: 100
}

interface LoadingSpinnerProps {
  type?: 'default' | 'security' | 'network' | 'scan' | 'decrypt' | 'authenticate'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  progress?: number
  showProgress?: boolean
  showDetails?: boolean
  speed?: 'slow' | 'normal' | 'fast'
}

const loadingMessages = {
  default: [
    'Initializing security protocols...',
    'Loading encrypted components...',
    'Verifying integrity checks...',
    'Establishing secure connection...',
    'Decrypting security modules...'
  ],
  security: [
    'Running security scan...',
    'Analyzing threat patterns...',
    'Checking vulnerability database...',
    'Validating security certificates...',
    'Monitoring network activity...'
  ],
  network: [
    'Establishing encrypted tunnel...',
    'Routing through secure nodes...',
    'Verifying network integrity...',
    'Optimizing connection speed...',
    'Testing packet encryption...'
  ],
  scan: [
    'Scanning for vulnerabilities...',
    'Analyzing code patterns...',
    'Checking dependencies...',
    'Testing security controls...',
    'Generating threat assessment...'
  ],
  decrypt: [
    'Initializing decryption engine...',
    'Loading encryption keys...',
    'Processing ciphertext...',
    'Verifying digital signatures...',
    'Decrypting secure data...'
  ],
  authenticate: [
    'Verifying credentials...',
    'Checking multi-factor authentication...',
    'Validating security tokens...',
    'Establishing secure session...',
    'Generating access keys...'
  ]
}

const loadingIcons = {
  default: Cpu,
  security: Shield,
  network: Network,
  scan: AlertCircle,
  decrypt: Lock,
  authenticate: Key
}

export default function LoadingSpinner({
  type = 'default',
  size = 'md',
  message,
  progress,
  showProgress = false,
  showDetails = false,
  speed = 'normal'
}: LoadingSpinnerProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [details, setDetails] = useState<string[]>([])
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages[type].length)

      // Add simulated details
      if (showDetails && Math.random() > 0.7) {
        const detailTypes = [
          `Checking ${['firewall', 'IDS', 'IPS', 'WAF'][Math.floor(Math.random() * 4)]}...`,
          `Scanning ${['ports', 'services', 'endpoints', 'APIs'][Math.floor(Math.random() * 4)]}...`,
          `Analyzing ${['logs', 'packets', 'traffic', 'patterns'][Math.floor(Math.random() * 4)]}...`,
          `Verifying ${['certificates', 'tokens', 'keys', 'signatures'][Math.floor(Math.random() * 4)]}...`,
          `Testing ${['encryption', 'authentication', 'authorization', 'integrity'][Math.floor(Math.random() * 4)]}...`
        ]

        setDetails(prev => {
          const newDetail = detailTypes[Math.floor(Math.random() * detailTypes.length)]
          return [newDetail, ...prev.slice(0, 4)] // Keep last 5 details
        })
      }
    }, speedMultiplier[speed])

    return () => clearInterval(interval)
  }, [type, showDetails, speed])

  useEffect(() => {
    if (!showProgress || progress !== undefined) {
      return
    }

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const increment = Math.random() * 5
        const newProgress = prev + increment
        return newProgress >= 100 ? 0 : newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [showProgress, progress])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const Icon = loadingIcons[type]
  const actualProgress = progress !== undefined ? progress : scanProgress

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Container */}
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-cyber-green/20 rounded-full`} />

        {/* Animated Ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-cyber-green border-r-cyber-blue rounded-full animate-spin`} />

        {/* Inner Ring */}
        <div className={`absolute inset-2 ${sizeClasses[size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm']} border-2 border-cyber-purple/30 rounded-full`} style={{ animation: 'spin 1.5s linear infinite reverse' }} />

        {/* Icon */}
        <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]}`}>
          <div className="animate-pulse">
            <Icon className={`${size === 'sm' ? 'w-4 h-4' :
              size === 'md' ? 'w-6 h-6' :
                size === 'lg' ? 'w-8 h-8' : 'w-12 h-12'
              } text-cyber-green`} />
          </div>
        </div>

        {/* Floating Particles - Simplified */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-green rounded-full animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${Math.cos(i * 90 * Math.PI / 180) * 20}px), calc(-50% + ${Math.sin(i * 90 * Math.PI / 180) * 20}px))`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="mt-6 text-center">
        <p
          key={currentMessage}
          className="text-lg font-mono text-cyber-green mb-2"
        >
          {message || loadingMessages[type][currentMessage]}
        </p>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-64 mt-4">
            <div className="flex justify-between text-xs text-cyber-green/70 mb-1">
              <span>SECURITY SCAN</span>
              <span>{Math.round(actualProgress)}%</span>
            </div>
            <div className="h-2 bg-cyber-dark border border-cyber-green/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue transition-all duration-500"
                style={{ width: `${actualProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Security Details */}
        {showDetails && (
          <div className="mt-6 w-80">
            <div className="text-sm font-bold text-cyber-green mb-2 flex items-center justify-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>SECURITY DETAILS</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="p-2 bg-cyber-dark/50 border border-cyber-green/20 rounded text-xs font-mono text-cyber-green/70"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                    <span>{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Indicators */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {[
          { icon: Shield, text: 'Encrypted', color: 'text-green-500' },
          { icon: Lock, text: 'Secure', color: 'text-cyber-green' },
          { icon: Zap, text: 'Fast', color: 'text-cyber-blue' },
          { icon: Fingerprint, text: 'Authenticated', color: 'text-purple-500' }
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 px-3 py-1 bg-cyber-dark/50 border border-cyber-green/20 rounded-full"
          >
            <item.icon className={`w-3 h-3 ${item.color}`} />
            <span className="text-xs text-foreground/70">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Easter Egg */}
      <div className="mt-6">
        <button
          onClick={() => {
            const code = prompt('Enter override code to skip loading:')
            if (code === 'SKIP-LOADING-2024') {
              window.dispatchEvent(new CustomEvent('loading-skip', { detail: { type } }))
            }
          }}
          className="text-xs text-cyber-green/30 hover:text-cyber-green transition-colors font-mono"
        >
          &lt;loading-override /&gt;
        </button>
      </div>
    </div>
  )
}

// Full-screen loading component
export function FullScreenLoading({
  type = 'default',
  title,
  subtitle
}: {
  type?: LoadingSpinnerProps['type']
  title?: string
  subtitle?: string
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyber-dark via-cyber-darker to-black z-50 flex flex-col items-center justify-center">
      {/* Matrix Background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />

      {/* Content */}
      <div className="relative z-10">
        <LoadingSpinner
          type={type}
          size="xl"
          showProgress={true}
          showDetails={true}
          speed="normal"
        />

        {(title || subtitle) && (
          <div className="mt-8 text-center">
            {title && (
              <h1 className="text-3xl font-bold text-cyber-green mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-cyber-green/70">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Security Status */}
      <div className="absolute bottom-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-cyber-green font-mono">ENCRYPTED CONNECTION</span>
        </div>
      </div>

      {/* Loading Tips */}
      <div className="absolute bottom-8 right-8 max-w-sm">
        <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-cyber-green" />
            <span className="text-sm font-bold text-cyber-green">Security Tip</span>
          </div>
          <p className="text-sm text-foreground/70">
            Loading times may vary based on encryption strength and network security checks.
          </p>
        </div>
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoading({ size = 'sm', type = 'default' }: {
  size?: LoadingSpinnerProps['size']
  type?: LoadingSpinnerProps['type']
}) {
  return (
    <div className="inline-flex items-center space-x-2">
      <LoadingSpinner size={size} type={type} />
      <span className="text-sm text-cyber-green font-mono">Loading...</span>
    </div>
  )
}

// Section loading component
export function SectionLoading({ title, type = 'security' }: {
  title: string
  type?: LoadingSpinnerProps['type']
}) {
  return (
    <div className="p-8 border border-cyber-green/30 rounded-lg bg-cyber-dark/50">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <LoadingSpinner size="md" type={type} />
        <div>
          <h3 className="font-bold text-cyber-green">{title}</h3>
          <p className="text-sm text-cyber-green/70">Loading security data...</p>
        </div>
      </div>
    </div>
  )
}