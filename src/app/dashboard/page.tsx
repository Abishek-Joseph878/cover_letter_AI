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
  X,
  FileDown,
  Copy,
  Layout,
  User,
  Info,
  CheckCircle,
  HelpCircle,
  Loader2
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
    <div className="min-h-screen bg-[#090d16] text-white flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/[0.06] bg-slate-950/40 flex flex-col justify-between shrink-0">
        <div>
          {/* Header brand */}
          <div className="h-16 border-b border-white/[0.06] flex items-center px-6 space-x-2.5">
            <div className="w-7.5 h-7.5 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">CoverLetterAI</span>
          </div>

          {/* New Letter Button */}
          <div className="p-4">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-1.5 glow-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Letter</span>
            </button>
          </div>

          {/* Tabs */}
          <nav className="px-3 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Layout },
              { id: "coverletters", label: "Cover Letters", icon: FileText },
              { id: "templates", label: "Templates", icon: FolderOpen },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full py-2.5 px-4.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/10"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile */}
        <div className="p-4 border-t border-white/[0.06] bg-slate-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 max-w-[140px]">
              <div className="w-8.5 h-8.5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{session.user?.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-xl text-slate-450 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 bg-slate-950/20 shrink-0">
          <h2 className="text-sm font-bold text-white capitalize">{activeTab} Panel</h2>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] py-1 px-2.5 rounded-full bg-green-500/10 text-green-500 font-semibold border border-green-500/20">
              Active Session
            </span>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
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
                    <div key={i} className="p-5 rounded-xl glass-panel relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                        <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Chart and Recent activity grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SVG Chart */}
                <div className="lg:col-span-8 p-6 rounded-xl glass-panel">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Generations Frequency</h4>
                      <p className="text-lg font-bold text-white mt-0.5">Application Progress</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 py-0.5 px-2 rounded">Weekly Logs</span>
                  </div>

                  <div className="h-48 w-full relative">
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

                {/* Recent Activity feed */}
                <div className="lg:col-span-4 p-6 rounded-xl glass-panel flex flex-col">
                  <div className="flex items-center space-x-1.5 border-b border-white/[0.06] pb-3 mb-4">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Activity Feed</h3>
                  </div>

                  <div className="flex-1 space-y-4 max-h-[200px] overflow-y-auto pr-1">
                    {coverLetters.length === 0 ? (
                      <p className="text-xs text-slate-500 italic mt-4 text-center">No recent activities.</p>
                    ) : (
                      coverLetters.slice(0, 4).map((letter, index) => (
                        <div key={index} className="flex items-start space-x-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-300 font-medium truncate">
                              Generated letter for <strong className="text-white">{letter.company}</strong> ({letter.position})
                            </p>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              {new Date(letter.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Cover Letters Table */}
              <div className="p-6 rounded-xl glass-panel">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Cover Letters</h3>
                  <button
                    onClick={() => setActiveTab("coverletters")}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    View All
                  </button>
                </div>

                {coverLetters.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/[0.06] rounded-lg">
                    <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-xs font-bold text-white">No cover letters generated yet</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">Create a tailored document to see it appear in this dashboard.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-slate-500 font-bold uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Document Title</th>
                          <th className="pb-3 font-semibold">Company</th>
                          <th className="pb-3 font-semibold">Position</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-350">
                        {coverLetters.slice(0, 4).map((letter) => (
                          <tr key={letter._id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => {
                            setSelectedLetter(letter);
                            setActiveTab("coverletters");
                          }}>
                            <td className="py-3.5 font-bold text-white">{letter.title}</td>
                            <td className="py-3.5">{letter.company}</td>
                            <td className="py-3.5">{letter.position}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                letter.status === "Draft"
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  : letter.status === "Archived"
                                  ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                  : "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                              }`}>
                                {letter.status}
                              </span>
                            </td>
                            <td className="py-3.5">{new Date(letter.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            <div className="max-w-xl rounded-xl glass-panel p-6">
              <h3 className="text-base font-bold text-white mb-6 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-500" />
                <span>Account Profile</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center space-x-2">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span className="font-semibold text-[11px]">MongoDB Atlas Connection Active</span>
                  </div>
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
    </div>
  );
}
