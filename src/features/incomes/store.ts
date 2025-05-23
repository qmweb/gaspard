import { create } from 'zustand';

import { FeatureState } from './types';

export const useFeatureStore = create<FeatureState>((set) => ({
  data: '',
  setData: (data: string) => set({ data }),
}));
