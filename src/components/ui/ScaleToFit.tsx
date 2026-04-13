"use client"

import React, { useState, useEffect, useRef } from 'react';

/**
 * ScaleToFit Component
 * 
 * A reusable container that scales its children to fit the available horizontal space
 * while maintaining a fixed base width layout. This is perfect for complex grid layouts
 * or games that need to stay visualy consistent across different screen sizes.
 */

interface ScaleToFitProps {
  children: React.ReactNode;
  /** The target width of the content layout (e.g., 1140 for a standard container) */
  baseWidth?: number;
  /** Horizontal padding to subtract from the available width */
  padding?: number;
  /** Additional classes for the outer wrapper */
  className?: string;
  /** Optional dependency array to trigger height recalculations if content changes dynamically */
  watch?: any;
}

export function ScaleToFit({
  children,
  baseWidth = 1140,
  padding = 24,
  className = "",
  watch
}: ScaleToFitProps) {
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 1. Core Scaling Logic
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      // Use offsetWidth of the container for more stability than window.innerWidth
      const containerWidth = containerRef.current.offsetWidth;
      const availableWidth = containerWidth - padding;
      
      const newScale = Math.min(availableWidth / baseWidth, 1);
      
      // Only update if the change is significant to prevent micro-adjustments loops
      setScale((prev) => {
        if (Math.abs(prev - newScale) < 0.001) return prev;
        return newScale;
      });
    };

    // Use ResizeObserver for modern, efficient resizing detection
    const observer = new ResizeObserver(() => {
      // requestAnimationFrame ensures we stay in sync with the browser's paint cycle
      window.requestAnimationFrame(calculateScale);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Initial calculation
    calculateScale();
    
    // Fallback for visibility/focus changes
    window.addEventListener('focus', calculateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('focus', calculateScale);
    };
  }, [baseWidth, padding]);

  // 2. Height Normalization
  // When we scale an element, it still occupies its original space in the DOM layout 
  // (unless we manually adjust the parent's height). 
  // This effect ensures the parent div collapses to the actual VISUAL height.
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const actualHeight = contentRef.current.scrollHeight * scale;
        setContentHeight(actualHeight);
      }
    };

    // Immediate update
    updateHeight();
    
    // Small delay to allow nested components (like motion divs or images) to settle
    const timer = setTimeout(updateHeight, 150);
    
    return () => clearTimeout(timer);
  }, [scale, children, watch]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full flex justify-center overflow-hidden ${className}`}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: `${baseWidth}px`,
          height: contentHeight ? `${contentHeight}px` : "auto",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s ease",
          flexShrink: 0,
          willChange: "transform"
        }}
      >
        <div ref={contentRef} className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
