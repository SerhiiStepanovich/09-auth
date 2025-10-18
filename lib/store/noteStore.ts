import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Draft {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

interface NoteStore {
  draft: Draft;
  setDraft: (draftUpdate: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draftUpdate: Partial<Draft>) =>
        set((state) => ({
          draft: { ...state.draft, ...draftUpdate },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
