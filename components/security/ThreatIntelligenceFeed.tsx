'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Globe,
  Shield,
  TrendingUp,
  ExternalLink,
  Filter,
  RefreshCw,
  Download,
  Bell,
  Zap,
  Cpu,
  Network,
  Lock,
  Eye
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ThreatIntel {
  id: string
  type: 'malware' | 'vulnerability' | 'phishing' | 'ddos' | 'exploit' | 'breach'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  source: string
  timestamp: string
  affected: string[]
  indicators: string[]
  confidence: number
  cveId?: string
  mitigation: string
}

export default function ThreatIntelligenceFeed() {
  const [threats, setThreats] = useState<ThreatIntel[]>([
    {
      id: '1',
      type: 'vulnerability',
      severity: 'critical',
      title: 'Log4Shell Zero-Day Exploit',
      description: 'Critical RCE vulnerability in Apache Log4j library',
      source: 'CISA',
      timestamp: '2024-03-20T10:30:00Z',
      affected: ['Java applications', 'Enterprise software'],
      indicators: ['${jndi:ldap://', '${jndi:rmi://'],
      confidence: 98,
      cveId: 'CVE-2024-12345',
      mitigation: 'Update to Log4j 2.17.0 or apply vendor patches'
    },
    {
      id: '2',
      type: 'malware',
      severity: 'high',
      title: 'LockBit 3.0 Ransomware Campaign',
      description: 'Active ransomware campaign targeting financial sector',
      source: 'Kaspersky',
      timestamp: '2024-03-19T14:20:00Z',
      affected: ['Windows servers', 'Network shares'],
      indicators: ['lockbit.exe', '.lockbit extension'],
      confidence: 95,
      mitigation: 'Implement network segmentation and backup strategy'
    },
    {
      id: '3',
      type: 'phishing',
      severity: 'medium',
      title: 'Microsoft 365 Credential Harvesting',
      description: 'Sophisticated phishing campaign targeting enterprise accounts',
      source: 'Proofpoint',
      timestamp: '2024-03-18T09:15:00Z',
      affected: ['Office 365 users', 'Azure AD'],
      indicators: ['login.microsoftonline.verify-account.com'],
      confidence: 85,
      mitigation: 'Enable MFA and user awareness training'
    },
    {
      id: '4',
      type: 'ddos',
      severity: 'high',
      title: 'Mirai Botnet Amplification Attack',
      description: 'Large-scale DDoS attacks using IoT devices',
      source: 'Cloudflare',
      timestamp: '2024-03-17T16:45:00Z',
      affected: ['Web servers', 'DNS infrastructure'],
      indicators: ['UDP port 53', 'DNS query amplification'],
      confidence: 90,
      mitigation: 'Implement DDoS protection and rate limiting'
    },
    {
      id: '5',
      type: 'exploit',
      severity: 'critical',
      title: 'Windows Print Spooler Privilege Escalation',
      description: 'Local privilege escalation vulnerability',
      source: 'Microsoft',
      timestamp: '2024-03-16T11:20:00Z',
      affected: ['Windows 10/11', 'Windows Server'],
      indicators: ['spoolsv.exe', 'PrintNightmare'],
      confidence: 97,
      cveId: 'CVE-2024-56789',
      mitigation: 'Apply Microsoft security update KB5005565'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [sortBy, setSortBy] = useState<'severity' | 'timestamp'>('severity')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [expandedThreat, setExpandedThreat] = useState<string | null>(null)

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Simulate new threat intelligence
      if (Math.random() > 0.7) {
        const newThreat: ThreatIntel = {
          id: Date.now().toString(),
          type: (['malware', 'vulnerability', 'phishing', 'ddos', 'exploit'][Math.floor(Math.random() * 5)]) as ThreatIntel['type'],
          severity: (['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)]) as 'critical' | 'high' | 'medium' | 'low',
          title: `New ${['Attack', 'Vulnerability', 'Campaign'][Math.floor(Math.random() * 3)]} Detected`,
          description: 'New threat intelligence identified by our systems',
          source: ['CISA', 'SANS', 'MITRE', 'NIST'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          affected: ['Multiple systems'],
          indicators: ['TBD'],
          confidence: Math.floor(Math.random() * 30) + 70,
          mitigation: 'Investigate and apply security controls'
        }

        setThreats(prev => [newThreat, ...prev])

        // Show toast for critical/high threats
        if (newThreat.severity === 'critical') {
          toast.error(`🚨 CRITICAL: ${newThreat.title}`, {
            duration: 5000
          })
        } else if (newThreat.severity === 'high') {
          toast('⚠️ HIGH: ' + newThreat.title, {
            duration: 3000,
            icon: '⚠️'
          })
        }
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredThreats = threats
    .filter(threat => filter === 'all' || threat.severity === filter)
    .sort((a, b) => {
      if (sortBy === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

  const getTypeIcon = (type: ThreatIntel['type']) => {
    switch (type) {
      case 'malware': return Shield
      case 'vulnerability': return AlertTriangle
      case 'phishing': return Globe
      case 'ddos': return Zap
      case 'exploit': return Cpu
      case 'breach': return Lock
      default: return Network
    }
  }

  const getSeverityColor = (severity: ThreatIntel['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
    }
  }

  const getSeverityBg = (severity: ThreatIntel['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/30'
      case 'high': return 'bg-orange-500/10 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'bg-green-500/10 border-green-500/30'
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(filteredThreats, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `threat-intel-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Threat intelligence exported successfully')
  }

  const handleRefresh = () => {
    toast.loading('Refreshing threat intelligence...')
    setTimeout(() => {
      toast.success('Threat intelligence refreshed')
    }, 1000)
  }

  const handleMarkAsRead = (id: string) => {
    setThreats(prev => prev.filter(threat => threat.id !== id))
    toast.success('Threat marked as read')
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-green/30 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-cyber-green" />
          <div>
            <h3 className="font-bold text-cyber-green text-sm">Threat Intelligence</h3>
            <p className="text-xs text-cyber-green/70">Real-time threat feed</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-cyber-green/10 rounded transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4 text-cyber-green" />
          </button>
          <button
            onClick={handleExport}
            className="p-1 hover:bg-cyber-green/10 rounded transition-colors"
            title="Export data"
          >
            <Download className="w-4 h-4 text-cyber-green" />
          </button>
          <div className="flex items-center space-x-1">
            <Bell className="w-4 h-4 text-cyber-green" />
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only"
                id="auto-refresh"
              />
              <label
                htmlFor="auto-refresh"
                className={`w-8 h-4 rounded-full transition-colors cursor-pointer inline-flex items-center ${autoRefresh ? 'bg-cyber-green' : 'bg-cyber-green/30'
                  }`}
                aria-label="Auto-refresh threat intelligence"
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoRefresh ? 'transform translate-x-5' : 'transform translate-x-1'
                  }`} />
                <span className="sr-only">{autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 bg-cyber-dark/80 border-x border-cyber-green/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-cyber-green" />
            <div className="flex flex-wrap gap-1">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map(severity => (
                <button
                  key={severity}
                  onClick={() => setFilter(severity)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${filter === severity
                    ? 'bg-cyber-green text-cyber-dark'
                    : 'bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20'
                    }`}
                >
                  {severity.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-xs text-cyber-green">Sort:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'severity')}
              className="bg-cyber-dark border border-cyber-green/30 text-cyber-green text-xs px-2 py-1 rounded"
              aria-label="Sort threats by"
            >
              <option value="severity">Sort by Severity</option>
              <option value="timestamp">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats List */}
      <div className="max-h-96 overflow-y-auto border-x border-cyber-green/30">
        <>
          {filteredThreats.map((threat) => {
            const TypeIcon = getTypeIcon(threat.type)
            return (
              <div
                key={threat.id}
                className={`p-3 border-b border-cyber-green/20 hover:bg-cyber-green/5 transition-colors cursor-pointer ${getSeverityBg(threat.severity)
                  }`}
                onClick={() => setExpandedThreat(expandedThreat === threat.id ? null : threat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <TypeIcon className="w-5 h-5 text-cyber-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-sm">{threat.title}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityBg(threat.severity)} ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </span>
                        {threat.cveId && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">
                            {threat.cveId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 mb-2">{threat.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{threat.source}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{threat.confidence}% confidence</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>Affects: {threat.affected.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-xs text-foreground/50">
                      {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(threat.id)
                      }}
                      className="p-1 hover:bg-cyber-green/10 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4 text-cyber-green/70" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <>
                  {expandedThreat === threat.id && (
                    <div
                      className="mt-3 pt-3 border-t border-cyber-green/20"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Indicators */}
                        <div>
                          <h5 className="text-sm font-bold text-cyber-green mb-2">Indicators of Compromise</h5>
                          <div className="space-y-1">
                            {threat.indicators.map((indicator, idx) => (
                              <div
                                key={idx}
                                className="px-2 py-1 bg-cyber-dark border border-cyber-green/20 rounded text-xs font-mono"
                              >
                                {indicator}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mitigation */}
                        <div>
                          <h5 className="text-sm font-bold text-cyber-green mb-2">Mitigation Steps</h5>
                          <div className="p-3 bg-cyber-dark/50 border border-cyber-green/20 rounded text-sm">
                            {threat.mitigation}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyber-green/20">
                        <button className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors">
                          Create Alert Rule
                        </button>
                        <button className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Full Report</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              </div>
            )
          })}
        </>

        {filteredThreats.length === 0 && (
          <div className="p-6 text-center">
            <Shield className="w-12 h-12 text-cyber-green/30 mx-auto mb-3" />
            <p className="text-cyber-green/70">No threats match the selected filter</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-green/30 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-cyber-green/70">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Critical: {threats.filter(t => t.severity === 'critical').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>High: {threats.filter(t => t.severity === 'high').length}</span>
            </div>
          </div>
          <div>
            Total: {threats.length} threats
          </div>
        </div>
      </div>

      {/* Threat Level Indicator */}
      <div className="absolute -top-2 -right-2">
        <div className="relative">
          <div className="w-4 h-4 bg-gradient-to-br from-cyber-green to-cyber-blue rounded-full animate-ping" />
          <div className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-cyber-green to-cyber-blue rounded-full" />
        </div>
      </div>
    </div>
  )
}