'use client';

import { Star } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: 'Jane Smith',
        role: 'CTO',
        company: 'TechCorp Ltd.',
        content: 'Delivered a complex authentication system two weeks ahead of schedule. Code quality was exceptional — production-ready from day one.',
        rating: 5,
    },
    {
        name: 'Marcus Johnson',
        role: 'Security Lead',
        company: 'FinanceX',
        content: 'Best security consultant we\'ve worked with. Identified critical vulnerabilities and provided clear remediation steps.',
        rating: 5,
    },
    {
        name: 'Sarah Chen',
        role: 'Product Manager',
        company: 'CloudFlow Inc.',
        content: 'Full-stack expertise is rare. Understands both frontend performance and backend architecture intimately.',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
                <figure
                    key={index}
                    data-index={index}
                    className="card-interactive bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 animate-fadeUp"
                >
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-blue-500 fill-blue-500" aria-hidden="true" />
                        ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                        "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <figcaption className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role} · {testimonial.company}</p>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}
