"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

interface StepCardData {
  number: number;
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  colorName: string; // for tailwind classes
  glowColor: string; // CSS rgb for glowing shadow
  hexColor: number;  // for Three.js rendering
}

const stepsData: StepCardData[] = [
  {
    number: 1,
    label: "Step One",
    title: "1. Input Credentials",
    description: "Paste your resume or details once. Our analyzer maps your strongest career highlights.",
    imageSrc: "/images/step1_credentials.png",
    colorName: "blue",
    glowColor: "rgba(59, 130, 246, 0.4)",
    hexColor: 0x3b82f6,
  },
  {
    number: 2,
    label: "Step Two",
    title: "2. Paste Target Post",
    description: "Insert the target job description. The parser identifies mandatory skills and ATS keywords.",
    imageSrc: "/images/step2_jobpost.png",
    colorName: "indigo",
    glowColor: "rgba(99, 102, 241, 0.4)",
    hexColor: 0x6366f1,
  },
  {
    number: 3,
    label: "Step Three",
    title: "3. Generate in Seconds",
    description: "Our model crafts tailored cover letter paragraphs matching your skills with the company culture.",
    imageSrc: "/images/step3_generation.png",
    colorName: "purple",
    glowColor: "rgba(168, 85, 247, 0.4)",
    hexColor: 0xa855f7,
  },
  {
    number: 4,
    label: "Step Four",
    title: "4. Export & Apply",
    description: "Check tone guidelines, copy to clipboard, or save as Draft. Apply with total confidence.",
    imageSrc: "/images/step4_export.png",
    colorName: "green",
    glowColor: "rgba(34, 197, 94, 0.4)",
    hexColor: 0x22c55e,
  },
];

export default function HolographicTailoringSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ref for the 3D Hologram floating container
  const hologramAnchorRef = useRef<HTMLDivElement>(null);
  
  // Refs for the 4 step cards to track their scroll positions and endpoints
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardPortsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State to track scroll progress
  const [sectionProgress, setSectionProgress] = useState(0);
  const progressRef = useRef(0);

  // Set cardRefs length
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, stepsData.length);
    cardPortsRefs.current = cardPortsRefs.current.slice(0, stepsData.length);
  }, []);

  // Monitor scroll progress of the section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress of section in viewport
      // 0 when section top enters viewport from bottom
      // 1 when section bottom is at the top of the viewport
      const startTrigger = rect.top - viewportHeight;
      const endTrigger = rect.bottom;
      const totalRange = viewportHeight + rect.height;
      
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        // Calculate progress normalized from 0 (top entering) to 1 (bottom leaving)
        const progress = (viewportHeight - rect.top) / rect.height;
        const clampedProgress = Math.max(0, Math.min(1.2, progress));
        setSectionProgress(clampedProgress);
        progressRef.current = clampedProgress;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial trigger
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Three.js Render Logic
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.5);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // 4. FLOATING PARTICLES (HOLOGRAPHIC PIPELINE SPARKLES)
    const particleCount = 120;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 12;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 12;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      velArray[i * 3] = (Math.random() - 0.5) * 0.003;
      velArray[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velArray[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. 3D HOLOGRAM LETTER CONTAINER GROUP
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // Build the holographic envelope
    const envGeom = new THREE.BoxGeometry(2.2, 1.4, 0.1);
    const envMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const envelope = new THREE.Mesh(envGeom, envMat);
    hologramGroup.add(envelope);

    // Triangular envelope flap (using wireframe lines)
    const flapPoints = [
      new THREE.Vector3(-1.1, 0.7, 0.05),
      new THREE.Vector3(0, 1.2, 0.05),
      new THREE.Vector3(1.1, 0.7, 0.05),
    ];
    const flapGeom = new THREE.BufferGeometry().setFromPoints(flapPoints);
    const flapLine = new THREE.LineLoop(flapGeom, new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    }));
    hologramGroup.add(flapLine);

    // Build the letter paper sticking out
    const paperGeom = new THREE.PlaneGeometry(2.0, 1.6);
    const paperMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const paper = new THREE.Mesh(paperGeom, paperMat);
    paper.position.set(0, 0.3, -0.05);
    hologramGroup.add(paper);

    // Write text lines on the paper
    const paperLinesGroup = new THREE.Group();
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < 4; i++) {
      const lineLen = i === 3 ? 1.0 : 1.6;
      const textLine = new THREE.Mesh(new THREE.BoxGeometry(lineLen, 0.03, 0.01), lineMat);
      textLine.position.set(i === 3 ? -0.3 : 0, 0.5 - i * 0.25, 0.01);
      paperLinesGroup.add(textLine);
    }
    paper.add(paperLinesGroup);

    // Halo ring rotating around the hologram
    const haloGeom = new THREE.RingGeometry(2.3, 2.33, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = Math.PI / 2.2;
    hologramGroup.add(halo);

    // 6. PIPELINE CONNECTIONS (THE FOUR ARROWS/LINES)
    interface ConnectionLine {
      backgroundLine: THREE.Line;
      activeLine: THREE.Line;
      packet: THREE.Mesh;
      curve: THREE.CubicBezierCurve3 | null;
      activeGeom: THREE.BufferGeometry;
    }

    const connections: ConnectionLine[] = [];

    // Create a generic structure for 4 connections
    for (let i = 0; i < stepsData.length; i++) {
      const activeGeom = new THREE.BufferGeometry();
      
      const bgMat = new THREE.LineBasicMaterial({
        color: stepsData[i].hexColor,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
      });

      const activeMat = new THREE.LineBasicMaterial({
        color: stepsData[i].hexColor,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const packetGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: stepsData[i].hexColor,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });

      const backgroundLine = new THREE.Line(new THREE.BufferGeometry(), bgMat);
      const activeLine = new THREE.Line(activeGeom, activeMat);
      const packet = new THREE.Mesh(packetGeom, packetMat);
      packet.visible = false;

      scene.add(backgroundLine);
      scene.add(activeLine);
      scene.add(packet);

      connections.push({
        backgroundLine,
        activeLine,
        packet,
        curve: null,
        activeGeom,
      });
    }

    // Translate DOM coordinate to 3D Three.js space
    const get3DPositionFromDOM = (element: HTMLElement | null) => {
      if (!element || !canvasRef.current) return null;
      
      const rect = element.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();

      // Relative to canvas top-left
      const x = rect.left - canvasRect.left + rect.width / 2;
      const y = rect.top - canvasRect.top + rect.height / 2;

      // Normalize to NDC space (-1 to 1)
      const ndcX = (x / canvasRect.width) * 2 - 1;
      const ndcY = -(y / canvasRect.height) * 2 + 1;

      // Project into world space at z = 0
      const vector = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      return worldPos;
    };

    // Update positions of elements in Three.js (called on resize & loop)
    const updatePositions = () => {
      if (!canvasRef.current) return;
      
      // Update Hologram position based on its anchor element in the DOM
      const anchorPos = get3DPositionFromDOM(hologramAnchorRef.current);
      if (anchorPos) {
        hologramGroup.position.copy(anchorPos);
      }

      // Update each of the connections
      for (let i = 0; i < stepsData.length; i++) {
        const portEl = cardPortsRefs.current[i];
        const cardPos = get3DPositionFromDOM(portEl);
        
        if (anchorPos && cardPos) {
          // Define bezier path
          const p0 = anchorPos.clone();
          const p3 = cardPos.clone();
          
          // Bend the curves based on layout (source -> target)
          // If we are on mobile (one column), we bend it downwards
          // If on desktop (two column), we bend it outwards to the right
          const isDesktop = window.innerWidth >= 1024;
          
          let p1: THREE.Vector3;
          let p2: THREE.Vector3;
          
          if (isDesktop) {
            // Sweep outwards to the right
            p1 = new THREE.Vector3(p0.x + 3.0, p0.y - 0.5, p0.z);
            p2 = new THREE.Vector3(p3.x - 3.0, p3.y + 0.5, p3.z);
          } else {
            // Bend down and round
            p1 = new THREE.Vector3(p0.x, p0.y - 1.5, p0.z);
            p2 = new THREE.Vector3(p3.x, p3.y + 1.5, p3.z);
          }

          const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
          connections[i].curve = curve;

          const points = curve.getPoints(50);
          
          // Update background path
          connections[i].backgroundLine.geometry.setFromPoints(points);
        }
      }
    };

    // Initial positioning
    setTimeout(updatePositions, 100);

    // Event listeners
    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.clientWidth;
      height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      updatePositions();
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Dynamic particle drift
      const pos = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velArray[i * 3];
        pos[i * 3 + 1] += velArray[i * 3 + 1];
        pos[i * 3 + 2] += velArray[i * 3 + 2];

        // Recycle particles
        if (pos[i * 3 + 1] < -6) pos[i * 3 + 1] = 6;
        if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
        if (pos[i * 3] < -6) pos[i * 3] = 6;
        if (pos[i * 3] > 6) pos[i * 3] = -6;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Animate Hologram letter
      hologramGroup.rotation.y = time * 0.4;
      hologramGroup.position.y += Math.sin(time * 2.0) * 0.003; // micro-floating overlay
      halo.rotation.z = -time * 0.2;

      // Calculate connections drawing progress based on scroll progress
      // We map the section scroll progress (0.1 to 1.1) to sequential step triggers
      const scrollProgress = progressRef.current;

      // Set particle color based on current scrolling zone
      if (scrollProgress < 0.25) {
        particleMat.color.setHex(stepsData[0].hexColor);
      } else if (scrollProgress < 0.5) {
        particleMat.color.setHex(stepsData[1].hexColor);
      } else if (scrollProgress < 0.75) {
        particleMat.color.setHex(stepsData[2].hexColor);
      } else {
        particleMat.color.setHex(stepsData[3].hexColor);
      }

      // Constantly re-track DOM positions in the render loop to account for scroll offset shifts
      updatePositions();

      connections.forEach((conn, index) => {
        const { curve, activeGeom, activeLine, packet } = conn;
        if (!curve) return;

        // Activation triggers for step cards:
        // Step 1: starts scroll at 0.1, fully connects at 0.35
        // Step 2: starts scroll at 0.3, fully connects at 0.55
        // Step 3: starts scroll at 0.5, fully connects at 0.75
        // Step 4: starts scroll at 0.7, fully connects at 0.95
        const startThreshold = 0.1 + index * 0.18;
        const endThreshold = startThreshold + 0.22;
        
        let connProgress = 0;
        if (scrollProgress > startThreshold) {
          connProgress = (scrollProgress - startThreshold) / (endThreshold - startThreshold);
          connProgress = Math.max(0, Math.min(1.0, connProgress));
        }

        // Draw line growing from Hologram to Card
        const totalPointsCount = 50;
        const visiblePointsCount = Math.floor(connProgress * totalPointsCount);
        
        const fullPoints = curve.getPoints(totalPointsCount);
        const activePoints = fullPoints.slice(0, Math.max(2, visiblePointsCount));
        
        activeGeom.setFromPoints(activePoints);

        // Animate glowing data packet once the line is connected
        if (connProgress >= 1.0) {
          packet.visible = true;
          // Pulse position wraps around every 1.5 seconds
          const packetT = (time * 0.6) % 1.0;
          const pos = curve.getPointAt(packetT);
          packet.position.copy(pos);
        } else {
          packet.visible = false;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="py-24 border-t border-white/[0.04] relative bg-slate-950/20 max-w-7xl mx-auto px-6 overflow-hidden flex flex-col"
    >
      {/* Background Three.js Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 w-full">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Sticky Left Column: Holographic Control Box */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col space-y-6">
            
            {/* The Digital Hologram Letter Box Wrapper */}
            <div className="relative bg-slate-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col">
              {/* Futuristic Cyber Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />
              
              {/* Bouncing holographic scanning bar */}
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-[pulse_2s_infinite] top-[15%] pointer-events-none" />
              
              {/* Header Text Content */}
              <div className="relative z-10">
                <span className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 inline-block mb-4">
                  SYSTEM CORE ACTIVE
                </span>
                <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
                  Our Tailoring System
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Write Better Letters. <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">10x Faster.</span>
                </h3>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                  Our multi-step generator aligns your resume accomplishments directly with job description requirements in seconds.
                </p>
              </div>

              {/* DOM placeholder for the 3D Hologram model */}
              <div 
                ref={hologramAnchorRef} 
                className="relative w-full h-48 border border-white/[0.04] bg-white/[0.01] rounded-xl flex items-center justify-center mt-6 group/hologram overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
                <span className="absolute bottom-3 left-4 text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-2" />
                  3D HOLOGRAM MATRIX
                </span>
                
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Steps Timeline Stack */}
          <div className="lg:col-span-7 flex flex-col space-y-8 pl-0 lg:pl-6">
            {stepsData.map((step, idx) => (
              <motion.div
                key={step.number}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative rounded-2xl border border-white/[0.06] bg-slate-950/40 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-500 overflow-hidden"
                style={{
                  boxShadow: `0 0 0px transparent`,
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.boxShadow = `0 10px 40px -15px ${step.glowColor}, 0 0 20px -5px ${step.glowColor}`;
                  target.style.borderColor = `rgba(${step.hexColor === 0x3b82f6 ? '59, 130, 246' : step.hexColor === 0x6366f1 ? '99, 102, 241' : step.hexColor === 0xa855f7 ? '168, 85, 247' : '34, 197, 94'}, 0.35)`;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.boxShadow = 'none';
                  target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {/* Connection Port (Where the Three.js arrow plugs in) */}
                <div 
                  ref={(el) => {
                    cardPortsRefs.current[idx] = el;
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-3 h-3 rounded-full bg-slate-950 border border-white/20 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 group-hover:scale-125 transition-all duration-300" />
                </div>

                {/* Left side card: Premium UI Mockup Photo */}
                <div className="relative w-full md:w-52 aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08] flex-shrink-0">
                  <img
                    src={step.imageSrc}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  {/* Subtle futuristic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                </div>

                {/* Right side card: Explanation Details */}
                <div className="flex flex-col flex-grow">
                  <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-widest">
                    {step.label}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
