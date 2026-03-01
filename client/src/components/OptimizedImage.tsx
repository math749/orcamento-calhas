import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
}

/**
 * OptimizedImage component with lazy loading support
 * Uses IntersectionObserver for efficient lazy loading
 * Displays placeholder while loading
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  placeholder,
  onLoad,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || "");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    // Load the actual image
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      // Fallback to src if preload fails
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.src = src;
  }, [isInView, src, onLoad]);

  return (
    <div className={cn("relative overflow-hidden bg-slate-200", className)}>
      {/* Placeholder skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
      />
    </div>
  );
}
