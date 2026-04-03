'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for global client components
const ScrollProgress = dynamic(() => import('@/src/components/ScrollProgress'), { ssr: false });
const CommandPalette = dynamic(() => import('@/src/components/CommandPalette'), { ssr: false });
const ShortcutGuide = dynamic(() => import('@/src/components/ShortcutGuide'), { ssr: false });
const BackToTop = dynamic(() => import('@/src/components/BackToTop'), { ssr: false });

export function GlobalUIComponents() {
  return (
    <>
      <ScrollProgress />
      <CommandPalette />
      <ShortcutGuide />
      <BackToTop />
    </>
  );
}
