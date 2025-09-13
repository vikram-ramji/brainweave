"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";

function HomeHero() {
  const words = [
    {
      text: "Stop",
    },
    { text: "Forgetting," },
    {
      text: "Start Knowing.",
      className: "!text-primary",
    },
  ];
  return (
    <div className="flex flex-col h-screen justify-center w-full items-center text-center px-4">
      <h1 className="tracking-tight">
        <TypewriterEffectSmooth words={words} cursorClassName="bg-primary" />
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 3, ease: "easeInOut" }}
        className="text-base md:text-lg lg:text-xl xl:text-2xl"
      >
        Brainweave is not a digital file cabinet, it&apos;s an active partner in
        your learning process.
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 3.5, ease: "easeInOut" }}
      >
        <Link href="/sign-in">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 text-xl flex items-center justify-center rounded-full bg-primary text-primary-foreground px-4 py-2 gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="size-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default HomeHero;
