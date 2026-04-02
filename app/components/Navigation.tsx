'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield,
  Home, User, Briefcase, FileText, Mail, Menu,
  X, Lock, Terminal, Bell, Settings, LogOut, ChevronDown, Cpu, Globe, Code, Database
} from 'lucide-react'
import { useSecurity } from '@/components/providers/SecurityProvider'
import { useTheme } from '@/components/ThemeProvider'
import { toast } from 'react-hot-toast'

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { securityLevel, threats, toggleMonitoring } = useSecurity()
  const { toggleTheme, isDark } = useTheme()

  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Close mobile menu on route change
    setIsOpen(false)
  }, [pathname])

  // Menu button accessibility improvements
  const handleMenuClick = (): void => {
    setIsOpen((prev) => !prev)
  }

  // Enhanced keyboard navigation for mobile menu
  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      setIsOpen((prev) => !prev)
    }
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home, description: 'Dashboard' },
    { name: 'About', href: '/about', icon: User, description: 'About Me' },
    { name: 'Skills', href: '/skills', icon: Cpu, description: 'Technical Skills' },
    { name: 'Projects', href: '/projects', icon: Briefcase, description: 'Portfolio' },
    { name: 'Experience', href: '/experience', icon: FileText, description: 'Work History' },
    { name: 'Blog', href: '/blog', icon: Code, description: 'Security Insights' },
    { name: 'Contact', href: '/contact', icon: Mail, description: 'Get in Touch' },
  ]

  const securityItems = [
    { name: 'Vulnerability Scanner', href: '/tools/scanner', icon: Shield },
    { name: 'Threat Intelligence', href: '/tools/threat-intel', icon: Globe },
    { name: 'Security Audit', href: '/tools/audit', icon: Database },
    { name: 'Penetration Test', href: '/tools/pen-test', icon: Terminal },
  ]

  const notifications = [
    {
      id: 1,
      title: 'Security Scan Complete',
      description: '3 vulnerabilities found',
      time: '5 minutes ago',
      type: 'security',
      read: false
    },
    {
      id: 2,
      title: 'System Update Available',
      description: 'Security patch v2.4.1',
      time: '1 hour ago',
      type: 'update',
      read: true
    },
    {
      id: 3,
      title: 'New Threat Detected',
      description: 'Port scanning activity',
      time: '2 hours ago',
      type: 'threat',
      read: false
    }
  ]

  const getSecurityLevelColor = () => {
    switch (securityLevel) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-cyber-green'
    }
  }

  const getSecurityLevelText = () => {
    switch (securityLevel) {
      case 'critical': return 'CRITICAL'
      case 'high': return 'HIGH'
      case 'medium': return 'MEDIUM'
      case 'low': return 'LOW'
      default: return 'SECURE'
    }
  }

  return (
    <>
      {/* Security Alert Banner */}
      {securityLevel === 'critical' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 px-4 animate-pulse">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Shield className="w-5 h-5" />
            <span className="font-bold">CRITICAL SECURITY ALERT: System compromised detected</span>
            <button
              onClick={() => toast.success('Emergency protocol initiated')}
              className="ml-4 px-3 py-1 bg-white text-red-600 rounded text-sm font-bold hover:bg-red-50 transition-colors"
            >
              TAKE ACTION
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${isScrolled ? 'bg-cyber-dark/90 backdrop-blur-xl border-b border-cyber-green/20' : 'bg-transparent'}
        ${securityLevel === 'critical' ? 'mt-8' : ''}
      `}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" aria-label="Home">
                <div className="relative">
                  <Shield className="w-8 h-8 text-cyber-green group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getSecurityLevelColor()} animate-pulse`} />
                </div>
                <div className="hidden md:block">
                  <span className="font-cyber text-xl font-bold text-cyber-green tracking-wider">SECURE</span>
                  <span className="font-cyber text-xl font-bold text-white tracking-wider">STACK</span>
                </div>
              </Link>

              {/* Security Status */}
              <div className="hidden lg:flex items-center space-x-2 ml-4">
                <div className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${getSecurityLevelColor()}/30 border-${getSecurityLevelColor()}/50`}
                  role="status"
                  aria-live="polite"
                  aria-label={`Security level: ${getSecurityLevelText()}`}
                >
                  <span className="text-white">{getSecurityLevelText()}</span>
                </div>
                <div className="text-xs text-cyber-green/70 font-mono" aria-label={`${threats.length} threats detected`}>
                  {threats.length} THREATS
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                    relative px-4 py-2 font-mono text-sm transition-all duration-200
                    ${isActive
                        ? 'text-cyber-green'
                        : 'text-cyber-green/70 hover:text-cyber-green'
                      }
                    group
                  `}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.description}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-green" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && showNotifications) {
                      setShowNotifications(false);
                    } else if (e.key === 'ArrowDown' && !showNotifications) {
                      e.preventDefault();
                      setShowNotifications(true);
                    }
                  }}
                  className="touch-target rounded-lg hover:bg-cyber-green/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Open notifications"
                  aria-expanded={showNotifications ? 'true' : 'false'}
                  aria-controls="notifications-menu"
                >
                  <Bell className="w-5 h-5 text-cyber-green" aria-hidden="true" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center"
                      aria-label={`${notifications.filter(n => !n.read).length} unread notifications`}
                    >
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                <div
                  id="notifications-menu"
                  className={`absolute right-0 mt-2 w-80 bg-cyber-dark border border-cyber-green/30 rounded-lg shadow-xl backdrop-blur-xl z-50 transition-all duration-300 overflow-hidden ${
                    showNotifications
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                  }`}
                  role="menu"
                >
                  {showNotifications && (
                    <>
                      <div className="p-4 border-b border-cyber-green/20">
                        <h3 className="font-bold text-cyber-green">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => setShowNotifications(false)}
                            className={`w-full text-left p-4 border-b border-cyber-green/10 hover:bg-cyber-green/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${!notification.read ? 'bg-cyber-green/5' : ''
                              }`}
                            role="menuitem"
                            aria-label={`${notification.title}: ${notification.description}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-bold text-sm">{notification.title}</div>
                                <div className="text-sm text-cyber-green/70 mt-1">
                                  {notification.description}
                                </div>
                              </div>
                              <div className="text-xs text-cyber-green/50">
                                {notification.time}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-cyber-green rounded-full mt-2" aria-label="Unread" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="p-3 border-t border-cyber-green/20">
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="w-full text-center text-sm text-cyber-green hover:text-cyber-blue transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          role="menuitem"
                        >
                          View all notifications
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Security Controls */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleMonitoring}
                  className="touch-target rounded-lg hover:bg-cyber-green/10 transition-colors group"
                  aria-label="Toggle security monitoring"
                >
                  <div className="relative">
                    <Lock className={`w-5 h-5 ${securityLevel === 'critical' ? 'text-red-500' : 'text-cyber-green'}`} aria-hidden="true" />
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getSecurityLevelColor()} animate-pulse`} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="touch-target rounded-lg hover:bg-cyber-green/10 transition-colors"
                  aria-label={mounted && isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                  {mounted ? (
                    isDark ? (
                      <div className="w-5 h-5 text-cyber-green" aria-hidden="true">☀️</div>
                    ) : (
                      <div className="w-5 h-5 text-cyber-green" aria-hidden="true">🌙</div>
                    )
                  ) : (
                    <div className="w-5 h-5 text-cyber-green" aria-hidden="true">🌙</div>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && showUserMenu) {
                      setShowUserMenu(false);
                    } else if (e.key === 'ArrowDown' && !showUserMenu) {
                      e.preventDefault();
                      setShowUserMenu(true);
                    }
                  }}
                  className="touch-target rounded-lg hover:bg-cyber-green/10 transition-colors flex items-center space-x-2"
                  aria-label="Open user menu"
                  aria-expanded={showUserMenu ? 'true' : 'false'}
                  aria-controls="user-menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyber-green to-cyber-blue rounded-full flex items-center justify-center">
                    <span className="font-bold text-cyber-dark" aria-hidden="true">SS</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-cyber-green" aria-hidden="true" />
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-cyber-dark border border-cyber-green/30 rounded-lg shadow-xl backdrop-blur-xl z-50 transition-all duration-300 overflow-hidden ${
                  showUserMenu
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 -translate-y-2 invisible'
                }`}
                id="user-menu"
                role="menu">
                  {showUserMenu && (
                    <>
                      <div className="p-4 border-b border-cyber-green/20">
                        <div className="font-bold text-cyber-green">Security Admin</div>
                        <div className="text-sm text-cyber-green/70">admin@securestack.dev</div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/settings/profile"
                          className="flex items-center space-x-2 p-2 hover:bg-cyber-green/10 rounded transition-colors"
                          role="menuitem"
                          aria-label="Go to profile"
                        >
                          <User className="w-4 h-4" aria-hidden="true" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 p-2 hover:bg-cyber-green/10 rounded transition-colors"
                          role="menuitem"
                          aria-label="Go to settings"
                        >
                          <Settings className="w-4 h-4" aria-hidden="true" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/security"
                          className="flex items-center space-x-2 p-2 hover:bg-cyber-green/10 rounded transition-colors"
                          role="menuitem"
                          aria-label="Go to security settings"
                        >
                          <Shield className="w-4 h-4" aria-hidden="true" />
                          <span>Security</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-cyber-green/20">
                        <button
                          type="button"
                          onClick={() => toast.success('Logged out successfully')}
                          className="flex items-center space-x-2 p-2 hover:bg-red-500/10 text-red-400 w-full rounded transition-colors"
                          role="menuitem"
                          aria-label="Logout"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleMenuKeyDown}
                className="touch-target rounded-lg hover:bg-cyber-green/10 transition-colors lg:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls="mobile-menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-cyber-green" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6 text-cyber-green" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav
            id="mobile-menu"
            className={`lg:hidden bg-cyber-dark/95 backdrop-blur-xl border-t border-cyber-green/20 transition-all duration-300 overflow-hidden ${
              isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Navigation Items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                      ${pathname === item.href
                        ? 'bg-cyber-green/10 text-cyber-green'
                        : 'hover:bg-cyber-green/5 text-cyber-green/70 hover:text-cyber-green'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-cyber-green/50">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Security Section */}
              <div className="mt-6 pt-4 border-t border-cyber-green/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-cyber-green">Security Tools</h3>
                  <button
                    onClick={toggleMonitoring}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${securityLevel === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-cyber-green/20 text-cyber-green'
                      }`}
                  >
                    {getSecurityLevelText()}
                  </button>
                </div>
                <div className="space-y-1">
                  {securityItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cyber-green/5 transition-colors text-cyber-green/70 hover:text-cyber-green"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Actions */}
              <div className="mt-6 pt-4 border-t border-cyber-green/20">
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyber-green to-cyber-blue rounded-full flex items-center justify-center">
                    <span className="font-bold text-cyber-dark">SS</span>
                  </div>
                  <div>
                    <div className="font-bold text-cyber-green">Security Admin</div>
                    <div className="text-sm text-cyber-green/70">admin@securestack.dev</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link
                    href="/settings"
                    className="p-2 text-center bg-cyber-green/10 text-cyber-green rounded hover:bg-cyber-green/20 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => toast.success('Logged out successfully')}
                    className="p-2 text-center bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </nav>

      {/* Network Status Indicator */}
      <div className="fixed bottom-4 right-20 z-30">
        <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-green/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-cyber-green">ONLINE</span>
        </div>
      </div>
    </>
  )
}