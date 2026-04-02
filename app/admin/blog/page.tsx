'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
  author: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch blog posts
    setPosts([
      {
        id: '1',
        title: 'Zero-Day Vulnerabilities: Detection & Prevention',
        slug: 'zero-day-vulnerabilities',
        published: true,
        views: 1203,
        createdAt: new Date().toISOString(),
        author: 'Admin User',
      },
      {
        id: '2',
        title: 'Advanced Threat Intelligence',
        slug: 'advanced-threat-intelligence',
        published: true,
        views: 856,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Admin User',
      },
    ]);
    setLoading(false);
  }, []);

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Post deleted');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleTogglePublish = async (postId: string) => {
    try {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, published: !p.published } : p
        )
      );
      toast.success('Post updated');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="text-slate-400">Create, edit, and manage blog posts</p>
        </div>
        <Button className="bg-cyber-green hover:bg-cyber-green/90 text-black font-semibold">
          New Post
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading posts...</div>
      ) : (
        <div className="rounded-lg border border-cyber-blue/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-cyber-blue/20 bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Author
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Views
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{post.title}</p>
                    <p className="text-xs text-slate-500">{post.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{post.author}</td>
                  <td className="px-6 py-4 flex items-center gap-1 text-slate-400">
                    <Eye className="h-4 w-4" /> {post.views}
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-400">
                        <Lock className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-cyber-green"
                      onClick={() => handleTogglePublish(post.id)}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </Button>
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
                      onClick={() => handleDelete(post.id)}
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
