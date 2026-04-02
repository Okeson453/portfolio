'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  Eye,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  trend?: string;
}) => (
  <div className="rounded-lg border border-cyber-green/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold text-cyber-green">{value}</p>
        {trend && (
          <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </div>
      <div className="rounded-lg bg-cyber-green/10 p-3">
        <Icon className="h-6 w-6 text-cyber-green" />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: '0',
    posts: '0',
    views: '0',
    comments: '0',
  });

  useEffect(() => {
    // Mock stats loading
    setStats({
      users: '12',
      posts: '8',
      views: '2.4K',
      comments: '156',
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your site overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          trend="+2 this week"
        />
        <StatCard
          icon={FileText}
          label="Blog Posts"
          value={stats.posts}
          trend="+1 this week"
        />
        <StatCard
          icon={Eye}
          label="Page Views"
          value={stats.views}
          trend="+12% this week"
        />
        <StatCard
          icon={MessageSquare}
          label="Comments"
          value={stats.comments}
          trend="+8 this week"
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-cyber-blue/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-400">
          <p>• New user registration from John Smith</p>
          <p>• Blog post "Zero-Day Vulnerabilities" published</p>
          <p>• Security scan completed - 2 vulnerabilities found</p>
          <p>• System backup completed successfully</p>
        </div>
      </div>
    </div>
  );
}
