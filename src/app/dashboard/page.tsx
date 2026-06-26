"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useStore, CoverLetter } from "@/store/useStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Search,
  Plus,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  FolderOpen,
  TrendingUp,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  FileDown,
  Copy,
  Layout,
  User,
  Info,
  CheckCircle,
  HelpCircle,
  Loader2,
  ShieldAlert,
  CreditCard,
  FileCheck,
  RefreshCw
} from "lucide-react";

// Form Schema
const coverLetterSchema = z.object({
  title: z.string().min(2, "Title is required"),
  position: z.string().min(2, "Job Position is required"),
  company: z.string().min(2, "Company Name is required"),
  tone: z.string(),
  jobDescription: z.string().optional(),
  resumeText: z.string().optional(),
});

type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Zustand Store values
  const {
    activeTab,
    selectedLetter,
    coverLetters,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isLoadingLetters,
    setActiveTab,
    setSelectedLetter,
    setCoverLetters,
    addCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    setCreateModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setLoadingLetters,
  } = useStore();

  // Local Form state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [typingText, setTypingText] = useState("");
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);

  // Expanded Sidebar & Settings Navigation state
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [settingsSubTab, setSettingsSubTab] = useState("profile");
  const [preferredModel, setPreferredModel] = useState("Groq Llama 3 (70B)");
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Your account has been permanently deleted.");
        signOut();
      } else {
        toast.error(data.error || "Failed to delete account");
      }
    } catch (err) {
      toast.error("Network error deleting account");
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteAccountOpen(false);
    }
  };

  // ATS Checker state
  const [atsInput, setAtsInput] = useState("");
  const [atsResult, setAtsResult] = useState<any>(null);
  const [isCheckingAts, setIsCheckingAts] = useState(false);

  // Type Conversion state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversionText, setConversionText] = useState("");
  const [targetType, setTargetType] = useState("Romantic Letter");
  const [convertedOutput, setConvertedOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleAtsCheck = async () => {
    if (!atsInput.trim()) {
      toast.error("Please enter cover letter content to evaluate.");
      return;
    }
    setIsCheckingAts(true);
    setAtsResult(null);
    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: atsInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAtsResult(data.data);
        toast.success("ATS Analysis completed!");
      } else {
        toast.error(data.error || "Analysis failed");
      }
    } catch (err) {
      toast.error("Network error analyzing document");
    } finally {
      setIsCheckingAts(false);
    }
  };

  const handleConvert = async () => {
    if (!uploadedFile && !conversionText.trim()) {
      toast.error("Please upload a PDF/TXT or paste the text manually.");
      return;
    }
    setIsConverting(true);
    setConvertedOutput("");
    try {
      const formData = new FormData();
      formData.append("targetType", targetType);
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }
      if (conversionText.trim()) {
        formData.append("text", conversionText);
      }

      const res = await fetch("/api/convert-letter", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConvertedOutput(data.data);
        toast.success("Letter converted successfully!");
      } else {
        toast.error(data.error || "Conversion failed");
      }
    } catch (err) {
      toast.error("Network error during conversion");
    } finally {
      setIsConverting(false);
    }
  };

  // Form hooks
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      title: "",
      position: "",
      company: "",
      tone: "Professional",
      jobDescription: "",
      resumeText: "",
    },
  });

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStatus, setEditStatus] = useState<"Draft" | "Generated" | "Archived">("Generated");
  const [editContent, setEditContent] = useState("");

  // Route Guard check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch cover letters
  const loadData = async () => {
    setLoadingLetters(true);
    try {
      const res = await fetch("/api/coverletters");
      const data = await res.json();
      if (res.ok && data.success) {
        setCoverLetters(data.data);
        if (data.data.length > 0) {
          setSelectedLetter(data.data[0]);
        }
      } else {
        toast.error("Failed to load documents");
      }
    } catch (err) {
      toast.error("Error connecting to database");
    } finally {
      setLoadingLetters(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  // Typing effect helper
  const triggerTypingEffect = (text: string) => {
    let index = 0;
    setTypingText("");
    const interval = setInterval(() => {
      setTypingText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 8);
  };

  // Generate Letter logic
  const handleGenerate = async (values: CoverLetterFormValues) => {
    setIsGenerating(true);
    setGeneratedResult("");
    setTypingText("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setGeneratedResult(data.data);
        triggerTypingEffect(data.data);
        toast.success("Generation completed!");
      } else {
        toast.error(data.error || "Failed to generate");
      }
    } catch (err) {
      toast.error("Network error during generation");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save new cover letter
  const saveNewCoverLetter = async (statusVal: "Draft" | "Generated") => {
    if (!generatedResult && !typingText) {
      toast.error("No content to save");
      return;
    }

    const formValues = watch();
    try {
      const res = await fetch("/api/coverletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formValues.title,
          position: formValues.position,
          company: formValues.company,
          tone: formValues.tone,
          jobDescription: formValues.jobDescription,
          resumeText: formValues.resumeText,
          content: typingText || generatedResult,
          status: statusVal,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addCoverLetter(data.data);
        setSelectedLetter(data.data);
        setCreateModalOpen(false);
        reset();
        setGeneratedResult("");
        setTypingText("");
        toast.success("Document saved successfully!");
      } else {
        toast.error(data.error || "Failed to save document");
      }
    } catch (err) {
      toast.error("Network error saving document");
    }
  };

  // Open edit modal
  const openEditFlow = (letter: CoverLetter) => {
    setEditTitle(letter.title);
    setEditPosition(letter.position);
    setEditCompany(letter.company);
    setEditStatus(letter.status);
    setEditContent(letter.content);
    setEditModalOpen(true);
  };

  // Save edited letter
  const handleUpdate = async () => {
    if (!selectedLetter) return;
    try {
      const res = await fetch(`/api/coverletters/${selectedLetter._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          position: editPosition,
          company: editCompany,
          status: editStatus,
          content: editContent,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        updateCoverLetter(data.data);
        setEditModalOpen(false);
        toast.success("Document updated successfully!");
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Network error updating document");
    }
  };

  // Open delete warning
  const openDeleteFlow = (id: string) => {
    setLetterToDelete(id);
    setDeleteModalOpen(true);
  };

  // Delete letter logic
  const confirmDelete = async () => {
    if (!letterToDelete) return;
    try {
      const res = await fetch(`/api/coverletters/${letterToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        deleteCoverLetter(letterToDelete);
        setDeleteModalOpen(false);
        setLetterToDelete(null);
        toast.success("Document deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error deleting document");
    }
  };

  // Copy content to clipboard
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Export to PDF
  const handleExportPDF = (letter: CoverLetter) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Enable popups to print/export PDF");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${letter.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; margin: 0; }
          </style>
        </head>
        <body>
          <pre>${letter.content}</pre>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("PDF export view loaded!");
  };

  // Filtered Letters list
  const filteredLetters = coverLetters.filter((letter) => {
    const matchesSearch =
      letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || letter.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats Counters
  const totalLetters = coverLetters.length;
  const draftLetters = coverLetters.filter((l) => l.status === "Draft").length;
  const generatedLetters = coverLetters.filter((l) => l.status === "Generated").length;
  const successRate = totalLetters > 0 ? 86 : 0;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`transition-all duration-300 border-r border-white/[0.06] bg-slate-950/40 flex flex-col justify-between shrink-0 ${
        isSidebarMinimized ? "w-20" : "w-64"
      }`}>
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Header brand */}
            <div className={`h-16 border-b border-white/[0.06] flex items-center px-6 ${
              isSidebarMinimized ? "justify-center" : "space-x-2.5"
            }`}>
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <img src="/logo.png" alt="Covalet Logo" className="w-full h-full object-cover" />
              </div>
              {!isSidebarMinimized && <span className="font-semibold text-sm tracking-tight text-white">Covalet</span>}
            </div>

            {/* New Letter Button */}
            <div className="p-4">
              {isSidebarMinimized ? (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-10 h-10 mx-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 glow-btn"
                  title="Create New Letter"
                >
                  <Plus className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-1.5 glow-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Letter</span>
                </button>
              )}
            </div>

            {/* Main Tabs */}
            <nav className="px-3 space-y-1">
              {[
                { id: "workspace", label: "Workspace", icon: Layout },
                { id: "coverletters", label: "Cover Letters", icon: FileText },
                { id: "templates", label: "Templates", icon: FolderOpen },
                { id: "ats", label: "ATS Checker", icon: FileCheck },
                { id: "convert", label: "Type Conversion", icon: RefreshCw }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full py-2.5 px-4.5 rounded-xl text-xs font-semibold flex items-center transition-colors ${
                      isSidebarMinimized ? "justify-center" : "space-x-3"
                    } ${
                      activeTab === tab.id
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/10"
                        : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                    }`}
                    title={tab.label}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarMinimized && <span>{tab.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar navigation */}
          <div>
            <nav className="px-3 mb-2 space-y-1">
              {/* Settings button */}
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full py-2.5 px-4.5 rounded-xl text-xs font-semibold flex items-center transition-colors ${
                  isSidebarMinimized ? "justify-center" : "space-x-3"
                } ${
                  activeTab === "settings"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/10"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!isSidebarMinimized && <span>Settings</span>}
              </button>

              {/* Collapse Sidebar Button */}
              <button
                onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
                className={`w-full py-2.5 px-4.5 rounded-xl text-xs font-semibold flex items-center text-slate-400 hover:bg-white/[0.03] hover:text-white transition-colors ${
                  isSidebarMinimized ? "justify-center" : "space-x-3"
                }`}
                title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isSidebarMinimized ? (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    <span>Collapse Sidebar</span>
                  </>
                )}
              </button>
            </nav>

            {/* Footer profile */}
            <div className="p-4 border-t border-white/[0.06] bg-slate-950/20">
              <div className={`flex items-center ${isSidebarMinimized ? "justify-center" : "justify-between"}`}>
                <div className="flex items-center space-x-3 max-w-[140px]">
                  <div className="w-8.5 h-8.5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {!isSidebarMinimized && (
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{session.user?.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
                    </div>
                  )}
                </div>
                {!isSidebarMinimized && (
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-xl text-slate-450 hover:text-white hover:bg-white/[0.05] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 bg-slate-950/20 shrink-0">
          <h2 className="text-sm font-bold text-slate-400">
            Covalet <span className="mx-1.5 text-white/20 font-normal">&gt;</span>{" "}
            <span className="text-white capitalize">
              {activeTab === "ats"
                ? "ATS Checker & Evaluator"
                : activeTab === "convert"
                ? "Letter Type & Style Conversion"
                : activeTab === "workspace"
                ? "Workspace Overview"
                : activeTab === "coverletters"
                ? "Cover Letters"
                : `${activeTab} Panel`}
            </span>
          </h2>
          <div className="flex items-center space-x-3">
            {/* Active Session tag removed */}
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* TAB 1: WORKSPACE */}
          {activeTab === "workspace" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Greeting Hero Section */}
              <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-white/[0.08] bg-gradient-to-r from-blue-950/20 via-slate-900/30 to-indigo-950/20">
                {/* Holographic SVG Background */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block select-none">
                  <svg className="w-full h-full" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-50,75 C50,25 150,125 250,75 C350,25 450,125 550,75" stroke="url(#holo-gradient-1)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M-50,90 C60,40 140,140 260,90 C380,40 440,140 560,90" stroke="url(#holo-gradient-2)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M-50,60 C40,10 160,110 240,60 C320,10 460,110 540,60" stroke="url(#holo-gradient-3)" strokeWidth="1" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="holo-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="holo-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="holo-gradient-3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="relative z-10 max-w-xl">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                    Welcome back, {session.user?.name || "Job Seeker"}!
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                    Craft tailored, high-impact, and ATS-optimized cover letters designed to align with corporate standards and increase response rates.
                  </p>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 flex items-center space-x-2 glow-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Craft New Letter</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { label: "Total Cover Letters", value: totalLetters, icon: FileText, color: "text-blue-500" },
                  { label: "Generated This Month", value: generatedLetters, icon: Sparkles, color: "text-indigo-400" },
                  { label: "Saved Drafts", value: draftLetters, icon: FolderOpen, color: "text-yellow-500" },
                  { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, color: "text-green-500" }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-5 rounded-xl glass-panel relative overflow-hidden group hover:border-blue-500/20 transition-all duration-350">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                        <Icon className={`w-4.5 h-4.5 ${stat.color} transition-transform group-hover:scale-110 duration-300`} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Recent Cover Letters Card Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Cover Letters</h3>
                  <button
                    onClick={() => setActiveTab("coverletters")}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    View All
                  </button>
                </div>

                {coverLetters.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-xl glass-panel">
                    <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-xs font-bold text-white">No cover letters generated yet</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">Create a tailored document to see it appear in this dashboard.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coverLetters.slice(0, 4).map((letter) => (
                      <div
                        key={letter._id}
                        className="p-5 rounded-xl glass-panel relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{letter.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${
                              letter.status === "Draft"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : letter.status === "Archived"
                                ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                : "bg-blue-600/15 text-blue-400 border-blue-500/20"
                            }`}>
                              {letter.status}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 font-medium">{letter.position}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">at {letter.company}</p>
                          
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-3 leading-relaxed border-t border-white/[0.04] pt-3">
                            {letter.content}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-5 border-t border-white/[0.04] pt-3">
                          <span className="text-[9px] text-slate-500">
                            {new Date(letter.createdAt).toLocaleDateString()}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedLetter(letter);
                                setActiveTab("coverletters");
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-slate-450 hover:text-white transition-colors"
                              title="Open Document"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditFlow(letter)}
                              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-slate-455 hover:text-white transition-colors"
                              title="Edit Document"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyToClipboard(letter.content)}
                              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-slate-455 hover:text-white transition-colors"
                              title="Copy Content"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleExportPDF(letter)}
                              className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 transition-colors"
                              title="PDF Export"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COVER LETTERS (WORK AREA / CRUD PANEL) */}
          {activeTab === "coverletters" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: List */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                {/* Search & Filters */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search title, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 pl-9 pr-4 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="All">All</option>
                    <option value="Generated">Generated</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* List Container */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {isLoadingLetters ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 w-full rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                      ))}
                    </div>
                  ) : filteredLetters.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-8">No cover letters found.</p>
                  ) : (
                    filteredLetters.map((letter) => (
                      <div
                        key={letter._id}
                        onClick={() => setSelectedLetter(letter)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedLetter?._id === letter._id
                            ? "bg-blue-600/10 border-blue-600/50 text-blue-400"
                            : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] text-slate-350"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{letter.title}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            letter.status === "Draft"
                              ? "bg-yellow-500/15 text-yellow-500"
                              : letter.status === "Archived"
                              ? "bg-slate-500/15 text-slate-450"
                              : "bg-blue-600/15 text-blue-400"
                          }`}>
                            {letter.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{letter.position} at {letter.company}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Active Preview */}
              <div className="lg:col-span-8">
                {selectedLetter ? (
                  <div className="rounded-xl glass-panel p-6 shadow-2xl relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    
                    {/* Preview Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/[0.06] mb-6 gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">{selectedLetter.title}</h2>
                        <p className="text-xs text-slate-450 mt-1">
                          {selectedLetter.position} at <strong className="text-white">{selectedLetter.company}</strong>
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-[9px] font-bold text-slate-500 bg-white/[0.05] border border-white/[0.06] py-0.5 px-2 rounded uppercase">
                            Tone: {selectedLetter.tone || "Professional"}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            Updated {new Date(selectedLetter.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* CRUD Actions buttons */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => openEditFlow(selectedLetter)}
                          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-350 hover:text-white transition-colors"
                          title="Edit Document"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteFlow(selectedLetter._id)}
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="h-6 w-[1px] bg-white/[0.08]" />
                        <button
                          onClick={() => handleCopyToClipboard(selectedLetter.content)}
                          className="py-2.5 px-4 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleExportPDF(selectedLetter)}
                          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/10 flex items-center space-x-1.5 glow-btn"
                        >
                          <FileDown className="w-4 h-4" />
                          <span>PDF Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Paper preview */}
                    <div className="rounded-lg bg-[#070a11] border border-white/[0.05] p-8 shadow-inner max-h-[500px] overflow-y-auto text-sm leading-relaxed text-slate-300 font-sans whitespace-pre-wrap select-text">
                      {selectedLetter.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 rounded-xl glass-panel border-white/[0.06]">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-sm font-bold text-white">No Cover Letter Selected</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Select a cover letter from the sidebar list or generate a new one to view details.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Templates Library</h3>
              <p className="text-xs text-slate-400">Choose a structural template blueprint to adjust paragraph formats.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {[
                  { title: "Silicon Valley Tech", desc: "Action-oriented phrasing emphasizing technical optimization metrics, suitable for startups.", active: true },
                  { title: "Executive Professional", desc: "Polished and structured format designed for director roles and corporate applications.", active: false },
                  { title: "Creative Agency", desc: "Warm and engaging tone emphasizing storytelling, designs, and soft skills collaborations.", active: false }
                ].map((tpl, i) => (
                  <div key={i} className="p-6 rounded-xl glass-panel flex flex-col justify-between hover:border-blue-500/20 transition-all cursor-pointer">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xs font-bold text-white">{tpl.title}</h4>
                        {tpl.active && <span className="text-[8px] bg-blue-600/20 text-blue-400 font-bold px-1.5 py-0.5 rounded">Active</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{tpl.desc}</p>
                    </div>
                    <button className="mt-6 w-full py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] rounded-lg text-[10px] text-slate-400 hover:text-white transition-colors">
                      {tpl.active ? "Currently Selected" : "Use Template"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Settings Internal Sidebar */}
              <div className="md:col-span-3 flex flex-col space-y-1.5 border-b md:border-b-0 md:border-r border-white/[0.06] pb-6 md:pb-0 md:pr-6 self-stretch">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3 mb-2">Settings Menu</span>
                {[
                  { id: "profile", label: "Manage Profile", icon: User },
                  { id: "models", label: "Model Settings", icon: Sparkles },
                  { id: "billing", label: "Billing & Plans", icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSettingsSubTab(item.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all text-left ${
                        settingsSubTab === item.id
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-sm"
                          : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Settings Content Area */}
              <div className="md:col-span-9 space-y-6">
                {/* SUBTAB 1: ACCOUNT PROFILE */}
                {settingsSubTab === "profile" && (
                  <div className="space-y-6">
                    <div className="rounded-xl glass-panel p-6 space-y-6">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>Account Information</span>
                      </h3>

                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">User Name</span>
                            <p className="text-white font-semibold mt-1 bg-white/[0.02] border border-white/[0.06] p-3 rounded-lg">{session.user?.name}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Email Address</span>
                            <p className="text-white font-semibold mt-1 bg-white/[0.02] border border-white/[0.06] p-3 rounded-lg truncate">{session.user?.email}</p>
                          </div>
                        </div>

                        <div className="border-t border-white/[0.06] pt-4 mt-6">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Connected Integration</span>
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center space-x-2 w-fit">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold text-[11px]">MongoDB Atlas Connection Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-xl border border-red-500/20 bg-red-950/5 p-6 space-y-4">
                      <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span>Danger Zone</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 max-w-xl leading-relaxed">
                        Once you delete your account, there is no going back. All your saved cover letters, job progress drafts, and customization profiles will be permanently erased.
                      </p>
                      <button
                        onClick={() => setIsDeleteAccountOpen(true)}
                        className="py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 text-xs font-bold transition-colors"
                      >
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: MODEL SETTINGS */}
                {settingsSubTab === "models" && (
                  <div className="space-y-6">
                    {/* Preferred Model selection */}
                    <div className="rounded-xl glass-panel p-6 space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>Model Preferences</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Select the primary artificial intelligence model to use for tailoring and drafting cover letters.
                      </p>

                      <div className="max-w-md pt-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Primary Model</label>
                        <select
                          value={preferredModel}
                          onChange={(e) => {
                            setPreferredModel(e.target.value);
                            toast.success(`Default model changed to ${e.target.value}`);
                          }}
                          className="w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="Groq Llama 3 (70B)">Groq Llama 3 (70B) - Recommended (Ultra Fast)</option>
                          <option value="Groq Mixtral 8x7B">Groq Mixtral 8x7B (High Quality Context)</option>
                          <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Balanced speed & accuracy)</option>
                          <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep analytical capability)</option>
                        </select>
                      </div>
                    </div>

                    {/* Model Quota & API Calls card */}
                    <div className="rounded-xl glass-panel p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span>Model Quota & API Calls</span>
                        </h3>
                        <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 py-0.5 px-2.5 rounded">
                          Usage Tracking
                        </span>
                      </div>

                      <div className="space-y-5">
                        {/* Quota Progress */}
                        <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl space-y-3">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Monthly Generations Used</span>
                            <span className="text-white">{generatedLetters} / 50 Calls</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((generatedLetters / 50) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>Resets on next billing cycle</span>
                            <span>{Math.round(Math.min((generatedLetters / 50) * 100, 100))}% consumed</span>
                          </div>
                        </div>

                        {/* SVG Chart showing usage history */}
                        <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generations Frequency</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Frequency of API requests over time</p>
                            </div>
                          </div>

                          <div className="h-40 w-full relative">
                            <svg viewBox="0 0 500 150" className="w-full h-full">
                              <defs>
                                <linearGradient id="dashboardChartGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M 20,130 C 80,115 120,125 180,85 C 240,45 280,65 340,35 C 400,5 440,25 480,15"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 20,130 C 80,115 120,125 180,85 C 240,45 280,65 340,35 C 400,5 440,25 480,15 L 480,150 L 20,150 Z"
                                fill="url(#dashboardChartGlow)"
                              />
                              {/* Dots */}
                              <circle cx="20" cy="130" r="3.5" className="fill-[#090d16] stroke-blue-500 stroke-2" />
                              <circle cx="180" cy="85" r="3.5" className="fill-[#090d16] stroke-blue-500 stroke-2" />
                              <circle cx="340" cy="35" r="3.5" className="fill-[#090d16] stroke-blue-500 stroke-2" />
                              <circle cx="480" cy="15" r="3.5" className="fill-[#090d16] stroke-blue-500 stroke-2" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: BILLING & PLANS */}
                {settingsSubTab === "billing" && (
                  <div className="space-y-6">
                    <div className="rounded-xl glass-panel p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                            <span>Active Plan & Subscription</span>
                          </h3>
                          <p className="text-[11px] text-slate-400">Manage your subscription package and billing history logs.</p>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded text-[10px] font-bold">
                          Free Tier Account
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {[
                          { name: "Starter", price: "$0", desc: "For casual job seekers", features: ["5 Cover Letters/mo", "Standard speed", "Core templates"], current: true },
                          { name: "Premium Pro", price: "$9", desc: "For active candidates", features: ["50 Cover Letters/mo", "Fast generation", "Custom model select", "Advanced tones"], current: false, recommended: true },
                          { name: "Enterprise", price: "$29", desc: "For career placement agencies", features: ["Unlimited generations", "Ultra-priority API speed", "Team workspaces", "Custom templates"], current: false },
                        ].map((plan, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border flex flex-col justify-between relative ${
                              plan.current
                                ? "bg-blue-600/5 border-blue-500/30"
                                : plan.recommended
                                ? "bg-white/[0.02] border-blue-500/20 hover:border-blue-500/30"
                                : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                            } transition-all duration-300`}
                          >
                            {plan.recommended && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Recommended
                              </span>
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-white mb-0.5">{plan.name}</h4>
                              <p className="text-[9px] text-slate-500 mb-3">{plan.desc}</p>
                              <div className="flex items-baseline mb-4">
                                <span className="text-lg font-extrabold text-white">{plan.price}</span>
                                <span className="text-[9px] text-slate-500 ml-1">/ month</span>
                              </div>
                              <ul className="space-y-2 text-[9px] text-slate-400 mb-4 border-t border-white/[0.04] pt-3">
                                {plan.features.map((feat, fIdx) => (
                                  <li key={fIdx} className="flex items-center space-x-1.5">
                                    <CheckCircle className="w-3 h-3 text-blue-500 shrink-0" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => {
                                if (plan.current) {
                                  toast.info("You are already on this plan.");
                                } else {
                                  toast.success(`Redirecting to upgrade checkout for ${plan.name} plan...`);
                                }
                              }}
                              className={`w-full py-1.5 rounded-lg text-[10px] font-bold text-center transition-colors ${
                                plan.current
                                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 cursor-default"
                                  : "bg-blue-600 hover:bg-blue-500 text-white"
                              }`}
                            >
                              {plan.current ? "Current Plan" : "Upgrade Plan"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ATS CHECKER */}
          {activeTab === "ats" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-white/[0.08] bg-gradient-to-r from-blue-950/20 via-slate-900/30 to-indigo-950/20">
                <div className="relative z-10 max-w-xl">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                    ATS & Content Checker
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    Analyze document readability, estimate the probability of AI generation vs human authorship, identify the type of letter, and receive tailored improvement recommendations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Input text */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl glass-panel p-6 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Paste Document Content</span>
                    </h3>
                    <textarea
                      rows={14}
                      value={atsInput}
                      onChange={(e) => setAtsInput(e.target.value)}
                      placeholder="Paste your cover letter or general document text here to run an ATS score check, tone analysis, and AI probability breakdown..."
                      className="w-full bg-[#070a11] border border-white/[0.08] rounded-xl p-4 text-xs font-sans text-slate-300 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed resize-none"
                    />
                    <button
                      onClick={handleAtsCheck}
                      disabled={isCheckingAts}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 disabled:opacity-50 glow-btn"
                    >
                      {isCheckingAts ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluating Document...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4" />
                          <span>Run ATS Check & Analysis</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Scorecard Results */}
                <div className="lg:col-span-7">
                  {isCheckingAts ? (
                    <div className="rounded-xl glass-panel p-12 text-center space-y-4 border-dashed border-white/[0.08]">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Analyzing Letter Architecture</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Evaluating spelling, reading ease complexity, stylistic identifiers, and checking signature AI patterns...</p>
                    </div>
                  ) : atsResult ? (
                    <div className="rounded-xl glass-panel p-6 space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                      
                      {/* Score Metrics Header */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Overall Score */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider font-bold block mb-1">ATS Match Score</span>
                          <div className="inline-flex items-center justify-center relative">
                            <span className="text-3xl font-black text-white">{atsResult.score}</span>
                            <span className="text-[10px] text-slate-500 ml-0.5">/100</span>
                          </div>
                          {/* Progress bar under score */}
                          <div className="w-full bg-slate-900 rounded-full h-1 mt-3 overflow-hidden">
                            <div 
                              className={`h-1 rounded-full ${
                                atsResult.score >= 80 ? "bg-green-500" : atsResult.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${atsResult.score}%` }}
                            />
                          </div>
                        </div>

                        {/* Document Categorization */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-center">
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider font-bold block mb-1 text-center sm:text-left">Letter Type</span>
                          <span className="text-sm font-bold text-white block text-center sm:text-left truncate">{atsResult.type || "General Letter"}</span>
                          
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider font-bold block mt-3 mb-1 text-center sm:text-left">Readability</span>
                          <span className="text-xs font-semibold text-blue-400 block text-center sm:text-left">{atsResult.readability || "Standard"}</span>
                        </div>

                        {/* Tone Analysis */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-center">
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider font-bold block mb-1 text-center sm:text-left">Dominant Tone</span>
                          <span className="text-sm font-bold text-white block text-center sm:text-left truncate">{atsResult.tone || "Neutral"}</span>
                          
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider font-bold block mt-3 mb-1 text-center sm:text-left">Author Classification</span>
                          <span className={`text-xs font-semibold block text-center sm:text-left ${
                            atsResult.humanProbability >= 60 ? "text-green-500" : atsResult.humanProbability >= 40 ? "text-yellow-500" : "text-blue-500"
                          }`}>
                            {atsResult.humanProbability >= 50 ? "Likely Human" : "Likely AI"}
                          </span>
                        </div>
                      </div>

                      {/* Human vs AI Probability Chart */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI vs Human Source Probability</h4>
                        
                        <div className="grid grid-cols-2 gap-6">
                          {/* Human probability bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-green-500">Human Content</span>
                              <span className="text-white">{atsResult.humanProbability || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${atsResult.humanProbability || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* AI probability bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-indigo-400">AI Generated</span>
                              <span className="text-white">{atsResult.aiProbability || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${atsResult.aiProbability || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Analysis Explanation */}
                      {atsResult.analysisText && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analysis Overview</h4>
                          <p className="text-xs text-slate-300 leading-relaxed bg-[#070a11] p-4 border border-white/[0.04] rounded-xl font-sans">
                            {atsResult.analysisText}
                          </p>
                        </div>
                      )}

                      {/* Specific Improvement Suggestions */}
                      {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Improvement Recommendations</h4>
                          <ul className="space-y-2.5">
                            {atsResult.suggestions.map((suggestion: string, idx: number) => (
                              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl glass-panel p-12 text-center space-y-4 border-dashed border-white/[0.08]">
                      <FileCheck className="w-10 h-10 text-slate-500 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Analysis Card Awaiting Data</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                        Insert your letter content in the panel on the left and run analysis to evaluate your document compatibility metrics.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TYPE CONVERSION */}
          {activeTab === "convert" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-white/[0.08] bg-gradient-to-r from-blue-950/20 via-slate-900/30 to-indigo-950/20">
                <div className="relative z-10 max-w-xl">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                    Type Conversion & Re-writing
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    Upload your current letter in PDF format (or paste it manually), then transform it into the style you want—ranging from a serious CV application to an intimate romantic letter.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Input upload & configuration */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl glass-panel p-6 space-y-5">
                    {/* PDF/TXT Upload Area */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Current Letter (PDF or TXT)</label>
                      <div className="border border-dashed border-white/[0.08] hover:border-blue-500/30 rounded-xl p-6 bg-[#070a11]/40 text-center relative cursor-pointer hover:bg-[#070a11]/70 transition-all group">
                        <input
                          type="file"
                          accept=".pdf,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setUploadedFile(file);
                            if (file) {
                              toast.success(`Loaded file: ${file.name}`);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="w-8 h-8 text-slate-500 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                        {uploadedFile ? (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-400">{uploadedFile.name}</p>
                            <p className="text-[9px] text-slate-550">{(uploadedFile.size / 1024).toFixed(1)} KB • Click to replace file</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setUploadedFile(null);
                              }}
                              className="mt-2 text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/25 transition-all inline-block"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold text-slate-300">Click or drag & drop to upload</p>
                            <p className="text-[9px] text-slate-500 mt-1">Supports PDF or TXT up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-white/[0.05]"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-slate-550 font-bold uppercase tracking-widest">Or Paste Text Manually</span>
                      <div className="flex-grow border-t border-white/[0.05]"></div>
                    </div>

                    {/* Manual paste area */}
                    <div className="space-y-1.5">
                      <textarea
                        rows={6}
                        value={conversionText}
                        onChange={(e) => setConversionText(e.target.value)}
                        placeholder="Paste your cover letter text manually if you do not have a PDF document available to upload..."
                        className="w-full bg-[#070a11] border border-white/[0.08] rounded-xl p-3.5 text-xs font-sans text-slate-300 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed resize-none"
                      />
                    </div>

                    {/* Conversion Type Select */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Format / Style</label>
                      <select
                        value={targetType}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="Romantic Letter">Romantic Letter (Personal, warm, loving)</option>
                        <option value="Serious CV Application">Serious CV Application (Highly professional, formal, impact-oriented)</option>
                        <option value="Casual Letter">Casual Letter (Relaxed, conversational, friendly)</option>
                        <option value="Academic Inquiry">Academic Inquiry (Intellectual, structured, respectful)</option>
                        <option value="Creative Narrative">Creative Narrative (Expressive, poetic, engaging)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleConvert}
                      disabled={isConverting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 disabled:opacity-50 glow-btn"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Re-writing Letter...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Convert Letter Format</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Output result */}
                <div className="lg:col-span-7">
                  {isConverting ? (
                    <div className="rounded-xl glass-panel p-12 text-center space-y-4 border-dashed border-white/[0.08]">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Converting Document Style</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Re-writing introduction, adjusting syntactic structures, selecting custom vocabulary metrics, and formatting outputs...</p>
                    </div>
                  ) : convertedOutput ? (
                    <div className="rounded-xl glass-panel p-6 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                      
                      <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Converted Result</h4>
                          <p className="text-[10px] text-slate-450 mt-0.5">Style target: <span className="text-blue-400 font-semibold">{targetType}</span></p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyToClipboard(convertedOutput)}
                            className="py-1.5 px-3 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center space-x-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg bg-[#070a11] border border-white/[0.05] p-6 shadow-inner max-h-[500px] overflow-y-auto text-xs leading-relaxed text-slate-300 font-sans whitespace-pre-wrap select-text">
                        {convertedOutput}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl glass-panel p-12 text-center space-y-4 border-dashed border-white/[0.08]">
                      <RefreshCw className="w-10 h-10 text-slate-500 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Converted Preview Awaiting Output</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                        Upload your letter or paste the source text on the left, select your target style, and run the converter to view results.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-[#090d16] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 bg-slate-950/20 shrink-0">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Draft Tailored Cover Letter</span>
                </span>
                <button
                  onClick={() => {
                    setCreateModalOpen(false);
                    reset();
                    setGeneratedResult("");
                    setTypingText("");
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Input fields */}
                <div className="lg:col-span-5 space-y-4">
                  <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Document Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Tesla Frontend application"
                        {...register("title")}
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      {errors.title && <p className="text-[10px] text-red-400 mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Position *</label>
                        <input
                          type="text"
                          placeholder="e.g. React Developer"
                          {...register("position")}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {errors.position && <p className="text-[10px] text-red-400 mt-1">{errors.position.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Company *</label>
                        <input
                          type="text"
                          placeholder="e.g. Tesla"
                          {...register("company")}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {errors.company && <p className="text-[10px] text-red-400 mt-1">{errors.company.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tone of Voice</label>
                      <select
                        {...register("tone")}
                        className="w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Enthusiastic">Enthusiastic</option>
                        <option value="Concise">Concise</option>
                        <option value="Confident">Confident</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Job Description (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Paste core deliverables to align keywords..."
                        {...register("jobDescription")}
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Your Resume Context (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Paste achievements or metrics..."
                        {...register("resumeText")}
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-500/20 disabled:opacity-50 glow-btn"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Cover Letter...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Cover Letter</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Generation Preview */}
                <div className="lg:col-span-7 flex flex-col border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-6 lg:pt-0 lg:pl-6">
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Live Document Preview</span>
                    <div className="flex-1 rounded-xl bg-slate-950 border border-white/[0.06] p-6 text-xs text-slate-300 font-mono overflow-y-auto max-h-[360px] whitespace-pre-wrap select-text leading-relaxed">
                      {typingText ? (
                        <>
                          {typingText}
                          <div className="w-1.5 h-3.5 bg-blue-500 inline-block animate-pulse ml-0.5" />
                        </>
                      ) : (
                        <p className="text-slate-550 italic text-center pt-24 font-sans">
                          Click "Generate Cover Letter" to view typing animations. You can edit the text afterwards.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Save Draft/Generate options */}
                  <div className="flex items-center space-x-3 mt-4 justify-end shrink-0">
                    <button
                      onClick={() => saveNewCoverLetter("Draft")}
                      disabled={!typingText && !generatedResult}
                      className="py-2 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-white transition-colors disabled:opacity-40"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={() => saveNewCoverLetter("Generated")}
                      disabled={!typingText && !generatedResult}
                      className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/10 disabled:opacity-40 glow-btn"
                    >
                      Save & Complete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl bg-[#090d16] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 bg-slate-950/20 shrink-0">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Edit Cover Letter Details
                </span>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Document Title *</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Position *</label>
                    <input
                      type="text"
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Company *</label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Generated">Generated</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Cover Letter Content *</label>
                  <textarea
                    rows={12}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-[#070a11] border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-slate-350 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="h-14 border-t border-white/[0.06] flex items-center justify-end px-6 bg-slate-950/20 shrink-0 space-x-3">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/10 glow-btn"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090d16] border border-white/[0.08] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600" />
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-red-500" />
                <span>Delete Cover Letter?</span>
              </h3>
              <p className="text-xs text-slate-450 mt-3 leading-relaxed">
                Are you absolutely sure you want to delete this cover letter? This action is permanent and cannot be undone in our database cache logs.
              </p>

              <div className="flex items-center space-x-3 mt-6 justify-end">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setLetterToDelete(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-white transition-colors"
                >
                  Keep Document
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-2 px-5 rounded-xl bg-red-650 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/10"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteAccountOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#090d16] border border-white/[0.08] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-650" />
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>Delete Account Permanently?</span>
              </h3>
              <p className="text-xs text-slate-450 mt-3 leading-relaxed">
                This action is irreversible. All of your cover letters, drafts, and profile data will be permanently wiped out from our databases.
              </p>

              <div className="flex items-center space-x-3 mt-6 justify-end">
                <button
                  disabled={isDeletingAccount}
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="py-2 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-white transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeletingAccount}
                  onClick={handleDeleteAccount}
                  className="py-2 px-5 rounded-xl bg-red-650 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/10 flex items-center space-x-1.5"
                >
                  {isDeletingAccount ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
