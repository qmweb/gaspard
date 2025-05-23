import { create } from 'zustand';

interface MenuState {
  currentKey: string;
  setCurrentKey: (key: string) => void;
}

const useMenuStore = create<MenuState>((set) => ({
  currentKey: 'dashboard',
  setCurrentKey: (key) => set({ currentKey: String(key) }),
}));

export default useMenuStore;
