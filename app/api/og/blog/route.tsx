import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title') || 'Article';
  const category = searchParams.get('category') || 'Security';

  // Truncate title if too long for visual display
  const displayTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;

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
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1a2e 50%, #1a0f2e 100%)',
          padding: '60px 80px',
          fontFamily: '"Inter", sans-serif',
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
              'linear-gradient(rgba(0,255,150,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,150,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(0,255,150,0.15)',
              border: '1px solid rgba(0,255,150,0.4)',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#00ff96',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '40px',
            lineHeight: '1.3',
            maxWidth: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {displayTitle}
        </div>

        {/* Footer with site info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#00ff96',
              fontWeight: '600',
            }}
          >
            📝 Read on Blog
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#00ff9666',
            }}
          >
            okeson.dev
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
