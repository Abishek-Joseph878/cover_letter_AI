"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight, Eye, EyeOff, Lock, Mail, ChevronLeft, TrendingUp } from "lucide-react";

// Form Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-slate-450">Loading sign in...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push(from);
    }
  }, [session, router, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid credentials");
      } else {
        toast.success("Successfully logged in!");
        router.push(from);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground overflow-hidden relative">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center space-x-1.5 text-xs text-text-muted hover:text-foreground transition-colors py-1.5 px-3 rounded-lg bg-secondary/80 border border-border-color backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to home</span>
      </Link>

      {/* Left panel - Form */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-20 relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4.5 h-4.5 text-always-white" />
            </div>
            <span className="font-semibold text-base tracking-tight text-foreground">CoverLetterAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-xs text-text-muted mt-2">
              Sign in to your account to continue tailoring documents.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-3 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500/50" : "border-border-color"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-500 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 py-3 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.password ? "border-red-500/50" : "border-border-color"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-always-white shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 glow-btn disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-xs text-text-muted text-center mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - Animations */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-center items-center relative bg-gradient-to-br from-[#0b0f19] to-[#04060b] border-l border-white/[0.04] dark-theme-container">
        {/* Gradients */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-lg w-full text-center px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl glass-panel p-6 shadow-2xl relative bg-slate-950/40 border-white/[0.06] mb-8"
          >
            {/* Ambient top light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Salary Growth & ATS Ranking</span>
              </div>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>

            {/* Visual salary chart representation */}
            <div className="h-44 w-full flex items-end justify-between space-x-2.5 px-2 mb-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-white/[0.05]">
                <div className="w-full border-t border-white/[0.03] h-0" />
                <div className="w-full border-t border-white/[0.03] h-0" />
                <div className="w-full border-t border-white/[0.03] h-0" />
              </div>
              {[40, 55, 45, 75, 90, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-blue-600/30 to-blue-500 rounded-t-md relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      +{h}%
                    </div>
                  </motion.div>
                  <span className="text-[9px] text-slate-500 mt-2 font-bold uppercase">Q{i + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white">Elevate your career trajectory</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Create and tailor cover letters that align directly with corporate standards, increasing interviews response rate by over 40%.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
