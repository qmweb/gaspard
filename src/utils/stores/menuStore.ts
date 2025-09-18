import { create } from 'zustand';

import { MENU } from '@/utils/constants/menu';
import { MenuState } from '@/utils/types/main.interface';

const useMenuStore = create<MenuState>((set) => ({
  currentKey: MENU.DASHBOARD.key,
  estimateId: undefined,
  setCurrentKey: (key, estimateId) =>
    set({ currentKey: String(key), estimateId }),
}));

export default useMenuStore;
