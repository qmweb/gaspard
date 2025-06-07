import { create } from 'zustand';

import { MENU } from '@/utils/constants/menu';
import { MenuState } from '@/utils/types/main.interface';

const useMenuStore = create<MenuState>((set) => ({
  currentKey: MENU.DASHBOARD.key,
  setCurrentKey: (key) => set({ currentKey: String(key) }),
}));

export default useMenuStore;
