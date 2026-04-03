'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Heart,
  Coffee,
  Terminal,
  Lock,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';

const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' },
  ],
  'Services': [
    { name: 'Security Audits', href: '#' },
    { name: 'Web Development', href: '#' },
    { name: 'Penetration Testing', href: '#' },
    { name: 'Consulting', href: '#' },
  ],
  'Resources': [
    { name: 'Documentation', href: '#' },
    { name: 'Security Tools', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'GitHub', href: '#' },
  ],
};

export function Footer() {
  const [easterEgg, setEasterEgg] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + E for easter egg - using code for reliability
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.code === 'KeyE' || e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        setEasterEgg(true);
        setTimeout(() => {
          setEasterEgg(false);
        }, 3000);
        return;
      }

      // Alt + S for show/hide secret - using code for reliability
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.code === 'KeyS' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setShowSecret(prev => !prev);
        return;
      }

      // Ctrl + ? or Shift + / for help
      if ((e.ctrlKey || e.shiftKey) && (e.key === '?' || e.code === 'Slash')) {
        e.preventDefault();
        alert('Footer Keyboard Shortcuts:\n\n✨ Alt+E: Toggle Easter Egg\n🔐 Alt+S: Show/Hide Secret\n❓ Ctrl+?: Display This Help');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEasterEgg = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      setEasterEgg(true);
      setTimeout(() => {
        setEasterEgg(false);
        setClickCount(0);
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      {/* Easter Egg Area — Accessible with keyboard */}
      <div
        className="absolute top-0 left-0 right-0 h-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={handleEasterEgg}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEasterEgg();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Secret easter egg - click or press Enter"
      />

      {easterEgg && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
          <div className="text-center p-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl border border-blue-500/20 shadow-2xl">
            <Terminal className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
            <div className="font-mono text-lg text-gray-900 dark:text-white mb-2">
              $ echo "Easter Egg Discovered!"
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              You found the secret! 🎯
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                SecureStack
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Building secure digital solutions with cutting-edge technology and
              security-first principles.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSecret ? 'Hide Secret' : 'Show Secret'}
              </button>
              {showSecret && (
                <div className="font-mono text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  &gt; sudo apt-get secure
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} SecureStack. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="h-4 w-4" />
                <span>Secured with AES-256</span>
              </div>
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
            <div className="inline-flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-amber-600" />
              <span>by SecureStack</span>
            </div>
            <div className="mt-2 font-mono text-xs opacity-50">
              v1.0.0 • Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="mt-3 text-xs opacity-60 hover:opacity-100 transition-opacity cursor-help group">
              <span className="inline-block">💡 Keyboard Shortcuts: </span>
              <span className="inline-block"><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100 font-mono text-xs">Alt+E</kbd> (Easter Egg)</span>
              <span className="inline-block mx-1">|</span>
              <span className="inline-block"><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100 font-mono text-xs">Alt+S</kbd> (Secret)</span>
              <span className="inline-block mx-1">|</span>
              <span className="inline-block"><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100 font-mono text-xs">Ctrl+?</kbd> (Help)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}