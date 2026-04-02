'use client';

import { useActionState, lazy, Suspense } from 'react';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContact, type ContactFormState } from '@/lib/actions/contact';

// Lazy load UI components for faster initial load
const Button = lazy(() => import('@/components/ui/Button').then(mod => ({ default: mod.Button })));
const Input = lazy(() => import('@/components/ui/Input').then(mod => ({ default: mod.Input })));
const Textarea = lazy(() => import('@/components/ui/Textarea').then(mod => ({ default: mod.Textarea })));

const initialState: ContactFormState = { status: 'idle', message: '' };

export function Contact() {
  const [state, action, isPending] = useActionState(submitContact, initialState);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'eolamide453@gmail.com',
      href: 'mailto:eolamide453@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '08145616727',
      href: 'tel:+2348145616727',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Nigeria, Abuja',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Get In</span>{' '}
            <span className="text-blue-500">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Ready to secure your next project? Let's discuss how we can work together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Send a Message
              </h3>

              {/* ✅ Success Message */}
              {state.status === 'success' && (
                <div role="alert" className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-300">
                        Message sent successfully!
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {state.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Error Message */}
              {state.status === 'error' && (
                <div role="alert" className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-300">
                        Something went wrong
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {state.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Form with Server Action (Built-in CSRF Protection) */}
              <form action={action} noValidate className="space-y-6">
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  }
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        disabled={isPending}
                        aria-invalid={state.errors?.name ? 'true' : 'false'}
                      />
                      {state.errors?.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                          {state.errors.name[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        disabled={isPending}
                        aria-invalid={state.errors?.email ? 'true' : 'false'}
                      />
                      {state.errors?.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                          {state.errors.email[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Project Inquiry"
                      disabled={isPending}
                      aria-invalid={state.errors?.subject ? 'true' : 'false'}
                    />
                    {state.errors?.subject && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        {state.errors.subject[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell me about your project..."
                      rows={6}
                      disabled={isPending}
                      aria-invalid={state.errors?.message ? 'true' : 'false'}
                    />
                    {state.errors?.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        {state.errors.message[0]}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full group bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    aria-disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </Suspense>
              </form>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>✅ Secure:</strong> This form uses server-side validation, encryption, and built-in CSRF protection. Your information is safe.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Feel free to reach out through any of these channels. I typically
                  respond within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <info.icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {info.title}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Availability */}
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Availability
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Mon - Fri</span>
                    <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Within 24 hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Projects</span>
                    <span className="font-medium">Available for new projects</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Connect With Me
                </h4>
                <div className="flex gap-4">
                  {[
                    { name: 'GitHub', icon: 'github', href: 'https://github.com' },
                    { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com' },
                    { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={social.name}
                    >
                      <div className="h-5 w-5" />
                      {/* You would add actual icons here */}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}