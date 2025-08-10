import { useCallback, useEffect, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";

declare global {
  interface WindowEventMap {
    "sidebar-hover-lock": CustomEvent<void>;
    "sidebar-hover-unlock": CustomEvent<void>;
  }
}

const SIDEBAR_COLLAPSE_DELAY = 200;

export function useSidebarHover() {
  const { state, setOpen, isMobile } = useSidebar();
  const wasCollapsedRef = useRef(false);
  const hoverLockRef = useRef(false);
  const collapseTimeoutRef = useRef<number | null>(null);
  const pointerInsideRef = useRef(false);

  // Effect for locking/unlocking and cleaning up the timeout
  useEffect(() => {
    const lock = () => {
      hoverLockRef.current = true;
    };
    const unlock = () => {
      hoverLockRef.current = false;
      // Check if we should collapse after the dropdown closes
      if (wasCollapsedRef.current && !pointerInsideRef.current) {
        if (collapseTimeoutRef.current)
          window.clearTimeout(collapseTimeoutRef.current);
        collapseTimeoutRef.current = window.setTimeout(() => {
          if (
            !hoverLockRef.current &&
            wasCollapsedRef.current &&
            !pointerInsideRef.current
          ) {
            setOpen(false);
            wasCollapsedRef.current = false;
          }
        }, SIDEBAR_COLLAPSE_DELAY);
      }
    };

    window.addEventListener("sidebar-hover-lock", lock);
    window.addEventListener("sidebar-hover-unlock", unlock);

    return () => {
      window.removeEventListener("sidebar-hover-lock", lock);
      window.removeEventListener("sidebar-hover-unlock", unlock);
      if (collapseTimeoutRef.current) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, [setOpen]);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    pointerInsideRef.current = true;
    if (collapseTimeoutRef.current) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    if (state === "collapsed") {
      wasCollapsedRef.current = true;
      setOpen(true);
    }
  }, [isMobile, state, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    pointerInsideRef.current = false;
    if (!wasCollapsedRef.current || hoverLockRef.current) return;

    if (collapseTimeoutRef.current)
      window.clearTimeout(collapseTimeoutRef.current);
    collapseTimeoutRef.current = window.setTimeout(() => {
      if (!hoverLockRef.current) {
        setOpen(false);
        wasCollapsedRef.current = false;
      }
    }, SIDEBAR_COLLAPSE_DELAY);
  }, [isMobile, setOpen]);

  return { handleMouseEnter, handleMouseLeave };
}
