'use client';

import { useState } from 'react';
import { skillsData, type Skill } from '@/lib/skillsData';

const skillLevels = ['Expert', 'Advanced', 'Intermediate', 'Basic'];
const skillCategories = ['Security', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Soft'];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('Security');

  const categoryMap: Record<string, string[]> = {
    'Security': ['security'],
    'Frontend': ['frontend'],
    'Backend': ['backend'],
    'DevOps': ['devops'],
    'Tools': ['tools'],
    'Soft': ['soft']
  };

  const filteredSkills: Skill[] = skillsData.filter((skill: Skill) =>
    categoryMap[activeCategory]?.includes(skill.category) || false
  );

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Technical</span>{' '}
            <span className="text-blue-500">Skills</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive expertise across the full development stack with a
            security-first approach
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist">
          {skillCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${activeCategory === category
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls={`${category.toLowerCase()}-panel`}
              aria-label={`Filter skills by ${category} category`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="tabpanel"
          id={`${activeCategory.toLowerCase()}-panel`}
          aria-label={`${activeCategory} skills`}
        >
          {filteredSkills.map((skill, index) => {
            const IconComponent = (skill.icon || (() => null)) as React.ComponentType<{ className?: string }>;

            return (
              <div
                key={skill.id}
                data-index={index}
                className="group relative animate-fadeUp"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20" aria-label={skill.name}>
                        {IconComponent && <IconComponent className="h-6 w-6 text-blue-500" aria-hidden="true" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${(skill.level as unknown as string) === 'Expert'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : (skill.level as unknown as string) === 'Advanced'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : (skill.level as unknown as string) === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {skill.level}
                          </span>
                          {skill.years !== undefined && (
                            <span className="text-xs text-gray-500">
                              {skill.years} years
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {skill.description}
                  </p>

                  {/* Skill Level Indicator */}
                  {skill.proficiency !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Proficiency</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="skill-bar h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700 ease-out"
                          data-proficiency={skill.proficiency}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skill.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Proficiency Levels
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skillLevels.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${level === 'Expert'
                    ? 'bg-green-500'
                    : level === 'Advanced'
                      ? 'bg-blue-500'
                      : level === 'Intermediate'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}