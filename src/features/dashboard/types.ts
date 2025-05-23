// Example: Types for feature-name
export interface Feature {
  id: string;
  name: string;
}

export interface FeatureState {
  data: string;
  setData: (data: string) => void;
}
