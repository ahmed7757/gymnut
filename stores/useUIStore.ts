import { create } from "zustand";

interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true, // Default open on desktop often
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
    openSidebar: () => set({ isSidebarOpen: true }),
}));
