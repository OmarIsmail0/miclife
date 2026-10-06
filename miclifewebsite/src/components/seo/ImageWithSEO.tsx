'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithSEOProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

export default function ImageWithSEO({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  loading = 'lazy',
  quality = 85,
  fill = false,
  sizes,
  style,
  onLoad,
}: ImageWithSEOProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative ${!isLoaded ? 'animate-pulse bg-gray-200' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        loading={priority ? undefined : loading}
        quality={quality}
        sizes={sizes}
        style={style}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
      />
    </div>
  );
}

