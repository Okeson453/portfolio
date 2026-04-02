'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { generateUUID } from '@/lib/uuid'

interface SecurityContextType {
  securityLevel: 'low' | 'medium' | 'high' | 'critical'
  setSecurityLevel: (level: SecurityContextType['securityLevel']) => void
  threats: Threat[]
  addThreat: (threat: Omit<Threat, 'id' | 'timestamp'>) => string
  clearThreats: () => void
  isMonitoring: boolean
  toggleMonitoring: () => void
  securityMetrics: SecurityMetrics
  auditLog: AuditLogEntry[]
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void
  runSecurityScan: () => Promise<ScanResult>
  validateToken: (token: string) => Promise<boolean>
  encryptData: (data: string, key?: string) => Promise<string>
  decryptData: (encrypted: string, key?: string) => Promise<string>
}

interface Threat {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: string
  source?: string
  ip?: string
  userAgent?: string
  evidence?: Record<string, string | number | boolean | Record<string, unknown>>
}

interface SecurityMetrics {
  totalThreats: number
  criticalThreats: number
  lastScanTime: string | null
  avgResponseTime: number
  successRate: number
  complianceScore: number
}

interface AuditLogEntry {
  id: string
  action: string
  user?: string
  resource?: string
  ip: string
  userAgent: string
  timestamp: string
  status: 'success' | 'failure' | 'warning'
  metadata?: Record<string, string | number | boolean | Record<string, unknown>>
}

interface ScanResult {
  id: string
  timestamp: string
  threatsFound: number
  vulnerabilities: Vulnerability[]
  scanDuration: number
  status: 'completed' | 'failed' | 'in_progress'
}

interface Vulnerability {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  location: string
  remediation: string
  cveId?: string
  cvssScore?: number
}

const SecurityContext = createContext<SecurityContextType | null>(null)

export function SecurityProvider({
  children
}: {
  children: ReactNode
}) {
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [threats, setThreats] = useState<Threat[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalThreats: 0,
    criticalThreats: 0,
    lastScanTime: null,
    avgResponseTime: 0,
    successRate: 100,
    complianceScore: 95
  })

  // Initialize from localStorage
  useEffect(() => {
    const savedThreats = localStorage.getItem('securestack-threats')
    const savedAuditLog = localStorage.getItem('securestack-audit-log')
    const savedMetrics = localStorage.getItem('securestack-metrics')

    try {
      if (savedThreats) setThreats(JSON.parse(savedThreats))
      if (savedAuditLog) setAuditLog(JSON.parse(savedAuditLog))
      if (savedMetrics) setSecurityMetrics(JSON.parse(savedMetrics))
    } catch (error) {
      console.error('Failed to load security data:', error)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('securestack-threats', JSON.stringify(threats))
    localStorage.setItem('securestack-audit-log', JSON.stringify(auditLog))
    localStorage.setItem('securestack-metrics', JSON.stringify(securityMetrics))
  }, [threats, auditLog, securityMetrics])

  const addAuditLog = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: generateUUID(),
      timestamp: new Date().toISOString()
    }

    setAuditLog(prev => [newEntry, ...prev.slice(0, 99)]) // Keep last 100 entries
  }, [])

  const addThreat = useCallback((threat: Omit<Threat, 'id' | 'timestamp'>): string => {
    const newThreat: Threat = {
      ...threat,
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }

    setThreats(prev => {
      const updated = [newThreat, ...prev.slice(0, 49)] // Keep last 50 threats

      // Update metrics
      setSecurityMetrics(prevMetrics => ({
        ...prevMetrics,
        totalThreats: prevMetrics.totalThreats + 1,
        criticalThreats: threat.severity === 'critical'
          ? prevMetrics.criticalThreats + 1
          : prevMetrics.criticalThreats
      }))

      return updated
    })

    // Add to audit log
    addAuditLog({
      action: `THREAT_DETECTED_${threat.type}`,
      resource: threat.source || 'Unknown',
      ip: threat.ip || '0.0.0.0',
      userAgent: navigator.userAgent,
      status: threat.severity === 'critical' ? 'failure' : 'warning',
      metadata: threat.evidence || {}
    })

    // Show notification
    const notificationConfig = {
      critical: {
        emoji: '🚨',
        duration: 10000,
        position: 'top-right' as const
      },
      high: {
        emoji: '⚠️',
        duration: 7000,
        position: 'top-right' as const
      },
      medium: {
        emoji: '🔍',
        duration: 5000,
        position: 'bottom-right' as const
      },
      low: {
        emoji: 'ℹ️',
        duration: 3000,
        position: 'bottom-right' as const
      }
    }

    const config = notificationConfig[threat.severity]
    toast(`${config.emoji} ${threat.description}`, {
      duration: config.duration,
      position: config.position,
      style: {
        background: threat.severity === 'critical' ? '#ff003c' :
          threat.severity === 'high' ? '#ff6b35' :
            threat.severity === 'medium' ? '#ffd700' : '#00ff9d',
        color: '#0a0a0f',
        fontWeight: 'bold'
      }
    })

    // Update security level
    if (threat.severity === 'critical') {
      setSecurityLevel('critical')
    } else if (threat.severity === 'high' && securityLevel !== 'critical') {
      setSecurityLevel('high')
    } else if (threat.severity === 'medium' && !['high', 'critical'].includes(securityLevel)) {
      setSecurityLevel('medium')
    }

    return newThreat.id
  }, [securityLevel, addAuditLog])

  // Simulate threat detection
  useEffect(() => {
    if (!isMonitoring) return
    const threatInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const threatTypes = [
          {
            type: 'PORT_SCAN',
            severity: 'low' as const,
            description: 'Port scanning detected',
            source: 'External Scanner',
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          },
          {
            type: 'BRUTE_FORCE',
            severity: 'medium' as const,
            description: 'Multiple failed login attempts',
            source: 'Credential Stuffing',
            evidence: { attempts: Math.floor(Math.random() * 100) + 1 }
          },
          {
            type: 'SUSPICIOUS_IP',
            severity: 'high' as const,
            description: 'Connection from suspicious IP',
            source: 'Threat Intelligence',
            ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1`
          },
          {
            type: 'MALWARE',
            severity: 'critical' as const,
            description: 'Potential malware activity detected',
            source: 'Behavioral Analysis',
            evidence: { process: 'suspicious.exe', signature: 'MALWARE_X' }
          }
        ]

        const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)]
        addThreat(threat)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(threatInterval)
  }, [isMonitoring, addThreat])

  const clearThreats = useCallback(() => {
    setThreats([])
    setSecurityLevel('medium')
    setSecurityMetrics(prev => ({
      ...prev,
      totalThreats: 0,
      criticalThreats: 0
    }))

    toast.success('All threats cleared')
  }, [])

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev)

    addAuditLog({
      action: `MONITORING_${!isMonitoring ? 'ENABLED' : 'DISABLED'}`,
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      status: 'success'
    })

    toast.success(`Monitoring ${!isMonitoring ? 'enabled' : 'disabled'}`)
  }, [isMonitoring, addAuditLog])

  const runSecurityScan = useCallback(async (): Promise<ScanResult> => {
    const startTime = Date.now()

    addAuditLog({
      action: 'SECURITY_SCAN_STARTED',
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      status: 'success'
    })

    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate simulated vulnerabilities
    const vulnerabilities: Vulnerability[] = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
      id: generateUUID(),
      type: ['XSS', 'SQLI', 'CSRF', 'RCE', 'IDOR'][Math.floor(Math.random() * 5)],
      severity: (['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]) as 'low' | 'medium' | 'high' | 'critical',
      description: `Vulnerability found in component ${i + 1}`,
      location: `/api/v${Math.floor(Math.random() * 3) + 1}/endpoint`,
      remediation: 'Apply security patch',
      cveId: `CVE-2024-${10000 + i}`,
      cvssScore: parseFloat((Math.random() * 10).toFixed(1))
    }))

    const result: ScanResult = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      threatsFound: vulnerabilities.length,
      vulnerabilities,
      scanDuration: Date.now() - startTime,
      status: 'completed'
    }

    // Update metrics
    setSecurityMetrics(prev => ({
      ...prev,
      lastScanTime: new Date().toISOString(),
      avgResponseTime: (prev.avgResponseTime + result.scanDuration) / 2
    }))

    addAuditLog({
      action: 'SECURITY_SCAN_COMPLETED',
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      status: 'success',
      metadata: { threatsFound: result.threatsFound }
    })

    toast.success(`Security scan completed: ${result.threatsFound} threats found`)

    return result
  }, [addAuditLog])

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    // In production, validate against your auth server
    // This is a simulation
    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 100))

      const isValid = token.length > 10 && token.includes('secure')

      addAuditLog({
        action: 'TOKEN_VALIDATION',
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        status: isValid ? 'success' : 'failure',
        metadata: { tokenLength: token.length }
      })

      return isValid
    } catch (error) {
      addAuditLog({
        action: 'TOKEN_VALIDATION_ERROR',
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        status: 'failure',
        metadata: { error: (error as Error).message }
      })

      return false
    }
  }, [addAuditLog])

  const encryptData = useCallback(async (data: string, key?: string): Promise<string> => {
    // Simple XOR encryption for demonstration
    // In production, use Web Crypto API
    const secretKey = key || 'securestack-2024'
    let result = ''

    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length))
    }

    return btoa(result)
  }, [])

  const decryptData = useCallback(async (encrypted: string, key?: string): Promise<string> => {
    try {
      const secretKey = key || 'securestack-2024'
      const data = atob(encrypted)
      let result = ''

      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length))
      }

      return result
    } catch (err) {
      console.error('Decryption error:', err)
      throw new Error('Decryption failed')
    }
  }, [])

  return (
    <SecurityContext.Provider
      value={{
        securityLevel,
        setSecurityLevel,
        threats,
        addThreat,
        clearThreats,
        isMonitoring,
        toggleMonitoring,
        securityMetrics,
        auditLog,
        addAuditLog,
        runSecurityScan,
        validateToken,
        encryptData,
        decryptData
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurity() {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider')
  }
  return context
}

// Security utility functions
export function sanitizeHTML(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters')
  if (!/\d/.test(password)) errors.push('Password must contain numbers')
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain special characters')

  return {
    valid: errors.length === 0,
    errors
  }
}