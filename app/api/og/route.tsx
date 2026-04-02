import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

/**
 * Dynamic Open Graph Image Generator
 *
 * Generates custom OG images per blog post or project based on URL parameters.
 * Runs on Edge Runtime for fastest possible response times.
 * Images are cached for 1 week since content rarely changes.
 *
 * Query Parameters:
 * - title: The image title (required)
 * - type: 'website' | 'article' | 'project' (default: 'website')
 * - tags: Comma-separated tags to display (optional, max 4)
 * - date: ISO date string for display (optional)
 *
 * Example URL:
 * /api/og?title=Security Best Practices&type=article&tags=security,web&date=2026-04-01
 */

export const runtime = 'edge';

// Cache for 1 week — OG images rarely change
export const revalidate = 604800;

interface OGParams {
    title: string;
    type: 'website' | 'article' | 'project';
    tags?: string[];
    date?: string;
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
    const { searchParams } = new URL(request.url);

    // ─── Extract & validate parameters ────────────────────────────────────────
    const params: OGParams = {
        title: searchParams.get('title') ?? 'Okeson — Cybersecurity & Full-Stack Developer',
        type: (searchParams.get('type') ?? 'website') as OGParams['type'],
    };

    // Parse tags (max 4)
    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
        params.tags = tagsParam
            .split(',')
            .map((t) => t.trim())
            .slice(0, 4);
    }

    // Parse date if provided
    if (searchParams.has('date')) {
        params.date = searchParams.get('date') ?? undefined;
    }

    // ─── Define type labels and styling ──────────────────────────────────────
    const typeConfig: Record<OGParams['type'], { label: string; emoji: string; color: string }> = {
        website: { label: '🔒 Cybersecurity Portfolio', emoji: '🔒', color: '#3b82f6' },
        article: { label: '📝 Security Insights', emoji: '📝', color: '#8b5cf6' },
        project: { label: '⚙️ Security Project', emoji: '⚙️', color: '#06b6d4' },
    };

    const config = typeConfig[params.type];

    // ─── Adjust font size based on title length ──────────────────────────────
    const titleFontSize = params.title.length > 60 ? 42 : params.title.length > 40 ? 48 : 52;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: 16,
                    color: '#f8fafc',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* ─── Background grid effect ─────────────────────────────────────── */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(0, 255, 150, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 150, 0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none',
                        opacity: 0.5,
                    }}
                />

                {/* ─── Top Bar: Branding ──────────────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: config.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                        }}
                    >
                        🔒
                    </div>
                    <span
                        style={{
                            color: '#94a3b8',
                            fontSize: '18px',
                            letterSpacing: '0.05em',
                            fontWeight: 500,
                        }}
                    >
                        Okeson
                    </span>
                </div>

                {/* ─── Main Content: Title + Tags ────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Title */}
                    <h1
                        style={{
                            fontSize: titleFontSize,
                            fontWeight: 800,
                            color: '#f8fafc',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            maxWidth: '1000px',
                            margin: 0,
                        }}
                    >
                        {params.title}
                    </h1>

                    {/* Tags */}
                    {params.tags && params.tags.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            {params.tags.map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        background: 'rgba(59, 130, 246, 0.2)',
                                        border: '1px solid rgba(59, 130, 246, 0.4)',
                                        borderRadius: '6px',
                                        color: '#93c5fd',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '4px 12px',
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Bottom Bar: Type + Date ────────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '24px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <span
                        style={{
                            color: config.color,
                            fontSize: '18px',
                            fontWeight: 600,
                        }}
                    >
                        {config.label}
                    </span>

                    {params.date && (
                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                            {new Date(params.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    )}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
