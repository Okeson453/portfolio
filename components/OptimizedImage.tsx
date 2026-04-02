/**
 * Optimized Image Component
 * Wrapper around next/image with performance best practices
 */

import Image, { ImageProps } from 'next/image';
import { CSSProperties } from 'react';
import styles from './OptimizedImage.module.css';

export interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
    blur?: boolean;
    containerClassName?: string;
    containerStyle?: CSSProperties;
    priority?: boolean;
    quality?: number;
}

/**
 * Base64 blur placeholder (tiny 1x1 pixel, optimized)
 */
const BLUR_PLACEHOLDER =
    'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

/**
 * Optimized Image Component
 * - Lazy loads by default (unless priority={true})
 * - Uses AVIF/WebP for modern browsers
 * - Blur placeholder for visual polish
 * - Responsive sizing
 */
export function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    quality = 85,
    blur = true,
    sizes,
    containerClassName,
    containerStyle,
    className,
    style,
    ...props
}: OptimizedImageProps & { width: number | `${number}`; height: number | `${number}` }) {
    return (
        <div
            className={`${styles.container} ${containerClassName || ''}`.trim()}
            {...(containerStyle && { style: containerStyle })}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                quality={quality}
                placeholder={blur ? 'blur' : 'empty'}
                blurDataURL={BLUR_PLACEHOLDER}
                sizes={
                    sizes ||
                    '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, (max-width: 1280px) 50vw, 33vw'
                }
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    ...style,
                }}
                className={className}
                {...props}
            />
        </div>
    );
}

/**
 * Responsive image with aspect ratio
 * Prevents cumulative layout shift (CLS)
 */
export function ResponsiveImage({
    src,
    alt,
    width = 1200,
    height = 630,
    aspectRatio,
    ...props
}: OptimizedImageProps & { aspectRatio?: string }) {
    // CSS variable approach - only render style if aspectRatio is explicitly provided
    const computedRatio = aspectRatio || (height ? `${width} / ${height}` : undefined);

    return (
        <div
            className={styles.responsiveContainer}
            {...(computedRatio && { style: { '--aspect-ratio': computedRatio } as React.CSSProperties })}
        >
            <OptimizedImage
                src={src}
                alt={alt}
                width={width as number}
                height={height as number}
                fill
                {...props}
            />
        </div>
    );
}

/**
 * Hero Image - Priority loaded, optimized for LCP
 */
export function HeroImage({
    src,
    alt,
    width,
    height,
    ...props
}: OptimizedImageProps & { width: number | `${number}`; height: number | `${number}` }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={true}
            quality={90}
            blur={true}
            {...props}
        />
    );
}

/**
 * Thumbnail Image - Smaller, lazy-loaded
 */
export function ThumbnailImage({
    src,
    alt,
    width = 64,
    height = 64,
}: OptimizedImageProps) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={typeof width === 'number' ? width : 64}
            height={typeof height === 'number' ? height : 64}
            quality={75}
        />
    );
}
