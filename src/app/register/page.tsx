"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight, Eye, EyeOff, Lock, Mail, User, ChevronLeft, Award } from "lucide-react";

// Form Schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to register account");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
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

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
            <p className="text-xs text-text-muted mt-2">
              Join CoverLetter AI and get access to the professional resume analyzer.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.name ? "border-red-500/50" : "border-border-color"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-4 py-2.5 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500/50" : "border-border-color"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full pl-10 pr-10 py-2.5 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
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
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-secondary/30 border rounded-xl text-sm text-foreground placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.confirmPassword ? "border-red-500/50" : "border-border-color"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-always-white shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 glow-btn disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-xs text-text-muted text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - Promo */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-center items-center relative bg-gradient-to-br from-[#0b0f19] to-[#04060b] border-l border-white/[0.04] dark-theme-container">
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-lg w-full text-center px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl glass-panel p-8 shadow-2xl relative bg-slate-950/40 border-white/[0.06] mb-8"
          >
            {/* Ambient top light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-6 text-blue-500">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Join our elite member platform</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Unlock access to advanced models, custom dashboard layouts, unlimited exports, and direct tracking of ATS alignment keywords.
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-white/[0.05] pt-6 text-left">
              <div>
                <h4 className="text-lg font-bold text-white">99%</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">ATS Success</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">10x</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Speed Boost</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">15k+</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Users Mapped</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
