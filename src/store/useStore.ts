import { create } from "zustand";

export interface CoverLetter {
  _id: string;
  userId: string;
  title: string;
  position: string;
  company: string;
  jobDescription?: string;
  resumeText?: string;
  content: string;
  status: "Draft" | "Generated" | "Archived";
  tone?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardState {
  activeTab: string;
  selectedLetter: CoverLetter | null;
  coverLetters: CoverLetter[];
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLoadingLetters: boolean;
  
  setActiveTab: (tab: string) => void;
  setSelectedLetter: (letter: CoverLetter | null) => void;
  setCoverLetters: (letters: CoverLetter[]) => void;
  addCoverLetter: (letter: CoverLetter) => void;
  updateCoverLetter: (letter: CoverLetter) => void;
  deleteCoverLetter: (id: string) => void;
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setLoadingLetters: (loading: boolean) => void;
}

export const useStore = create<DashboardState>((set) => ({
  activeTab: "dashboard",
  selectedLetter: null,
  coverLetters: [],
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isLoadingLetters: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedLetter: (letter) => set({ selectedLetter: letter }),
  setCoverLetters: (letters) => set({ coverLetters: letters }),
  addCoverLetter: (letter) =>
    set((state) => ({ coverLetters: [letter, ...state.coverLetters] })),
  updateCoverLetter: (letter) =>
    set((state) => ({
      coverLetters: state.coverLetters.map((l) => (l._id === letter._id ? letter : l)),
      selectedLetter: state.selectedLetter?._id === letter._id ? letter : state.selectedLetter,
    })),
  deleteCoverLetter: (id) =>
    set((state) => ({
      coverLetters: state.coverLetters.filter((l) => l._id !== id),
      selectedLetter: state.selectedLetter?._id === id ? null : state.selectedLetter,
    })),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setEditModalOpen: (open) => set({ isEditModalOpen: open }),
  setDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
  setLoadingLetters: (loading) => set({ isLoadingLetters: loading }),
}));
export default useStore;
