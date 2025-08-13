export interface MenuState {
  currentKey: string;
  estimateId?: string;
  setCurrentKey: (key: string, estimateId?: string) => void;
}
