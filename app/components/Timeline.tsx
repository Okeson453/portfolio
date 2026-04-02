'use client';

interface TimelineItem {
    year: string;
    title: string;
    company: string;
    description: string;
    icon: 'work' | 'education';
}

const timelineItems: TimelineItem[] = [
    {
        year: '2024',
        title: 'Senior Security Engineer',
        company: 'SecureStack',
        description: 'Leading security initiatives and implementing advanced threat detection systems.',
        icon: 'work',
    },
    {
        year: '2023',
        title: 'Full-Stack Developer',
        company: 'Tech Solutions Inc',
        description: 'Developed scalable applications with focus on security best practices.',
        icon: 'work',
    },
    {
        year: '2022',
        title: 'Bachelor of Science in Cybersecurity',
        company: 'University',
        description: 'Specialized in network security and cryptography.',
        icon: 'education',
    },
];

export default function Timeline() {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent" />

            <div className="space-y-12">
                {timelineItems.map((item, index) => (
                    <div
                        key={index}
                        data-index={index}
                        className="relative animate-fadeUp"
                    >
                        <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            {/* Content */}
                            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-semibold text-blue-500">{item.year}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">{item.company}</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm">{item.description}</p>
                                </div>
                            </div>

                            {/* Timeline dot */}
                            <div className="absolute left-1/2 top-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 hidden md:block" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
