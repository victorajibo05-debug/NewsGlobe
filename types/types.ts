export interface bar {
  variant: 'floating' | 'static';
  isOpen: boolean;
  onToggle: () => void;
  side: "left";
  items: items[];
  countryName: string | null;
  loading: boolean;
  error: string | null;
  markers: GlobeMarker[];
  onCountrySearch: (countryCode: string, countryName: string) => void;       
    
}

export interface items {
  article_id: string;
  title: string;
  countryCode: string;
  onClick: () => void;
}


export interface card {
  title: string;
  description: string | null;
  onClose: () => void;
}
export interface GlobeMarker {
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
  label: string;
  size: number;
  color: string;
}