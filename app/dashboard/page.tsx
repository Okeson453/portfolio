import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Settings, Lock, Bell, LogOut } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | SecureStack',
  description: 'Your SecureStack dashboard',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what you can do next
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Profile Settings */}
          <Link href="/settings/profile" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your personal information, avatar, and preferences
              </p>
            </div>
          </Link>

          {/* Privacy Controls */}
          <Link href="/settings/privacy" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Privacy & Security
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control your privacy settings and security preferences
              </p>
            </div>
          </Link>

          {/* Notifications */}
          <Link href="/settings/notifications" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure how and when you receive notifications
              </p>
            </div>
          </Link>

          {/* View All Settings */}
          <Link href="/settings" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Settings
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access all account settings and preferences
              </p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            Check out our documentation and security guides to learn more about protecting your account.
          </p>
          <Link href="/about">
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
          <Link href="/api/auth/logout">
            <Button variant="outline" className="text-red-600 dark:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
