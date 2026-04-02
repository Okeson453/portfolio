'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch users
    setUsers([
      {
        id: '1',
        email: 'admin@securestack.local',
        name: 'Admin User',
        emailVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'user1@example.com',
        name: 'John Smith',
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;

    try {
      // Mock delete
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400">Manage system users and permissions</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading users...</div>
      ) : (
        <div className="rounded-lg border border-cyber-blue/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-cyber-blue/20 bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  2FA
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Verified
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{user.email}</td>
                  <td className="px-6 py-4 text-slate-400">{user.name}</td>
                  <td className="px-6 py-4">
                    {user.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                        <Shield className="h-3 w-3" /> Enabled
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.emailVerified ? (
                      <span className="text-xs font-medium text-emerald-400">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-yellow-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-cyber-green"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
