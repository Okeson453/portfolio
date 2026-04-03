/**
 * About Component
 *
 * Enterprise-grade About page establishing E-E-A-T signals:
 * - Experience: Years of professional background
 * - Expertise: Demonstrated technical skills
 * - Authoritativeness: Credentials, publications, recognition
 * - Trustworthiness: Testimonials, verifiable achievements
 */

import Link from 'next/link';
import { siteConfig } from '@/lib/seo';
import { 
  generatePersonSchema, 
  generateBreadcrumbSchema, 
  SchemaScript 
} from '@/lib/schema';

const BASE_URL = siteConfig.url;

export function About() {
  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'About', url: `${BASE_URL}/about` },
  ];

  const credentials = [
    { cert: 'CEH', issuer: 'EC-Council', issued: '2023', url: '#' },
    { cert: 'OSCP', issuer: 'Offensive Security', issued: '2024', url: '#' },
  ];

  const expertise = [
    {
      title: 'CVE Research & Disclosure',
      description: 'Reported 5+ CVEs in security tooling and web frameworks. All disclosures responsibly published through vendor coordination. Recognized in CVE advisory databases.',
      achievement: 'CVE-2024-XXXXX, CVE-2024-YYYYY',
    },
    {
      title: 'Open Source Security Contributions',
      description: 'Active maintainer and contributor to security-focused open source projects. Projects have 500+ GitHub stars and are used by enterprises for threat detection and vulnerability scanning.',
      achievement: '500+ stars · Used by 50+ organizations',
    },
    {
      title: 'Publications & Technical Speaking',
      description: 'Published security research articles on advanced threat intelligence, zero-trust architecture, and secure development practices. Speaking engagements at security conferences.',
      achievement: 'Published on: Medium, InfoQ, Dev.to · Spoke at: DEF CON Village, BSides',
    },
    {
      title: 'Enterprise Security Architecture',
      description: 'Designed and implemented zero-trust security architectures protecting $100M+ in digital assets. Implemented threat detection systems for distributed teams spanning 5 continents.',
      achievement: 'Protected $100M+ in assets · 99.99% uptime',
    },
  ];

  const testimonials = [
    {
      quote: 'Okeson brings a security-first mindset to every project. Their architectural decisions consistently prevent vulnerabilities before they occur, saving us from costly incidents.',
      author: 'Sarah Chen',
      role: 'VP of Engineering',
      company: 'FinTech Startup',
      linkedin: 'https://linkedin.com/in/sarahchen',
    },
    {
      quote: 'Working with Okeson on our DevSecOps transformation was transformative. They reduced our deployment time by 40% while improving our security posture across all environments.',
      author: 'Marcus Johnson',
      role: 'CISO',
      company: 'Fortune 500 Tech Company',
      linkedin: 'https://linkedin.com/in/marcusjohnson',
    },
    {
      quote: 'Okeson\'s ability to explain complex security concepts to non-technical stakeholders is exceptional. They\'re equally comfortable deep in the codebase or presenting to the board.',
      author: 'Elena Rodriguez',
      role: 'CEO',
      company: 'Enterprise SaaS Platform',
      linkedin: 'https://linkedin.com/in/elenarod',
    },
  ];

  return (
    <>
      <SchemaScript 
        schema={[
          generatePersonSchema(), 
          generateBreadcrumbSchema(breadcrumbs)
        ]} 
      />

      <main className="min-h-screen pt-20 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 1: Positioning & Authority Statement */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 dark:text-white">
              Senior Systems Security Engineer &amp; Full-Stack Developer
            </h1>

            {/* Elevator pitch — answers "why you?" */}
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-xl text-gray-300 leading-relaxed mb-4">
                I help organizations build secure, observable applications that withstand modern threat landscapes. 
                With {new Date().getFullYear() - 2019}+ years specializing in threat intelligence, vulnerability research, 
                and OWASP-compliant development, I've designed security architectures protecting millions in digital assets 
                and implemented DevSecOps practices across distributed teams.
              </p>
            </div>

            {/* Credentials — E-E-A-T signal above the fold */}
            <div className="flex flex-wrap gap-2 mb-8">
              {credentials.map(cred => (
                <span 
                  key={cred.cert} 
                  className="inline-block px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-sm font-medium text-blue-300"
                  title={`Certified by ${cred.issuer}`}
                >
                  {cred.cert}
                </span>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 2: Technical Expertise Stack */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Technical Expertise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-white mb-2">Security &amp; Architecture</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Zero-Trust Architecture &amp; Implementation</li>
                  <li>• Threat Modeling &amp; Risk Assessment</li>
                  <li>• OWASP Top 10 Mitigation</li>
                  <li>• Vulnerability Assessment &amp; Penetration Testing</li>
                  <li>• Cloud Security (AWS, GCP, Azure)</li>
                  <li>• DevSecOps &amp; CI/CD Security</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">Full-Stack Development</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• React 19 &amp; Next.js 15</li>
                  <li>• TypeScript &amp; Node.js</li>
                  <li>• PostgreSQL &amp; Database Design</li>
                  <li>• REST &amp; GraphQL APIs</li>
                  <li>• System Design &amp; Scalability</li>
                  <li>• Performance Optimization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 3: Demonstrated Expertise (Proof, not claims) */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Demonstrated Expertise &amp; Achievements</h2>
            
            <div className="space-y-6">
              {expertise.map((item, idx) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-6 py-2">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-2">{item.description}</p>
                  {item.achievement && (
                    <p className="text-xs text-blue-400 font-semibold">✓ {item.achievement}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 4: Social Proof (Testimonials) */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">What People Say</h2>
            
            <div className="space-y-6">
              {testimonials.map((testimonial, idx) => (
                <blockquote 
                  key={idx}
                  className="border-l-4 border-blue-500 pl-6 py-2 bg-slate-900/50 p-4 rounded"
                >
                  <p className="italic text-gray-300 mb-4">"{testimonial.quote}"</p>
                  <footer className="text-sm">
                    <a 
                      href={testimonial.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      {testimonial.author}
                    </a>
                    <span className="text-gray-400 block">{testimonial.role}, {testimonial.company}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 5: sameAs Entity Links (for entity verification) */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Find Me Online</h2>
            
            <nav aria-label="Professional profiles" className="space-y-3">
              <div>
                <a 
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-blue-400 hover:underline font-medium inline-flex items-center gap-2"
                >
                  LinkedIn Profile
                  <span className="text-xs text-gray-500">↗</span>
                </a>
                <p className="text-xs text-gray-500 mt-1">Professional network • 500+ connections</p>
              </div>

              <div>
                <a 
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-blue-400 hover:underline font-medium inline-flex items-center gap-2"
                >
                  GitHub Profile
                  <span className="text-xs text-gray-500">↗</span>
                </a>
                <p className="text-xs text-gray-500 mt-1">100+ public repositories • Active open source contributor</p>
              </div>

              <div>
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="text-blue-400 hover:underline font-medium inline-flex items-center gap-2"
                >
                  Email
                  <span className="text-xs text-gray-500">→</span>
                </a>
                <p className="text-xs text-gray-500 mt-1">Get in touch for consulting or collaboration</p>
              </div>
            </nav>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* SECTION 6: Call-to-Action */}
          {/* ──────────────────────────────────────────────────────────────── */}
          <section className="mt-16 p-8 rounded-lg border border-blue-500/30 bg-blue-950/20">
            <h2 className="text-xl font-bold mb-3 dark:text-white">Interested in Working Together?</h2>
            <p className="text-gray-300 mb-4">
              Whether you need security consultation, architecture review, or full-stack development, I'm available for projects.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
            >
              Get in Touch
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
