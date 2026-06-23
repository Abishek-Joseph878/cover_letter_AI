"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Upload,
  Brain,
  Download,
  CheckCircle,
  Briefcase,
  AlertCircle,
  Menu,
  X,
  Star,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Lock,
  MousePointerClick
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showcaseTone, setShowcaseTone] = useState("Professional");
  
  // Showcase Typing Animation
  const [typedText, setTypedText] = useState("");
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const coverLettersByTone: Record<string, string> = {
    Professional: "Dear Hiring Team at Stripe,\n\nI am writing to express my strong interest in the Senior Frontend Engineer position. With over five years of experience in building scalable web architectures and leading cross-functional engineering initiatives, I am confident in my capacity to make an immediate impact.\n\nThroughout my career, I have specialized in optimizing client-side performance, reducing build times by 40%, and establishing robust design system patterns. The challenges described in your job posting—specifically surrounding clean API design and checkout flow speed—align perfectly with my expertise.\n\nThank you for your review. I look forward to the possibility of discussing how my technical background matches the needs of Stripe.\n\nSincerely,\nAlex Mercer",
    Enthusiastic: "Dear SpaceX Recruiting Team,\n\nI was absolutely thrilled to see the opening for the Mission Control Software Developer! As an engineer who has closely followed SpaceX's journey to make life multiplanetary, contributing to this mission is my ultimate career ambition.\n\nI bring hands-on experience in real-time telemetry pipelines and low-latency React layouts. In my previous role, I pioneered a streaming data dashboard that handled millions of events per second with zero interface lag. I love solving the hard problems that others shy away from, and I thrive in high-stakes environments where reliability is non-negotiable.\n\nI am incredibly eager to bring my focus and technical skills to your team. Let's make history together!\n\nBest regards,\nAlex Mercer",
    Concise: "Dear Hiring Manager at Vercel,\n\nPlease accept this application for the Developer Relations Engineer role. I focus on simplifying developer workflows and building clean product demonstrations.\n\nMy qualifications include five years of Next.js deployment, creating open-source templates with over 10k stars, and presenting complex systems clearly. I am confident that my technical skills will translate directly into immediate value for Vercel's developer ecosystem.\n\nThank you for your consideration. I look forward to discussing my credentials soon.\n\nSincerely,\nAlex Mercer",
    Confident: "Dear Hiring Committee at Resend,\n\nI am writing to apply for the Lead Product Designer role. With a proven track record of designing products that simplify email templates, I am uniquely positioned to elevate your application's user interface design.\n\nI specialize in user experience design and translating complex developer settings into beautiful, intuitive workflows. I don't just create mocks; I build complete visual design languages that scale and increase customer conversions. I am prepared to step in and immediately boost the visual output of your design team.\n\nI welcome the opportunity to meet and show how my skills will support Resend's continued design supremacy.\n\nSincerely,\nAlex Mercer"
  };

  useEffect(() => {
    const textToType = coverLettersByTone[showcaseTone];
    let index = 0;
    setTypedText("");
    
    if (typingTimer.current) clearInterval(typingTimer.current);

    typingTimer.current = setInterval(() => {
      setTypedText((prev) => prev + textToType.charAt(index));
      index++;
      if (index >= textToType.length) {
        if (typingTimer.current) clearInterval(typingTimer.current);
      }
    }, 15);

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
  }, [showcaseTone]);

  // Testimonials Carousel
  const testimonials = [
    {
      quote: "Using CoverLetter AI felt like magic. I generated a specific letter for a React Architect role, and within 48 hours, I had a screening call. It matches my achievements so intelligently.",
      author: "Sarah Jenkins",
      role: "Lead Frontend Engineer at Tesla",
      rating: 5
    },
    {
      quote: "I sent out 50 applications using generic letters and got nothing. I generated 10 job-specific cover letters here, and got 4 interview offers. The ATS-keyword insertion actually works.",
      author: "Marcus Chen",
      role: "Product Manager at Notion",
      rating: 5
    },
    {
      quote: "The interface is gorgeous, and the AI tone variations are spot-on. The 'Concise' tone was exactly what the hiring managers at Stripe were looking for. Highly recommend!",
      author: "Elena Rostov",
      role: "Software Engineer II at Stripe",
      rating: 5
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-blue-600 selection:text-white overflow-hidden bg-[#090d16]">
      {/* Dynamic Floating Ambient Particles */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[180px] pointer-events-none" />

      {/* Global Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090d16]/75 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">CoverLetter<span className="text-blue-500">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#problem" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Why us</a>
            <a href="#showcase" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Showcase</a>
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] text-white transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 glow-btn"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Btn */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/[0.05] border border-white/[0.05] text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-white/[0.06] bg-[#090d16]"
            >
              <div className="px-6 py-5 flex flex-col space-y-4">
                <a
                  href="#problem"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-slate-400 hover:text-white transition-colors"
                >
                  Why us
                </a>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-slate-400 hover:text-white transition-colors"
                >
                  Showcase
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-slate-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-slate-400 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <div className="pt-2 border-t border-white/[0.05] flex flex-col space-y-3">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base text-slate-400 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl text-center text-sm font-medium bg-white/[0.05] text-white"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base text-slate-400 hover:text-white"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full px-4 py-2.5 rounded-xl text-center text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        Start Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel text-xs text-blue-400 font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing CoverLetter AI 2.0</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
          >
            Land Interviews. <br />
            <span className="text-gradient">Not Rejections.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Generate tailored, professional cover letters that sound human, not AI-generated. Instantly match your credentials with any target description.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 mb-20"
          >
            <Link
              href={session ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 glow-btn group"
            >
              <span>{session ? "Go to Dashboard" : "Start Generating Free"}</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#showcase"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white transition-all flex items-center justify-center"
            >
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Floating Documents Hero Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-2xl glass-panel p-4 md:p-6 shadow-2xl border-white/[0.08] overflow-hidden"
        >
          {/* Radial Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <div className="aspect-[16/9] w-full rounded-xl bg-[#0b0f19] border border-white/[0.04] p-6 relative flex flex-col justify-between overflow-hidden">
            {/* Mock Dashboard Topbar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="h-6 w-48 rounded bg-white/[0.05] border border-white/[0.05]" />
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">JD</div>
            </div>

            {/* Inner Animation Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 relative">
              {/* Form Input Mock */}
              <div className="md:col-span-5 flex flex-col space-y-4">
                <div className="h-4 w-1/3 bg-white/[0.08] rounded" />
                <div className="h-10 w-full bg-white/[0.03] border border-white/[0.08] rounded-lg" />
                <div className="h-4 w-1/2 bg-white/[0.08] rounded" />
                <div className="h-20 w-full bg-white/[0.03] border border-white/[0.08] rounded-lg" />
                <div className="h-10 w-full bg-blue-600 rounded-lg flex items-center justify-center text-xs font-semibold space-x-1.5 opacity-90">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tailoring Cover Letter...</span>
                </div>
              </div>

              {/* Cover Letter Live Gen Mock */}
              <div className="md:col-span-7 rounded-lg bg-slate-950/80 border border-white/[0.06] p-5 relative overflow-hidden flex flex-col">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-500/10 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  Generating Tone: Professional
                </div>
                {/* Simulated Document Lines */}
                <div className="space-y-3.5 pt-4">
                  <motion.div animate={{ width: ["0%", "85%"] }} transition={{ duration: 1.5 }} className="h-3.5 bg-white/[0.12] rounded" />
                  <motion.div animate={{ width: ["0%", "92%"] }} transition={{ duration: 1.8, delay: 0.3 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <motion.div animate={{ width: ["0%", "78%"] }} transition={{ duration: 1.4, delay: 0.6 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <div className="h-4" />
                  <motion.div animate={{ width: ["0%", "98%"] }} transition={{ duration: 2.2, delay: 0.9 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <motion.div animate={{ width: ["0%", "95%"] }} transition={{ duration: 2, delay: 1.2 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <motion.div animate={{ width: ["0%", "88%"] }} transition={{ duration: 1.8, delay: 1.5 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <motion.div animate={{ width: ["0%", "50%"] }} transition={{ duration: 1.2, delay: 1.8 }} className="h-3.5 bg-white/[0.08] rounded" />
                  <div className="h-4" />
                  <motion.div animate={{ width: ["0%", "45%"] }} transition={{ duration: 1, delay: 2.1 }} className="h-3.5 bg-white/[0.12] rounded" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section id="problem" className="py-24 border-t border-white/[0.04] bg-slate-950/20 max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">The Job Hunt Reality</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Black Hole of Job Applications</p>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Sending hundreds of copies of the exact same cover letter leads straight to automated rejections. Recruiters and ATS bots spot generic writing instantly.
          </p>
        </div>

        {/* Animated Storytelling Timeline */}
        <div className="max-w-4xl mx-auto relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[1px] before:bg-white/[0.08] pl-20 space-y-12">
          {/* Card 1 */}
          <div className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[64px] top-1.5 w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-[10px] font-bold text-red-500 shadow-lg shadow-red-500/10">1</div>
            <div className="p-6 rounded-xl glass-panel border-white/[0.06] group-hover:border-red-500/20 transition-colors">
              <span className="text-xs font-semibold text-red-400">Application Submitted</span>
              <h3 className="text-xl font-bold text-white mt-1">Generic Cover Letter Sent</h3>
              <p className="text-slate-400 text-sm mt-2">
                You submit a generic copy-pasted cover letter because rewriting it for every single application takes hours of energy.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[64px] top-1.5 w-6 h-6 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center text-[10px] font-bold text-yellow-500 shadow-lg shadow-yellow-500/10">2</div>
            <div className="p-6 rounded-xl glass-panel border-white/[0.06] group-hover:border-yellow-500/20 transition-colors">
              <span className="text-xs font-semibold text-yellow-400">ATS Screening</span>
              <h3 className="text-xl font-bold text-white mt-1">Flagged as Generic AI or Unrelated</h3>
              <p className="text-slate-400 text-sm mt-2">
                Applicant Tracking System scans the text. The document lacks critical keywords or contains typical ChatGPT patterns, ranking you in the bottom tier.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[64px] top-1.5 w-6 h-6 rounded-full bg-red-600/30 border-2 border-red-600 flex items-center justify-center text-[10px] font-bold text-red-500 shadow-lg shadow-red-600/10">3</div>
            <div className="p-6 rounded-xl glass-panel border-white/[0.06] group-hover:border-red-600/30 transition-colors">
              <span className="text-xs font-semibold text-red-500 font-bold uppercase tracking-wider">No Reply & Ghosted</span>
              <h3 className="text-xl font-bold text-white mt-1">Application Rejected</h3>
              <p className="text-slate-400 text-sm mt-2">
                Your application is filed away. Weeks pass, leaving you wondering why you never heard back despite having the exact technical qualifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-24 border-t border-white/[0.04] max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Our Tailoring System</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">Write Better Letters. 10x Faster.</p>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Our multi-step generator aligns your resume accomplishments directly with job description requirements in seconds.
          </p>
        </div>

        {/* Solution Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 text-blue-500">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Input Credentials</h3>
              <p className="text-slate-400 text-sm mt-2.5">
                Paste your resume or details once. Our analyzer maps your strongest career highlights.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-6">Step One</span>
          </div>

          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Paste Target Post</h3>
              <p className="text-slate-400 text-sm mt-2.5">
                Insert the target job description. The parser identifies mandatory skills and ATS keywords.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-6">Step Two</span>
          </div>

          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-450">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Generate in Seconds</h3>
              <p className="text-slate-400 text-sm mt-2.5">
                Our model crafts tailored cover letter paragraphs matching your skills with the company culture.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-6">Step Three</span>
          </div>

          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 text-green-500">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Export & Apply</h3>
              <p className="text-slate-400 text-sm mt-2.5">
                Check tone guidelines, copy to clipboard, or save as Draft. Apply with total confidence.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-6">Step Four</span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SHOWCASE SECTION */}
      <section id="showcase" className="py-24 border-t border-white/[0.04] bg-slate-950/40 max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left panel - controls */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Live Experience</h2>
            <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">Interactive Writing Preview</p>
            <p className="text-slate-400 mt-4 leading-relaxed mb-8 text-sm">
              Toggle the selector buttons below to see how our generation system writes tailored content, adjusting vocabulary and sentences to match target tones.
            </p>

            <div className="flex flex-col space-y-3">
              {["Professional", "Enthusiastic", "Concise", "Confident"].map((t) => (
                <button
                  key={t}
                  onClick={() => setShowcaseTone(t)}
                  className={`px-5 py-3.5 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                    showcaseTone === t
                      ? "bg-blue-600/10 border-blue-600/50 text-blue-400 shadow-md shadow-blue-600/5"
                      : "bg-white/[0.02] border-white/[0.05] text-slate-450 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span>{t} Tone</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${showcaseTone === t ? "bg-blue-500 shadow-md shadow-blue-500" : "bg-slate-600"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right panel - document display */}
          <div className="lg:col-span-7">
            <div className="rounded-xl glass-panel p-4 md:p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-5">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-slate-400 font-semibold">Alex Mercer Cover Letter.pdf</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-blue-600/15 text-[10px] font-bold text-blue-400 uppercase">
                  {showcaseTone} Mode
                </div>
              </div>

              {/* Document Paper Mock */}
              <div className="rounded-lg bg-[#070a11] border border-white/[0.04] p-6 min-h-[360px] max-h-[460px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-350 select-none">
                <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-slate-300">{typedText}</pre>
                <div className="w-1.5 h-4 bg-blue-500 inline-block animate-pulse ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-white/[0.04] max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Key Features</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">Built For High Conversions</p>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Every feature is fine-tuned to bypass automated resume screeners and grab recruiters' attention.
          </p>
        </div>

        {/* Magazine-style Asymmetrical Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Main */}
          <div className="md:col-span-8 p-8 rounded-2xl glass-panel border-white/[0.06] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
            <div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Precision Tailoring</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2 mb-4">Job-Specific Customization</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                Our algorithm processes descriptions line-by-line, matching key responsibilities with specific projects and metrics from your resume. No generic placeholder text.
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-bold tracking-wider uppercase mt-8 cursor-pointer hover:text-blue-300">
              <span>View workflow details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Right Column Top */}
          <div className="md:col-span-4 p-8 rounded-2xl glass-panel border-white/[0.06] flex flex-col justify-between group">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Bots Verified</span>
              <h3 className="text-xl font-bold text-white mt-2 mb-3">ATS Optimization</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scan targets for mandatory keywords. Seamlessly inject them into your cover letter naturally to achieve score matching above 90%.
              </p>
            </div>
            <div className="flex items-center space-x-1 border-t border-white/[0.06] pt-4 mt-6">
              <CheckCircle className="w-4.5 h-4.5 text-green-500" />
              <span className="text-[11px] text-slate-450 font-semibold">ATS Compatibility Checked</span>
            </div>
          </div>

          {/* Card 3: Row 2 Left */}
          <div className="md:col-span-4 p-8 rounded-2xl glass-panel border-white/[0.06] flex flex-col justify-between group">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Layout Options</span>
              <h3 className="text-xl font-bold text-white mt-2 mb-3">Multiple Templates</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Select between modern styles—from tech-forward startup layouts to clean corporate designs. Export clean text formats immediately.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6">Ready to download</span>
          </div>

          {/* Card 4: Row 2 Middle */}
          <div className="md:col-span-4 p-8 rounded-2xl glass-panel border-white/[0.06] flex flex-col justify-between group">
            <div>
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Fast Apply</span>
              <h3 className="text-xl font-bold text-white mt-2 mb-3">One Click Export</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Download your formatted cover letter directly to PDF or copy with rich text formatting intact to apply directly on job portals.
              </p>
            </div>
            <div className="w-full bg-white/[0.03] border border-white/[0.06] h-8 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-semibold mt-6">
              <span>PDF, DOCX & Plain Text</span>
            </div>
          </div>

          {/* Card 5: Row 2 Right */}
          <div className="md:col-span-4 p-8 rounded-2xl glass-panel border-white/[0.06] flex flex-col justify-between group">
            <div>
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">History Logs</span>
              <h3 className="text-xl font-bold text-white mt-2 mb-3">Version Management</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Never lose cover letters you generated. Access previous versions, edit drafts, or archive items inside a organized dashboard workspace.
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6">Zustand Managed</span>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS CAROUSEL */}
      <section className="py-24 border-t border-white/[0.04] bg-slate-950/20 max-w-7xl mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Success Stories</h2>
            <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">Recommended by Top Engineers</p>
          </div>

          <div className="relative min-h-[220px] max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Stars */}
            <div className="flex space-x-1 mb-6">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed italic mb-8">
              "{testimonials[activeTestimonial].quote}"
            </p>

            {/* Author */}
            <div>
              <h4 className="text-white font-bold text-base">{testimonials[activeTestimonial].author}</h4>
              <p className="text-slate-450 text-xs mt-0.5">{testimonials[activeTestimonial].role}</p>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center space-x-4 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${activeTestimonial === index ? "bg-blue-500 w-6" : "bg-white/[0.15] hover:bg-white/[0.3]"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 border-t border-white/[0.04] max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 blur-[160px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Pricing</h2>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-tight">Pay For Value. Cancel Anytime.</p>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Start completely free. Upgrade when you need advanced tailoring or high-volume templates.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Free */}
          <div className="p-8 rounded-2xl glass-panel flex flex-col justify-between border-white/[0.06] hover:border-white/[0.15] transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-slate-450 text-xs mt-1.5">For casual job seekers</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-slate-500 text-xs ml-1.5">/ forever</span>
              </div>

              <ul className="mt-8 space-y-4 text-xs text-slate-350">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>3 cover letters per month</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Access to Mock Generator tone models</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>PDF download format</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="mt-8 w-full py-3 rounded-xl text-center text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Card 2: Pro */}
          <div className="p-8 rounded-2xl glass-panel relative flex flex-col justify-between border-blue-500/25 shadow-xl shadow-blue-600/5 hover:border-blue-500/40 transition-all bg-[#0a0f1d]">
            {/* Pop Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider border border-blue-400/25">
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Pro Planner</h3>
              <p className="text-blue-400 text-xs mt-1.5 font-medium">Accelerated results</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-slate-500 text-xs ml-1.5">/ month</span>
              </div>

              <ul className="mt-8 space-y-4 text-xs text-slate-350">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-white">Unlimited cover letter creations</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Advanced OpenAI / Gemini generation models</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>ATS Keyword Match optimization score dashboard</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Premium typography layouts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Priority fast customer support</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="mt-8 w-full py-3 rounded-xl text-center text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 glow-btn"
            >
              Get Pro Now
            </Link>
          </div>

          {/* Card 3: Team */}
          <div className="p-8 rounded-2xl glass-panel flex flex-col justify-between border-white/[0.06] hover:border-white/[0.15] transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Team Pack</h3>
              <p className="text-slate-450 text-xs mt-1.5">For bootcamps & advisors</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-slate-500 text-xs ml-1.5">/ month</span>
              </div>

              <ul className="mt-8 space-y-4 text-xs text-slate-350">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Up to 10 users mapped seats</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Shared templates library folder</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Custom theme branding parameters</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Admin settings audit trail logs</span>
                </li>
              </ul>
            </div>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="mt-8 w-full py-3 rounded-xl text-center text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative py-28 max-w-7xl mx-auto px-6 border-t border-white/[0.04]">
        <div className="rounded-2xl glass-panel border-white/[0.06] bg-gradient-to-br from-slate-950/80 to-[#0e172a]/40 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Stop Submitting Rejections. <br />
            <span className="text-gradient">Start Landing Offers.</span>
          </h2>
          <p className="text-slate-450 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
            Join thousands of developers and product designers who successfully upgraded their job application response rates.
          </p>

          <Link
            href={session ? "/dashboard" : "/register"}
            className="inline-flex px-8 py-4 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all items-center space-x-2 glow-btn"
          >
            <span>Generate Your Free Cover Letter</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 max-w-7xl mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-7.5 h-7.5 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">CoverLetter AI</span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CoverLetter AI. Built for elite careers. All rights reserved.
          </p>

          <div className="flex space-x-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
