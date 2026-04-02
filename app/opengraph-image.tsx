import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/seo';

export const runtime = 'edge';
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1a2e 50%, #0a1628 100%)',
          padding: '60px 80px',
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,150,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Terminal-style prefix */}
        <div
          style={{
            color: '#00ff96',
            fontSize: 20,
            marginBottom: 16,
            display: 'flex',
            position: 'relative',
            zIndex: 1,
          }}
        >
          &gt; portfolio.dev
        </div>

        {/* Name */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            display: 'flex',
            position: 'relative',
            zIndex: 1,
            maxWidth: '90%',
            wordWrap: 'break-word',
          }}
        >
          {siteConfig.fullName}
        </div>

        {/* Title */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: 28,
            marginTop: 16,
            display: 'flex',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Cybersecurity &amp; Full-Stack Developer
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {['React', 'Next.js', 'TypeScript', 'Security'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(0,255,150,0.1)',
                border: '1px solid rgba(0,255,150,0.3)',
                color: '#00ff96',
                padding: '6px 16px',
                borderRadius: 6,
                fontSize: 18,
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 80,
            color: '#475569',
            fontSize: 20,
            display: 'flex',
            zIndex: 1,
          }}
        >
          securestack.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
