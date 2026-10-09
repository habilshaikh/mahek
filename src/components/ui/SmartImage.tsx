import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  /** Above-the-fold images should pass `eager` */
  eager?: boolean;
  /** Rendered instead of the image if it fails to load */
  fallback?: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Responsive image with lazy loading, intrinsic dimensions (no layout shift),
 * a gentle fade-in and a graceful fallback when a file is missing.
 */
export default function SmartImage({ src, alt, srcSet, sizes, width, height, className = '', eager = false, fallback, style }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset on src change, then pick up images that were already decoded from cache
  // (their load event can fire before React's handler is attached).
  useLayoutEffect(() => {
    setFailed(false);
    const img = ref.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else if (img.currentSrc) setFailed(true);
      else setLoaded(false);
    } else setLoaded(false);
  }, [src]);

  if (failed) {
    return fallback ? <>{fallback}</> : <div className={`bg-[radial-gradient(ellipse_at_center,#30271a,#1e1812)] ${className}`} role="img" aria-label={alt} />;
  }

  return (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      style={style}
      className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
