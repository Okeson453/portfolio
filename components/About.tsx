import Image from 'next/image';
import { CheckCircle, Globe, Cpu, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const expertise = [
  'Web Application Security',
  'Cloud Infrastructure',
  'Penetration Testing',
  'Secure Code Review',
  'Incident Response',
  'DevSecOps Implementation',
  'API Security',
  'Cryptography',
];

const technologies = [
  { icon: Globe, label: 'Next.js & React' },
  { icon: Cpu, label: 'Node.js & Python' },
  { icon: Lock, label: 'OWASP Tools' },
  { icon: CheckCircle, label: 'Security Frameworks' },
];

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">About</span>{' '}
            <span className="text-blue-500">Me</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Cybersecurity expert with a passion for building secure, scalable
            applications that protect digital assets and user data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl transform rotate-6" />
              <div className="relative rounded-3xl overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/profile.jpg"
                  alt="Professional profile photo - Cybersecurity specialist and full-stack developer"
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Tech Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700"
                >
                  <tech.icon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Secure Development Expertise
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  With over 5 years of experience in cybersecurity and full-stack
                  development, I specialize in creating applications that are not
                  only functional and beautiful but also secure by design. My
                  approach combines modern development practices with security-first
                  principles.
                </p>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Core Expertise
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {expertise.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      5+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      100+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Projects Secured
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <div className="mt-8 p-6 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
              <p className="text-gray-700 dark:text-gray-300 italic">
                "Security isn't a feature—it's a foundation. Every line of code
                should be written with protection in mind."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}