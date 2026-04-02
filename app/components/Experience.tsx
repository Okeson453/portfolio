'use client';

import { useState } from 'react';
import { experiences } from '@/lib/experienceData';
import { Briefcase, Calendar, MapPin, ChevronRight, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExperience = experiences[activeIndex];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Work</span>{' '}
            <span className="text-blue-500">Experience</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Professional journey through cybersecurity and software development roles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {experiences.map((exp, index) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${activeIndex === index
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeIndex === index
                      ? 'bg-white/20'
                      : 'bg-blue-50 dark:bg-blue-900/20'
                      }`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{exp.position}</div>
                      <div className="text-sm opacity-80">{exp.company}</div>
                    </div>
                    {activeIndex === index && (
                      <ChevronRight className="ml-auto h-5 w-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Details */}
          <div className="lg:col-span-2">
            <div
              key={activeExperience.id}
              className="animate-slideRight bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeExperience.position}
                    </h3>
                    <div className="text-lg text-blue-500 font-medium">
                      {activeExperience.company}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {activeExperience.type}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{activeExperience.startDate} - {activeExperience.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activeExperience.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                  {activeExperience.description && activeExperience.description.length > 0 ? (
                    activeExperience.description.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))
                  ) : (
                    <p>{activeExperience.description}</p>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeExperience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {activeExperience.achievements && activeExperience.achievements.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {activeExperience.achievements.map((achievement, index) => (
                      <li key={index} className="list-none" data-index={index}>
                        <div
                          className="animate-slideRight p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-start gap-3"
                        >
                          <Award className="h-4 w-4 text-green-600 dark:text-green-400 p-1 rounded bg-green-100 dark:bg-green-900/40 flex-shrink-0" />
                          <span className="text-green-800 dark:text-green-300">
                            {achievement}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}