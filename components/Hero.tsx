'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Code, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Typewriter } from '@/components/ui/Typewriter';
import dynamic from 'next/dynamic';

const roles = [
  'Cybersecurity Specialist',
  'Full-Stack Developer',
  'Security Researcher',
  'DevSecOps Engineer',
  'Penetration Tester',
];

// Animated background component (inline to avoid dynamic import issues)
function AnimatedBackgroundBlobs() {
  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </>
  );
}

export function Hero() {
  const [showBlobs, setShowBlobs] = useState(false);

  useEffect(() => {
    // Defer blob animations to after initial render for faster FCP
    const timer = setTimeout(() => setShowBlobs(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'SecureStack_Resume.pdf';
    link.click();
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Optimized Background - Static gradient loads immediately */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 cyber-grid opacity-50" />
        {/* Animate blobs deferred to improve initial load */}
        {showBlobs && <AnimatedBackgroundBlobs />}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fade-in-up stagger-1">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-mono text-blue-400">
              Securing Digital Frontiers
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-fade-in-up stagger-2">
            <span className="block text-gray-900 dark:text-white">
              Building Secure
            </span>
            <span className="block bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Digital Solutions
            </span>
          </h1>

          {/* Typewriter Section */}
          <div className="h-20 mb-8 flex items-center justify-center animate-fade-in-up stagger-3">
            <div className="text-2xl sm:text-3xl md:text-4xl font-mono text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">&gt;</span>
              <Typewriter
                words={roles}
                delay={2000}
              />
              <span className="ml-1 animate-pulse">▌</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-4">
            I specialize in creating robust, secure applications with cutting-edge
            technology. Passionate about cybersecurity and full-stack development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up stagger-5">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Start Secure Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToProjects}
              className="border-gray-300 dark:border-gray-700 hover:border-blue-500"
            >
              View My Work
            </Button>
          </div>

          {/* Secondary CTA: Download CV */}
          <div className="animate-fade-in-up stagger-5 mb-6">
            <a
              href="/cv/SecureStack-CV.pdf"
              download
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ArrowRight size={14} className="rotate-180" aria-hidden="true" />
              Download CV (PDF)
            </a>
          </div>

          {/* Response Time Signal */}
          <p className="animate-fade-in-up stagger-6 text-xs text-gray-500 dark:text-gray-500">
            Typically responds within 24 hours · Open to work
          </p>

          {/* Stats - Simplified for faster load */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up stagger-6">
            {[
              { icon: Shield, value: '50+', label: 'Security Audits' },
              { icon: Code, value: '100+', label: 'Projects' },
              { icon: Zap, value: '24/7', label: 'Monitoring' },
              { icon: Sparkles, value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-colors"
              >
                <stat.icon className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simplified Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}