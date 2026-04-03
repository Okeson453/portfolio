'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
}

export function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?postId=${postId}`);
            const data = await response.json();
            setComments(data.comments || []);
            setIsLoadingComments(false);
        } catch (error) {
            toast.error('Failed to load comments');
            setIsLoadingComments(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment, postId }),
            });

            if (!response.ok) throw new Error('Failed to post comment');

            const comment = await response.json();
            setComments((prev) => [comment, ...prev]);
            setNewComment('');
            toast.success('Comment posted!');
        } catch (error) {
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Comments</h2>
                <p className="text-slate-400">
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </p>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-cyber-green focus:outline-none"
                />
                <Button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="gap-2 bg-cyber-green hover:bg-cyber-green/90 text-black font-semibold"
                >
                    {submitting ? (
                        <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Post Comment
                        </>
                    )}
                </Button>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="text-center text-slate-400">Loading comments...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-white">{comment.author.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-slate-300">{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 text-center text-slate-400">
                    No comments yet. Be the first to comment!
                </div>
            )}
        </div>
    );
}
