"use client";

import { useRef, useCallback } from "react";

interface HoverIntentOptions {
  onHoverStart: () => void;
  onHoverEnd: () => void;
  startDelay?: number;
  endDelay?: number;
}

/**
 * A custom hook to manage hover intent with configurable delays.
 * It abstracts away the complexity of managing setTimeout and clearTimeout.
 */
export function useHoverIntent({
  onHoverStart,
  onHoverEnd,
  startDelay = 100, // Default delay before opening
  endDelay = 200, // Default delay before closing
}: HoverIntentOptions) {
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      onHoverStart();
    }, startDelay);
  }, [onHoverStart, startDelay]);

  const handleMouseLeave = useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      onHoverEnd();
    }, endDelay);
  }, [onHoverEnd, endDelay]);

  // Return the event handlers to be spread onto the target components
  return { handleMouseEnter, handleMouseLeave, clearTimer };
}
