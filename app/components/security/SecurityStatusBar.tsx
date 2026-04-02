'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Network,
  HardDrive,
  Zap
} from 'lucide-react'
import { useSecurity } from '@/components/providers/SecurityProvider'
import { toast } from 'react-hot-toast'

interface SystemStatus {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: number
  responseTime: number
  lastIncident: string | null
}

export default function SecurityStatusBar() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { id: 'api-gateway', name: 'API Gateway', status: 'operational', uptime: 99.99, responseTime: 45, lastIncident: null },
    { id: 'database', name: 'Database Cluster', status: 'operational', uptime: 99.95, responseTime: 12, lastIncident: null },
    { id: 'cdn', name: 'CDN Network', status: 'operational', uptime: 99.99, responseTime: 8, lastIncident: null },
    { id: 'firewall', name: 'Firewall', status: 'operational', uptime: 99.98, responseTime: 2, lastIncident: null },
    { id: 'monitoring', name: 'Monitoring', status: 'operational', uptime: 99.97, responseTime: 5, lastIncident: null },
    { id: 'backup', name: 'Backup System', status: 'maintenance', uptime: 99.90, responseTime: 150, lastIncident: '2024-03-15' },
  ])

  const [metrics, setMetrics] = useState({
    activeThreats: 3,
    blockedAttacks: 1247,
    avgResponseTime: 28,
    dataProcessed: 145.7,
    encryptionStrength: 256,
    complianceScore: 98.7
  })

  const [showDetails, setShowDetails] = useState(false)
  const { securityLevel, threats, isMonitoring, toggleMonitoring } = useSecurity()

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeThreats: Math.max(0, prev.activeThreats + (Math.random() > 0.7 ? 1 : -1)),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 10),
        avgResponseTime: Math.max(10, prev.avgResponseTime + (Math.random() - 0.5) * 5),
        dataProcessed: prev.dataProcessed + (Math.random() * 0.1)
      }))

      // Occasionally update system status
      if (Math.random() > 0.95) {
        setSystemStatus(prev => prev.map(system =>
          Math.random() > 0.98 ? {
            ...system,
            status: (['operational', 'degraded'][Math.floor(Math.random() * 2)]) as 'operational' | 'degraded',
            responseTime: system.responseTime * (0.8 + Math.random() * 0.4)
          } : system
        ))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-500'
      case 'degraded': return 'text-yellow-500'
      case 'outage': return 'text-red-500'
      case 'maintenance': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'degraded': return AlertTriangle
      case 'outage': return XCircle
      case 'maintenance': return Clock
      default: return Activity
    }
  }

  const handleSystemTest = (systemId: string) => {
    const system = systemStatus.find(s => s.id === systemId)
    if (system) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 1000)),
        {
          loading: `Testing ${system.name}...`,
          success: `${system.name} test completed: ${system.status.toUpperCase()}`,
          error: `Test failed for ${system.name}`
        }
      )
    }
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-green/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Left side - Security Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${securityLevel === 'critical' ? 'bg-red-500' :
                  securityLevel === 'high' ? 'bg-orange-500' :
                    securityLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
              <span className="text-xs font-mono text-cyber-green">
                SECURITY: <span className="font-bold">{securityLevel.toUpperCase()}</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-cyber-green" />
                <span className="text-xs text-foreground/70">
                  Threats: <span className="font-mono text-cyber-green">{threats.length}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-cyber-green" />
                <span className="text-xs text-foreground/70">
                  Response: <span className="font-mono text-cyber-green">{metrics.avgResponseTime}ms</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Network className="w-3 h-3 text-cyber-green" />
                <span className="text-xs text-foreground/70">
                  Data: <span className="font-mono text-cyber-green">{metrics.dataProcessed.toFixed(1)}GB</span>
                </span>
              </div>
            </div>
          </div>

          {/* Middle - Monitoring Status */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs text-foreground/70">
                Monitoring: <span className={`font-mono ${isMonitoring ? 'text-green-500' : 'text-red-500'}`}>
                  {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </span>
            </div>

            <button
              onClick={toggleMonitoring}
              className="text-xs px-2 py-1 border border-cyber-green/30 rounded hover:bg-cyber-green/10 transition-colors"
            >
              {isMonitoring ? 'PAUSE' : 'RESUME'}
            </button>
          </div>

          {/* Right side - System Status Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden xl:flex items-center space-x-2">
              {systemStatus.slice(0, 3).map(system => {
                const StatusIcon = getStatusIcon(system.status)
                return (
                  <button
                    key={system.id}
                    onClick={() => handleSystemTest(system.id)}
                    className="flex items-center space-x-1 group"
                    title={`${system.name}: ${system.status} (${system.uptime}% uptime)`}
                  >
                    <StatusIcon className={`w-3 h-3 ${getStatusColor(system.status)}`} />
                    <span className="text-xs text-foreground/70 group-hover:text-cyber-green transition-colors">
                      {system.name.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors flex items-center space-x-2"
            >
              <Activity className="w-3 h-3" />
              <span>{showDetails ? 'HIDE DETAILS' : 'SHOW DETAILS'}</span>
            </button>
          </div>
        </div>

        {/* Expanded Details Panel */}
        <>
          {showDetails && (
            <div
              className="overflow-hidden"
            >
              <div className="py-4 border-t border-cyber-green/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* System Status Grid */}
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-cyber-green mb-3 flex items-center">
                      <HardDrive className="w-4 h-4 mr-2" />
                      System Status
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {systemStatus.map(system => {
                        const StatusIcon = getStatusIcon(system.status)
                        return (
                          <div
                            key={system.id}
                            className={`p-3 rounded border ${system.status === 'operational' ? 'border-green-500/30 bg-green-500/5' :
                                system.status === 'degraded' ? 'border-yellow-500/30 bg-yellow-500/5' :
                                  system.status === 'outage' ? 'border-red-500/30 bg-red-500/5' :
                                    'border-blue-500/30 bg-blue-500/5'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <StatusIcon className={`w-4 h-4 ${getStatusColor(system.status)}`} />
                                <span className="text-sm font-medium">{system.name}</span>
                              </div>
                              <button
                                onClick={() => handleSystemTest(system.id)}
                                className="text-xs px-2 py-1 border border-cyber-green/30 rounded hover:bg-cyber-green/10 transition-colors"
                              >
                                Test
                              </button>
                            </div>
                            <div className="text-xs text-foreground/70 space-y-1">
                              <div className="flex justify-between">
                                <span>Uptime:</span>
                                <span className="font-mono">{system.uptime}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Response:</span>
                                <span className="font-mono">{system.responseTime}ms</span>
                              </div>
                              {system.lastIncident && (
                                <div className="flex justify-between">
                                  <span>Last Incident:</span>
                                  <span className="font-mono">{system.lastIncident}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Security Metrics */}
                  <div>
                    <h3 className="text-sm font-bold text-cyber-green mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Metrics
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(metrics).map(([key, value]) => (
                        <div key={key} className="p-3 rounded border border-cyber-green/20 bg-cyber-dark/50">
                          <div className="text-xs text-foreground/50 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                          </div>
                          <div className="text-lg font-bold font-mono text-cyber-green">
                            {typeof value === 'number' && key.includes('Score') ? `${value}%` :
                              typeof value === 'number' && key.includes('Strength') ? `${value}-bit` :
                                typeof value === 'number' && key.includes('Processed') ? `${value} GB` :
                                  typeof value === 'number' && key.includes('Time') ? `${value}ms` :
                                    value.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Threats */}
                  <div>
                    <h3 className="text-sm font-bold text-cyber-green mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Recent Threats
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {threats.slice(0, 5).map(threat => (
                        <div
                          key={threat.id}
                          className={`p-2 rounded border text-xs ${threat.severity === 'critical' ? 'border-red-500/30 bg-red-500/10' :
                              threat.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10' :
                                threat.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/10' :
                                  'border-green-500/30 bg-green-500/10'
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{threat.type.replace(/_/g, ' ')}</div>
                              <div className="text-foreground/70">{threat.description}</div>
                            </div>
                            <div className="text-foreground/50 text-right">
                              <div>{new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              <div className={`font-bold ${threat.severity === 'critical' ? 'text-red-400' :
                                  threat.severity === 'high' ? 'text-orange-400' :
                                    threat.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                {threat.severity.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {threats.length === 0 && (
                        <div className="p-3 text-center text-foreground/50 text-sm">
                          No threats detected
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => toast.success('Emergency protocols initiated')}
                        className="w-full px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-sm font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>INITIATE EMERGENCY PROTOCOL</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  )
}