"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import * as THREE from "three";

interface StepData {
  number: number;
  label: string;
  title: string;
  description: string;
  color: string;
  glowColor: string;
  hexColor: number;
  particleHex: number;
}

const steps: StepData[] = [
  {
    number: 1,
    label: "Application Submitted",
    title: "Generic Cover Letter Sent",
    description: "You submit a generic copy-pasted cover letter because rewriting it for every single application takes hours of energy. Recruiters and ATS scanners spot this instantly.",
    color: "border-cyan-500/20 text-cyan-400 shadow-cyan-500/10",
    glowColor: "text-cyan-400",
    hexColor: 0x00f0ff,
    particleHex: 0x00a0ff,
  },
  {
    number: 2,
    label: "ATS Screening",
    title: "Flagged as Generic AI or Unrelated",
    description: "Applicant Tracking Systems scan the text. The document lacks critical keywords or contains typical ChatGPT patterns, ranking you in the bottom tier and sorting you out.",
    color: "border-indigo-500/20 text-indigo-400 shadow-indigo-500/10",
    glowColor: "text-indigo-400",
    hexColor: 0x6366f1,
    particleHex: 0x8b5cf6,
  },
  {
    number: 3,
    label: "No Reply & Ghosted",
    title: "Application Rejected",
    description: "Your application is filed away. Weeks pass, leaving you wondering why you never heard back despite having the exact technical qualifications. The classic black hole.",
    color: "border-rose-500/25 text-rose-500 shadow-rose-500/10",
    glowColor: "text-rose-500",
    hexColor: 0xf43f5e,
    particleHex: 0xe11d48,
  },
];

export default function HolographicTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for each card to detect their scroll positions
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);

  // Sync state with mutable ref for the Three.js loop
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  // Track overall section scroll progress for the timeline line fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Track scroll position to update the active step
  useEffect(() => {
    const handleScroll = () => {
      if (!card1Ref.current || !card2Ref.current || !card3Ref.current) return;

      const rect1 = card1Ref.current.getBoundingClientRect();
      const rect2 = card2Ref.current.getBoundingClientRect();
      const rect3 = card3Ref.current.getBoundingClientRect();

      const viewportHeight = window.innerHeight;
      // Trigger when the card reaches 45% from the top of the viewport
      const triggerPoint = viewportHeight * 0.45;

      let currentStep = 0;
      if (rect3.top <= triggerPoint) {
        currentStep = 2;
      } else if (rect2.top <= triggerPoint) {
        currentStep = 1;
      } else {
        currentStep = 0;
      }

      if (currentStep !== activeStepRef.current) {
        setActiveStep(currentStep);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call to set correct state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Three.js Render Logic
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00ffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff00ff, 1.0);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 4. FLOATING PARTICLES (HOLOGRAPHIC DUST)
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 16;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 6;

      velArray[i * 3] = (Math.random() - 0.5) * 0.004;
      velArray[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velArray[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. STEP 1 GEOMETRY: HOLOGRAPHIC LETTER
    const step1Group = new THREE.Group();
    step1Group.position.set(-8, 0, 0); // Left side

    const sheetGeom = new THREE.PlaneGeometry(2.2, 3.0, 1, 1);
    const sheetMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const sheet = new THREE.Mesh(sheetGeom, sheetMat);
    step1Group.add(sheet);

    const envBackGeom = new THREE.BoxGeometry(2.4, 3.2, 0.15);
    const envBackMat = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const envBack = new THREE.Mesh(envBackGeom, envBackMat);
    envBack.position.z = -0.1;
    step1Group.add(envBack);

    const textLinesGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const linesCount = 7;
    for (let i = 0; i < linesCount; i++) {
      const lineLen = i === 0 ? 1.0 : i === linesCount - 1 ? 0.8 : 1.7;
      const textLineGeom = new THREE.BoxGeometry(lineLen, 0.06, 0.02);
      const textLine = new THREE.Mesh(textLineGeom, lineMat);
      textLine.position.set(
        i === 0 ? -0.35 : i === linesCount - 1 ? -0.45 : 0,
        1.1 - i * 0.35,
        0.05
      );
      textLinesGroup.add(textLine);
    }
    step1Group.add(textLinesGroup);
    scene.add(step1Group);

    // 6. STEP 2 GEOMETRY: AI ROBOT SCANNER
    const step2Group = new THREE.Group();
    step2Group.position.set(0, 0, 0); // Center

    const headGeom = new THREE.SphereGeometry(1.2, 14, 14);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const head = new THREE.Mesh(headGeom, headMat);
    step2Group.add(head);

    const visorGeom = new THREE.BoxGeometry(1.4, 0.28, 0.4);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const visor = new THREE.Mesh(visorGeom, visorMat);
    visor.position.set(0, 0.2, 1.0);
    step2Group.add(visor);

    const eyeGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.35, 0.2, 1.15);
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.35, 0.2, 1.15);
    step2Group.add(leftEye);
    step2Group.add(rightEye);

    const orbitRing1Geom = new THREE.RingGeometry(1.6, 1.65, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing1 = new THREE.Mesh(orbitRing1Geom, ringMat1);
    orbitRing1.rotation.x = Math.PI / 2;
    step2Group.add(orbitRing1);

    const orbitRing2Geom = new THREE.RingGeometry(1.8, 1.85, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing2 = new THREE.Mesh(orbitRing2Geom, ringMat2);
    orbitRing2.rotation.x = Math.PI / 4;
    orbitRing2.rotation.y = Math.PI / 4;
    step2Group.add(orbitRing2);

    scene.add(step2Group);

    // 7. STEP 3 GEOMETRY: REJECTED STAMP
    const step3Group = new THREE.Group();
    step3Group.position.set(8, 0, 0); // Right side

    const handleGeom = new THREE.CylinderGeometry(0.2, 0.5, 1.4, 8);
    const stampMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const stampHandle = new THREE.Mesh(handleGeom, stampMat);
    stampHandle.position.y = 0.7;
    step3Group.add(stampHandle);

    const stampBaseGeom = new THREE.BoxGeometry(1.8, 0.3, 1.8);
    const stampBase = new THREE.Mesh(stampBaseGeom, stampMat);
    stampBase.position.y = 0.0;
    step3Group.add(stampBase);

    const xGroup = new THREE.Group();
    xGroup.position.set(0, -0.8, 0);

    const bar1Geom = new THREE.BoxGeometry(1.8, 0.15, 0.3);
    const xMat = new THREE.MeshBasicMaterial({
      color: 0xff003c,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const bar1 = new THREE.Mesh(bar1Geom, xMat);
    bar1.rotation.y = Math.PI / 4;
    xGroup.add(bar1);

    const bar2 = new THREE.Mesh(bar1Geom, xMat);
    bar2.rotation.y = -Math.PI / 4;
    xGroup.add(bar2);
    step3Group.add(xGroup);

    scene.add(step3Group);

    // 8. GLOBAL RENDER LOOP VARIABLES
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // 9. EVENT LISTENERS
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 10. ANIMATE FUNCTION
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Dynamic Particle movement
      const pos = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velArray[i * 3];
        pos[i * 3 + 1] += velArray[i * 3 + 1];
        pos[i * 3 + 2] += velArray[i * 3 + 2];

        if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
        if (pos[i * 3 + 1] < -4) pos[i * 3 + 1] = 4;
        if (pos[i * 3] > 8) pos[i * 3] = -8;
        if (pos[i * 3] < -8) pos[i * 3] = 8;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Animate Step 1 (Letter)
      step1Group.rotation.y = Math.sin(time * 0.4) * 0.25;
      step1Group.position.y = Math.sin(time * 1.5) * 0.12;

      // Animate Step 2 (Robot)
      step2Group.rotation.y = time * 0.3;
      orbitRing1.rotation.z = time * 0.8;
      orbitRing2.rotation.x = time * -0.5;
      step2Group.position.y = Math.cos(time * 1.2) * 0.08;

      // Animate Step 3 (Stamp)
      const stampCycle = (time * 1.8) % Math.PI;
      const stampHeight = Math.max(0, Math.sin(stampCycle)) * 1.6;
      stampHandle.position.y = 0.5 + stampHeight;
      stampBase.position.y = -0.2 + stampHeight;

      if (stampHeight < 0.1) {
        xMat.opacity = 0.95;
        particles.rotation.y = Math.sin(time * 50) * 0.02;
      } else {
        xMat.opacity = 0.3 + 0.3 * Math.sin(time * 5);
        particles.rotation.y = time * 0.01;
      }

      // Transition Camera X smoothly based on the activeStepRef state
      const targetCameraX = -8 + activeStepRef.current * 8;
      camera.position.x += (targetCameraX - camera.position.x) * 0.08;

      // Update particle color to match active step
      const currentHex = steps[activeStepRef.current]?.particleHex || 0x00ffff;
      particleMat.color.setHex(currentHex);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      sheetGeom.dispose();
      sheetMat.dispose();
      envBackGeom.dispose();
      envBackMat.dispose();
      headGeom.dispose();
      headMat.dispose();
      visorGeom.dispose();
      visorMat.dispose();
      eyeGeom.dispose();
      eyeMat.dispose();
      orbitRing1Geom.dispose();
      ringMat1.dispose();
      orbitRing2Geom.dispose();
      ringMat2.dispose();
      handleGeom.dispose();
      stampMat.dispose();
      stampBaseGeom.dispose();
      bar1Geom.dispose();
      xMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-auto py-12 bg-transparent">
      {/* 3-Column Natural Layout */}
      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-8 max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* LEFT COLUMN: Scrolling Text Cards */}
        <div className="w-full md:w-[45%] flex flex-col gap-24 py-12 relative z-20">
          {steps.map((step, idx) => {
            const isCurrent = idx === activeStep;
            const ref = idx === 0 ? card1Ref : idx === 1 ? card2Ref : card3Ref;
            
            return (
              <div
                key={step.number}
                ref={ref}
                className="min-h-[25vh] flex flex-col justify-center scroll-mt-[25vh]"
              >
                <motion.div
                  initial={{ opacity: 0.4, x: -15 }}
                  animate={{
                    opacity: isCurrent ? 1 : 0.25,
                    x: isCurrent ? 0 : -10,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <span className={`text-xs font-bold uppercase tracking-widest ${step.glowColor}`}>
                    {step.label}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight tracking-tight">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE COLUMN: Glowing Numbers Timeline (Sticky) */}
        <div className="hidden md:flex w-[10%] h-[60vh] sticky top-[20vh] flex-col items-center justify-between py-12 z-20">
          {/* Vertical Track Path */}
          <div className="absolute top-8 bottom-8 w-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-gradient-to-b from-cyan-400 via-indigo-400 to-rose-500 origin-top"
              style={{ 
                height: "100%", 
                scaleY: scrollYProgress 
              }}
            />
          </div>

          {/* Timeline Nodes */}
          {steps.map((step, idx) => {
            const isActive = idx <= activeStep;
            const isCurrent = idx === activeStep;
            
            return (
              <div key={step.number} className="relative flex flex-col items-center justify-center h-12 w-12">
                {isCurrent && (
                  <motion.div
                    layoutId="activeTimelineGlowRing"
                    className={`absolute inset-0 rounded-full border border-current bg-current/5 blur-[8px] ${step.glowColor}`}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}

                <button
                  onClick={() => {
                    const cardRef = idx === 0 ? card1Ref : idx === 1 ? card2Ref : card3Ref;
                    cardRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 cursor-pointer ${
                    isCurrent
                      ? `bg-slate-900 border-current font-extrabold ${step.glowColor} scale-110 shadow-lg shadow-current/25`
                      : isActive
                        ? `bg-slate-950/60 border-slate-500 text-slate-300`
                        : `bg-slate-950/20 border-white/10 text-slate-600`
                  }`}
                >
                  {step.number}
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Three.js 3D Holographic Canvas (Sticky) */}
        <div className="w-full md:w-[45%] h-[40vh] md:h-[60vh] sticky top-[20vh] flex items-center justify-center z-10">
          {/* Glassmorphic border ring behind canvas */}
          <div className="absolute inset-4 rounded-3xl bg-radial from-slate-950/20 to-transparent border border-white/[0.03] backdrop-blur-[2px] pointer-events-none" />
          
          {/* Three.js Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block relative z-10 cursor-pointer select-none bg-transparent"
          />

          {/* Projector Base glow lines */}
          <div className="absolute bottom-2 md:bottom-8 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-[1px] z-20 pointer-events-none" />
          <div className="absolute bottom-2.5 md:bottom-8.5 left-1/3 right-1/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[3px] z-20 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
