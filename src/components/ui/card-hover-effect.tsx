import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import React from "react";

export const HoverEffect = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className,
      )}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {React.Children.map(children, (child, idx) => (
        <div
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
        >
          {hoveredIndex === idx && (
            <motion.span
              className="absolute inset-0 h-full w-full bg-primary/60 dark:bg-primary/40 block rounded-3xl"
              layoutId="hoverBackground"
              // Add a transition prop for a smooth spring animation
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          {child}
        </div>
      ))}
    </div>
  );
};
