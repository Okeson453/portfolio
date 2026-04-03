'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Shield,
  Award,
  Lock,
  Clock,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  FileText,
  BadgeCheck
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ComplianceStandard {
  id: string
  name: string
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'in-progress'
  score: number
  lastAudit: string
  nextAudit: string
  controls: number
  passed: number
  failed: number
  description: string
  certification: boolean
}

export default function ComplianceBadge() {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null)

  const [standards] = useState<ComplianceStandard[]>([
    {
      id: 'iso27001',
      name: 'ISO 27001:2022',
      status: 'compliant',
      score: 98.7,
      lastAudit: '2024-01-15',
      nextAudit: '2025-01-15',
      controls: 114,
      passed: 112,
      failed: 2,
      description: 'Information Security Management',
      certification: true
    },
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      status: 'compliant',
      score: 99.2,
      lastAudit: '2024-02-20',
      nextAudit: '2024-08-20',
      controls: 65,
      passed: 64,
      failed: 1,
      description: 'Trust Services Criteria',
      certification: true
    },
    {
      id: 'pcidss',
      name: 'PCI DSS 4.0',
      status: 'compliant',
      score: 100,
      lastAudit: '2024-03-10',
      nextAudit: '2025-03-10',
      controls: 325,
      passed: 325,
      failed: 0,
      description: 'Payment Card Security',
      certification: true
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      status: 'compliant',
      score: 97.5,
      lastAudit: '2024-01-30',
      nextAudit: 'Ongoing',
      controls: 89,
      passed: 87,
      failed: 2,
      description: 'Data Protection Regulation',
      certification: true
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      status: 'compliant',
      score: 96.8,
      lastAudit: '2024-02-15',
      nextAudit: '2024-08-15',
      controls: 76,
      passed: 73,
      failed: 3,
      description: 'Healthcare Security',
      certification: true
    },
    {
      id: 'nist',
      name: 'NIST 800-53',
      status: 'in-progress',
      score: 82.4,
      lastAudit: '2024-03-01',
      nextAudit: '2024-06-01',
      controls: 312,
      passed: 257,
      failed: 55,
      description: 'Security Controls',
      certification: false
    }
  ])

  const getStatusColor = (status: ComplianceStandard['status']) => {
    switch (status) {
      case 'compliant': return 'text-green-500'
      case 'partially-compliant': return 'text-yellow-500'
      case 'non-compliant': return 'text-red-500'
      case 'in-progress': return 'text-blue-500'
    }
  }

  const getStatusBg = (status: ComplianceStandard['status']) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/10 border-green-500/30'
      case 'partially-compliant': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'non-compliant': return 'bg-red-500/10 border-red-500/30'
      case 'in-progress': return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  const getStatusIcon = (status: ComplianceStandard['status']) => {
    switch (status) {
      case 'compliant': return CheckCircle
      case 'partially-compliant': return AlertCircle
      case 'non-compliant': return AlertCircle
      case 'in-progress': return Clock
    }
  }

  const overallCompliance = standards.reduce((acc, standard) => acc + standard.score, 0) / standards.length

  const handleRunAudit = (standardId: string) => {
    const standard = standards.find(s => s.id === standardId)
    if (standard) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 2000)),
        {
          loading: `Running ${standard.name} audit...`,
          success: `${standard.name} audit completed`,
          error: `Audit failed for ${standard.name}`
        }
      )
    }
  }

  const handleDownloadReport = (standardId: string) => {
    const standard = standards.find(s => s.id === standardId)
    if (standard) {
      toast.success(`Downloading ${standard.name} compliance report...`)
      // In production, this would download actual report
    }
  }

  const selectedStandardData = selectedStandard
    ? standards.find(s => s.id === selectedStandard)
    : null

  return (
    <>
      {/* Compact Badge */}
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="group relative"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyber-green rounded-full flex items-center justify-center shadow-lg border-2 border-cyber-green/30 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -right-2 bg-cyber-dark border border-cyber-green/30 rounded-full px-2 py-1 text-xs text-cyber-green font-bold">
            {overallCompliance.toFixed(1)}%
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-cyber-dark border border-cyber-green/30 rounded-lg shadow-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyber-green" />
              <span className="font-bold text-cyber-green">Compliance Status</span>
            </div>
            <BadgeCheck className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Overall Score</span>
              <span className="font-bold text-cyber-green">{overallCompliance.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Standards</span>
              <span className="font-mono text-cyber-green">{standards.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Certifications</span>
              <span className="font-mono text-cyber-green">{standards.filter(s => s.certification).length}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cyber-green/20">
            <div className="text-xs text-cyber-green/70 text-center">
              Click for full compliance dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Dashboard */}
      {showDetails && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            showDetails ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          />

          {/* Dashboard */}
          <div className="relative w-full max-w-6xl bg-cyber-dark border border-cyber-green/30 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-darker border-b border-cyber-green/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-8 h-8 text-cyber-green" />
                    <div>
                      <h2 className="text-xl font-bold text-cyber-green">Compliance Dashboard</h2>
                      <p className="text-sm text-cyber-green/70">Enterprise security compliance overview</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toast.success('Generating compliance report...')}
                      className="flex items-center space-x-2 px-4 py-2 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Full Report</span>
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 hover:bg-cyber-green/10 rounded transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="p-6 border-b border-cyber-green/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-cyber-green/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-400">Overall Score</span>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-green-500">{overallCompliance.toFixed(1)}%</div>
                    <div className="text-xs text-green-400/70 mt-1">↑ 2.3% from last quarter</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyber-blue/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-400">Standards</span>
                      <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-500">{standards.length}</div>
                    <div className="text-xs text-blue-400/70 mt-1">{standards.filter(s => s.certification).length} certified</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-cyber-purple/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-purple-400">Controls</span>
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-purple-500">
                      {standards.reduce((acc, s) => acc + s.controls, 0)}
                    </div>
                    <div className="text-xs text-purple-400/70 mt-1">Controls monitored</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-400">Pass Rate</span>
                      <CheckCircle className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="text-3xl font-bold text-cyan-500">
                      {((standards.reduce((acc, s) => acc + s.passed, 0) /
                        standards.reduce((acc, s) => acc + s.controls, 0)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-cyan-400/70 mt-1">Controls passed</div>
                  </div>
                </div>
              </div>

              {/* Standards Grid */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-cyber-green">Compliance Standards</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors">
                      Refresh All
                    </button>
                    <button className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors">
                      Export All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {standards.map((standard) => {
                    const StatusIcon = getStatusIcon(standard.status)
                    return (
                      <div
                        key={standard.id}
                        className={`p-4 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${getStatusBg(standard.status)
                          } ${selectedStandard === standard.id ? 'ring-2 ring-cyber-green' : ''}`}
                        onClick={() => setSelectedStandard(
                          selectedStandard === standard.id ? null : standard.id
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <StatusIcon className={`w-5 h-5 ${getStatusColor(standard.status)}`} />
                              <h4 className="font-bold text-cyber-green">{standard.name}</h4>
                            </div>
                            <p className="text-sm text-foreground/70">{standard.description}</p>
                          </div>
                          {standard.certification && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>

                        <div className="space-y-3">
                          {/* Score Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-foreground/70">Compliance Score</span>
                              <span className="font-bold text-cyber-green">{standard.score}%</span>
                            </div>
                            <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                              {/* eslint-disable-next-line */}
                              <div
                                className={`h-full rounded-full ${standard.status === 'compliant' ? 'bg-green-500' :
                                  standard.status === 'partially-compliant' ? 'bg-yellow-500' :
                                    standard.status === 'non-compliant' ? 'bg-red-500' : 'bg-blue-500'
                                  }`}
                                style={{ width: `${standard.score}%` } as React.CSSProperties}
                              />
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-cyber-dark/50 rounded">
                              <div className="text-lg font-bold text-green-500">{standard.passed}</div>
                              <div className="text-xs text-foreground/70">Passed</div>
                            </div>
                            <div className="p-2 bg-cyber-dark/50 rounded">
                              <div className="text-lg font-bold text-red-500">{standard.failed}</div>
                              <div className="text-xs text-foreground/70">Failed</div>
                            </div>
                            <div className="p-2 bg-cyber-dark/50 rounded">
                              <div className="text-lg font-bold text-cyber-green">{standard.controls}</div>
                              <div className="text-xs text-foreground/70">Total</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-cyber-green/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRunAudit(standard.id)
                              }}
                              className="text-xs px-2 py-1 bg-cyber-green/10 hover:bg-cyber-green/20 rounded transition-colors flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Audit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadReport(standard.id)
                              }}
                              className="text-xs px-2 py-1 bg-cyber-green/10 hover:bg-cyber-green/20 rounded transition-colors flex items-center space-x-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Report</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedStandard(standard.id)
                              }}
                              className="text-xs px-2 py-1 bg-cyber-green/10 hover:bg-cyber-green/20 rounded transition-colors flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Standard Details */}
              {selectedStandardData && (
                <div
                  className={`border-t border-cyber-green/20 transition-all duration-300 overflow-hidden ${
                    selectedStandardData ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-cyber-green">{selectedStandardData.name}</h3>
                          <p className="text-cyber-green/70">{selectedStandardData.description}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${getStatusBg(selectedStandardData.status)}`}>
                          <span className={`font-bold ${getStatusColor(selectedStandardData.status)}`}>
                            {selectedStandardData.status.toUpperCase().replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Audit Information */}
                        <div className="lg:col-span-2">
                          <h4 className="text-lg font-bold text-cyber-green mb-4">Audit Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded">
                              <div className="text-sm text-foreground/70 mb-1">Last Audit</div>
                              <div className="text-lg font-bold text-cyber-green">
                                {new Date(selectedStandardData.lastAudit).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded">
                              <div className="text-sm text-foreground/70 mb-1">Next Audit</div>
                              <div className="text-lg font-bold text-cyber-green">
                                {selectedStandardData.nextAudit === 'Ongoing'
                                  ? 'Continuous Monitoring'
                                  : new Date(selectedStandardData.nextAudit).toLocaleDateString()
                                }
                              </div>
                            </div>
                            <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded">
                              <div className="text-sm text-foreground/70 mb-1">Controls Assessed</div>
                              <div className="text-lg font-bold text-cyber-green">
                                {selectedStandardData.controls}
                              </div>
                            </div>
                            <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded">
                              <div className="text-sm text-foreground/70 mb-1">Compliance Score</div>
                              <div className="text-lg font-bold text-cyber-green">
                                {selectedStandardData.score}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Panel */}
                        <div>
                          <h4 className="text-lg font-bold text-cyber-green mb-4">Actions</h4>
                          <div className="space-y-3">
                            <button className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors text-left">
                              <div className="font-bold text-cyber-green">Generate Report</div>
                              <div className="text-sm text-foreground/70">Create detailed compliance report</div>
                            </button>
                            <button className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors text-left">
                              <div className="font-bold text-cyber-green">Schedule Audit</div>
                              <div className="text-sm text-foreground/70">Plan next compliance audit</div>
                            </button>
                            <button className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors text-left">
                              <div className="font-bold text-cyber-green">Remediation Plan</div>
                              <div className="text-sm text-foreground/70">Address failed controls</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Footer */}
              <div className="p-4 bg-gradient-to-r from-cyber-dark to-cyber-darker border-t border-cyber-green/30">
                <div className="flex items-center justify-between text-sm text-cyber-green/70">
                  <div>
                    Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>All data is encrypted and secured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}