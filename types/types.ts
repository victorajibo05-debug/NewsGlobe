export interface bar {
  variant: 'floating' | 'static';
  isOpen: boolean;
  onToggle: () => void;
  side: "left";
  items: items[];
  countryName: string | null;
  loading: boolean;
  error: string | null;
}

export interface items {
  article_id: string;
  title: string;
  countryCode: string;
  onClick: () => void;
}


export interface card {
  title: string;
  content: string | null;
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