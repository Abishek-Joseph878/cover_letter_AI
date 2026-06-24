"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set up scroll hooks relative to the showcase element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle scroll parallax effect
  const yParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Entrance animation reveal sequence (1.2s duration)
  const revealVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 0.95,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const, // cinematic cubic-bezier
      },
    },
  };

  // Attempt video autoplay dynamically to guarantee it starts immediately
  useEffect(() => {
    if (isMounted && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay was prevented or video is still loading:", error);
        });
      }
    }
  }, [isMounted]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[540px] lg:max-w-none mx-auto lg:mx-0">
      {/* Ambient Effect 1: Radial gradient behind showcase */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_65%)] blur-3xl -z-10 pointer-events-none" />

      {/* Ambient Effect 2: Soft blue glow beneath video container */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-blue-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Scroll Parallax Wrapper */}
      <motion.div style={{ y: yParallax }} className="w-full">
        {/* Entrance Animation Wrapper */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          {/* Continuous floating/hover motion container */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative p-2 md:p-2.5 rounded-[24px] md:rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-2xl shadow-blue-950/20 overflow-hidden"
          >
            {/* Ambient Effect 3: Top-down light reflection/gradient shine */}
            <div className="absolute inset-0 pointer-events-none rounded-[22px] md:rounded-[26px] ring-1 ring-white/10 bg-gradient-to-b from-white/5 via-white/[0.01] to-transparent z-10" />

            {/* Ambient Effect 4: Subtle animated highlight sweep across frame every few seconds */}
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 z-20"
              animate={{
                x: ["-150%", "250%"],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 4.5,
                ease: "easeInOut",
              }}
            />

            {/* Showcase Video Bezel */}
            <div className="aspect-video w-full overflow-hidden rounded-[16px] md:rounded-[20px] border border-white/[0.04] bg-[#0b0f19] relative">
              {isMounted ? (
                <video
                  ref={videoRef}
                  src="/video/Cover_letter_AI.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-[#0b0f19] animate-pulse" />
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
