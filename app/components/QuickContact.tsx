'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Mail, Send } from 'lucide-react';

export default function QuickContact() {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ email: '', subject: '', message: '' });
                setTimeout(() => setSubmitted(false), 3000);
            }
        } catch (error) {
            // Handle error silently or with user-facing notification
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div>
                {submitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-lg text-center">
                        <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-900 dark:text-green-400 mb-2">Message Sent!</h3>
                        <p className="text-green-700 dark:text-green-300">
                            Thanks for reaching out. I'll get back to you soon!
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Subject</label>
                            <Input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="What's this about?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Message</label>
                            <Textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell me more..."
                                rows={4}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
