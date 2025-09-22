export interface Hazard {
  id?: string;
  type: 'closure' | 'rockslide' | 'flood' | 'ice' | 'snow' | 'other';
  description: string;
  location: {
    district: string;
    village: string;
  };
  severity: 'low' | 'medium' | 'high';
  source: 'weather' | 'official' | 'crowd';
  timestamp?: string;
  photoUrl?: string;
}
