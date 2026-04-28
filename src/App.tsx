import { useState, useCallback, useRef, useEffect } from "react";
import GlobeComponent from './components/globe';
import {Sidebar} from "./components/sidebar";
import {NewsCard} from "./components/newsCard";
import { useFetchNews} from './hooks/useFetchnews';
import type { NewsArticle } from './hooks/useFetchnews';
import type { GlobeMarker, bar } from "types/types";

const MARKERS: GlobeMarker[] = [
  { lat: 37.09,  lng: -95.71,  country: "United States",  countryCode: "us", label: "🇺🇸 USA",          size: 2, color: "#3B82F6" },
  { lat: 51.51,  lng: -0.13,   country: "United Kingdom", countryCode: "gb", label: "🇬🇧 UK",           size: 2, color: "#8B5CF6" },
  { lat: 52.52,  lng: 13.41,   country: "Germany",        countryCode: "de", label: "🇩🇪 Germany",      size: 2, color: "#F59E0B" },
  { lat: 48.86,  lng: 2.35,    country: "France",         countryCode: "fr", label: "🇫🇷 France",       size: 2, color: "#EF4444" },
  { lat: 35.69,  lng: 139.69,  country: "Japan",          countryCode: "jp", label: "🇯🇵 Japan",        size: 2, color: "#EC4899" },
  { lat: 39.91,  lng: 116.39,  country: "China",          countryCode: "cn", label: "🇨🇳 China",        size: 2, color: "#10B981" },
  { lat: 28.61,  lng: 77.21,   country: "India",          countryCode: "in", label: "🇮🇳 India",        size: 2, color: "#F97316" },
  { lat: -14.24, lng: -51.93,  country: "Brazil",         countryCode: "br", label: "🇧🇷 Brazil",       size: 2, color: "#22C55E" },
  { lat: -25.27, lng: 133.78,  country: "Australia",      countryCode: "au", label: "🇦🇺 Australia",    size: 2, color: "#06B6D4" },
  { lat: 56.13,  lng: -106.35, country: "Canada",         countryCode: "ca", label: "🇨🇦 Canada",       size: 2, color: "#EF4444" },
  { lat: 9.08,   lng: 8.68,    country: "Nigeria",        countryCode: "ng", label: "🇳🇬 Nigeria",      size: 2, color: "#84CC16" },
  { lat: -30.56, lng: 22.94,   country: "South Africa",   countryCode: "za", label: "🇿🇦 South Africa", size: 2, color: "#FBBF24" },
  { lat: 23.42,  lng: 53.85,   country: "UAE",            countryCode: "ae", label: "🇦🇪 UAE",          size: 2, color: "#A78BFA" },
  { lat: 7.9465,  lng:1.0232,  country: "Ghana",          countryCode: "gh", label: "🇬🇭 Ghana",        size: 2, color: "#F87171" },
  { lat: 41.90,  lng: 12.45,   country: "Italy",          countryCode: "it", label: "🇮🇹 Italy",        size: 2, color: "#34D399" },
  { lat: 55.37,  lng: 10.42,   country: "Denmark",        countryCode: "dk", label: "🇩🇰 Denmark",      size: 2, color: "#3B82F6" },
  {lat: 60.17,  lng: 24.94,   country: "Finland",        countryCode: "fi", label: "🇫🇮 Finland",      size: 2, color: "#8B5CF6" },
  {lat: 59.33,  lng: 18.07,   country: "Sweden",         countryCode: "se", label: "🇸🇪 Sweden",       size: 2, color: "#F59E0B" },
  {lat: 45.75,  lng: 4.83,    country: "Switzerland",    countryCode: "ch", label: "🇨🇭 Switzerland",  size: 2, color: "#EF4444" },
  {lat: 35.68,  lng: 51.41,   country: "Iran",           countryCode: "ir", label: "🇮🇷 Iran",         size: 2, color: "#EC4899" },
  {lat: 31.95,  lng: 35.93,   country: "Israel",         countryCode: "il", label: "🇮🇱 Israel",         size: 2, color: "#EF4444" },
  {lat: 19.43,  lng: -99.13,  country: "Mexico",         countryCode: "mx", label: "🇲🇽 Mexico",       size: 2, color: "#F97316" },
  {lat: 43.90,  lng: 125.35,  country: "North Korea",    countryCode: "kp", label: "🇰🇵 North Korea",  size: 2, color: "#10B981" },
  {lat: 35.86,  lng: 104.19,  country: "China",          countryCode: "cn", label: "🇨🇳 China",        size: 2, color: "#22C55E" },
  {lat: 36.20,  lng: 138.25,  country: "Japan",          countryCode: "jp", label: "🇯🇵 Japan",        size: 2, color: "#06B6D4" },
  {lat: 55.75,  lng: 37.62,   country: "Russia",         countryCode: "ru", label: "🇷🇺 Russia",       size: 2, color: "#EF4444" },
  {lat: 1.35,   lng: 103.82,  country: "Singapore",      countryCode: "sg", label: "🇸🇬 Singapore",    size: 2, color: "#FBBF24" },
  {lat: 13.41,  lng: 103.86,  country: "Cambodia",       countryCode: "kh", label: "🇰🇭 Cambodia",     size: 2, color: "#A78BFA" },
  {lat: 14.55,  lng: 121.02,  country: "Philippines",    countryCode: "ph", label: "🇵🇭 Philippines",  size: 2, color: "#F87171" },
  {lat: 52.23,  lng: 21.01,   country: "Poland",         countryCode: "pl", label: "🇵🇱 Poland",       size: 2, color: "#34D399" },
  {lat: 50.45,  lng: 30.52,   country: "Ukraine",        countryCode: "ua", label: "🇺🇦 Ukraine",      size: 2, color: "#3B82F6" },
  {lat: 33.44,  lng: 126.98,  country: "South Korea",    countryCode: "kr", label: "🇰🇷 South Korea",  size: 2, color: "#8B5CF6" },
  {lat: 24.86,  lng: 67.01,   country: "Pakistan",       countryCode: "pk", label: "🇵🇰 Pakistan",     size: 2, color: "#F59E0B" },
  {lat:14.4974, lng:14.4524, country: 'Senegal',        countryCode: 'sn', label: "🇸🇳 Senegal",      size: 2, color: "#EF4444" },
  {lat:31.7917, lng:7.0926, country: 'Morocco',         countryCode: 'ma', label: "🇲🇦 Morocco",      size: 2, color: "#EC4899" },
  {lat: 9.3077, lng: 2.3158, country: 'Benin',           countryCode: 'bj', label: "🇧🇯 Benin",        size: 2, color: "#10B981" },
  {lat: 12.5,   lng: 13.6,    country: "Niger",          countryCode: "ne", label: "🇳🇪 Niger",        size: 2, color: "#F97316" },
  {lat: 13.19,  lng: 1.55,    country: "Togo",           countryCode: "tg", label: "🇹🇬 Togo",         size: 2, color: "#22C55E" },
  {lat: 36.77,  lng: 3.06,    country: "Algeria",        countryCode: "dz", label: "🇩🇿 Algeria",      size: 2, color: "#06B6D4" },
  {lat: 48.86,  lng: 2.35,    country: "France",         countryCode: "fr", label: "🇫🇷 France",       size: 2, color: "#EF4444" },
  {lat: 36.77,  lng: 3.06,    country: "Algeria",        countryCode: "dz", label: "🇩🇿 Algeria",      size: 2, color: "#06B6D4" },
  { lat: -38.42, lng: -63.62, country: "Argentina", countryCode: "ar", label: "🇦🇷 Argentina", size: 2, color: "#74C0FC" },
  { lat: -9.19,  lng: -75.02, country: "Peru",      countryCode: "pe", label: "🇵🇪 Peru",      size: 2, color: "#F03E3E" },
  { lat: 4.57,   lng: -74.30, country: "Colombia",  countryCode: "co", label: "🇨🇴 Colombia",  size: 2, color: "#FCC419" },
  { lat: -23.43, lng: -58.44, country: "Paraguay",  countryCode: "py", label: "🇵🇾 Paraguay",  size: 2, color: "#94D82D" },
  { lat: -32.52, lng: -55.77, country: "Uruguay",   countryCode: "uy", label: "🇺🇾 Uruguay",   size: 2, color: "#4DABF7" },
  { lat: -16.29, lng: -63.59, country: "Bolivia",   countryCode: "bo", label: "🇧🇴 Bolivia",   size: 2, color: "#FF922B" },
  { lat: -35.68, lng: -71.54, country: "Chile",     countryCode: "cl", label: "🇨🇱 Chile",     size: 2, color: "#F76707" },
  { lat: -1.83,  lng: -78.18, country: "Ecuador",   countryCode: "ec", label: "🇪🇨 Ecuador",   size: 2, color: "#2F9E44" },
  { lat: 8.00,   lng: -66.59, country: "Venezuela", countryCode: "ve", label: "🇻🇪 Venezuela",  size: 2, color: "#E64980" },
  { lat: 4.86,   lng: -58.93, country: "Guyana",    countryCode: "gy", label: "🇬🇾 Guyana",    size: 2, color: "#862E9C" },
  { lat: 3.92,   lng: -56.03, country: "Suriname",  countryCode: "sr", label: "🇸🇷 Suriname",  size: 2, color: "#1971C2" },
  
];

export default function App() {
  const { articles, loading, error, fetchNewsByCountry } = useFetchNews();

  const [activeCountryCode, setActiveCountryCode] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 });

  // Measure the main container and keep globe size in sync
  useEffect(() => {
    if (!mainRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setGlobeSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(mainRef.current);

    // Cleanup when component unmounts
    return () => observer.disconnect();
  }, []);

  const handleMarkerClick = useCallback((marker: GlobeMarker) => {
	console.log("Marker clicked:", marker);
    setActiveCountryCode(marker.countryCode);
    setSelectedArticle(null);
    setIsSidebarOpen(true);
    fetchNewsByCountry(marker.countryCode);
  }, [fetchNewsByCountry]);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const handleCardClose = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const sidebarProp: bar = {
    variant: 'static',
    isOpen: isSidebarOpen,
    onToggle: () => setIsSidebarOpen(prev => !prev),
    side: 'left',
    items: articles.map(article => ({
      article_id: article.article_id,
      title: article.title,
      countryCode: activeCountryCode ?? '',
      onClick: () => handleArticleClick(article),
    })),
    countryName: MARKERS.find(m => m.countryCode === (activeCountryCode ?? ''))?.country ?? null,
    loading,
    error,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#000"}}>

      <Sidebar sidebar={sidebarProp} />

      <main 
       ref={mainRef}
      style={{  flex: 1, position: "relative", justifyContent: 'center', overflow: "hidden", minWidth: 0  }}>
         {globeSize.width > 0 && (
        <GlobeComponent
          markers={MARKERS}
          onMarkerClick={handleMarkerClick}
          activeCountryCode={activeCountryCode ?? undefined}
          height={globeSize.height}
          width={globeSize.width}
        />
         )}

        {selectedArticle && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
           bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
          }}>
            <NewsCard card={{ 
				title: selectedArticle.title, 
				content: selectedArticle.content, 
				onClose: handleCardClose }} />
          </div>
        )}
      </main>

    </div>
  );
}