"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset when navigation completes
    setIsNavigating(false);
    setProgress(100);
    
    const timeout = setTimeout(() => {
      setProgress(0);
    }, 200);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        // Only show progress for internal navigation
        if (href && href.startsWith("/") && href !== pathname) {
          setIsNavigating(true);
          setProgress(10);
          
          // Simulate progress
          progressInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 100);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [pathname]);

  if (!isNavigating && progress === 0) return null;

  return (
    <>
      {/* Progress bar at top - force LTR direction */}
      <div dir="ltr" className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-orange-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Full screen overlay with spinner */}
      {isNavigating && (
        <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
