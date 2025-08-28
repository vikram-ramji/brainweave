"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import AppSidebar from "./AppSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import SearchDialog from "./SearchDialog";

const SIDEBAR_CLOSE_DELAY = 200; // ms

export default function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // isSidebarOpen comes from your existing provider and controls the "pushed" layout
  const {
    open: isSidebarOpen,
    setOpen: setIsSidebarOpen,
    isMobile,
  } = useSidebar();

  const [isFloating, setIsFloating] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isHoverLocked, setIsHoverLocked] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    setIsFloating(true);
    setIsSidebarOpen(true);
  }, [isMobile, setIsSidebarOpen]);

  // When the mouse leaves the sidebar
  const handleMouseLeave = useCallback(() => {
    if (isMobile || isHoverLocked) return;
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsSidebarOpen(false);
    }, SIDEBAR_CLOSE_DELAY);
  }, [isMobile, isHoverLocked, setIsSidebarOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {!isSidebarOpen && !isMobile && (
        <div
          className="fixed top-0 left-0 z-30 h-full w-4"
          onMouseEnter={handleMouseEnter}
        />
      )}
      <SearchDialog open={isSearchDialogOpen} setOpen={setIsSearchDialogOpen} />
      <AppSidebar
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isFloating={isFloating}
        setIsFloating={setIsFloating}
        setIsSidebarOpen={setIsSidebarOpen}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
        setIsHoverLocked={setIsHoverLocked}
      />
      <main className="flex flex-col flex-1">{children}</main>
    </>
  );
}
