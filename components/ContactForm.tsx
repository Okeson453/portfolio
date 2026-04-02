'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateFormField, validateForm, isFormValid } from '@/lib/formValidation';

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error on change if field was touched before
        if (touched[name]) {
            const error = validateFormField(name, value, formData);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.currentTarget;
        setTouched((prev) => ({ ...prev, [name]: true }));
        
        // Validate on blur
        const error = validateFormField(name, value, formData);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = {
            name: true,
            email: true,
            subject: true,
            message: true,
        };
        setTouched(allTouched);
        
        // Validate entire form
        const formErrors = validateForm(formData);
        setErrors(formErrors);
        
        if (!isFormValid(formErrors)) {
            setFormStatus({
                message: 'Please fix the errors above before submitting.',
                type: 'error',
            });
            return;
        }
        
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to send message');

            toast.success('Message sent successfully!');
            setFormStatus({
                message: 'Your message has been sent successfully. We will reply within 24 hours.',
                type: 'success',
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTouched({});
            setErrors({});
            setTimeout(() => setFormStatus(null), 5000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
            toast.error(errorMessage);
            setFormStatus({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            {/* Form Status (aria-live for screen readers) */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                id="form-status"
            >
                {formStatus && `${formStatus.type === 'success' ? 'Success:' : 'Error:'} ${formStatus.message}`}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
                    <p className="mt-2 text-slate-400">
                        Have a project in mind? Let's discuss how we can help secure your
                        infrastructure.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="rounded-lg bg-cyber-green/10 p-3">
                            <Mail className="h-5 w-5 text-cyber-green" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Email</p>
                            <p className="text-slate-400">contact@securestack.local</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="rounded-lg bg-cyber-green/10 p-3">
                            <Phone className="h-5 w-5 text-cyber-green" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Phone</p>
                            <p className="text-slate-400">+1 (555) 000-0000</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="rounded-lg bg-cyber-green/10 p-3">
                            <MapPin className="h-5 w-5 text-cyber-green" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Location</p>
                            <p className="text-slate-400">Remote / Available Worldwide</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-cyber-green/20 bg-slate-900 p-4">
                    <p className="text-sm text-slate-300">
                        <span className="font-semibold text-cyber-green">Response Time:</span>{' '}
                        Typically within 24 hours
                    </p>
                </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                        Name {formData.name && touched.name && !errors.name && <span className="text-green-400">✓</span>}
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`mt-1 w-full rounded-lg border bg-slate-900 px-4 py-2 text-white placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            errors.name ? 'border-red-500 dark:border-red-400' : 'border-slate-700'
                        }`}
                        placeholder="Your name"
                    />
                    {errors.name && touched.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                        Email {formData.email && touched.email && !errors.email && <span className="text-green-400">✓</span>}
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`mt-1 w-full rounded-lg border bg-slate-900 px-4 py-2 text-white placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            errors.email ? 'border-red-500 dark:border-red-400' : 'border-slate-700'
                        }`}
                        placeholder="your@email.com"
                    />
                    {errors.email && touched.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white">
                        Subject {formData.subject && touched.subject && !errors.subject && <span className="text-green-400">✓</span>}
                    </label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        className={`mt-1 w-full rounded-lg border bg-slate-900 px-4 py-2 text-white placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            errors.subject ? 'border-red-500 dark:border-red-400' : 'border-slate-700'
                        }`}
                        placeholder="Project inquiry"
                    />
                    {errors.subject && touched.subject && (
                        <p id="subject-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                            {errors.subject}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white">
                        Message {formData.message && touched.message && !errors.message && <span className="text-green-400">✓</span>}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows={5}
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className={`mt-1 w-full rounded-lg border bg-slate-900 px-4 py-2 text-white placeholder-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            errors.message ? 'border-red-500 dark:border-red-400' : 'border-slate-700'
                        }`}
                        placeholder="Tell me about your project..."
                    />
                    {errors.message && touched.message && (
                        <p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                            {errors.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || !isFormValid(errors) && Object.keys(touched).length > 0}
                    className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black font-semibold"
                >
                    {loading ? 'Sending' : 'Send Message'}
                </Button>
            </form>
        </div>
    );
}
