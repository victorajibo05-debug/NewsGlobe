// @ts-nocheck
import { useEffect, useRef } from 'react';
import type { GlobeMarker } from 'types/types';

interface Props {
  markers?: GlobeMarker[];
  onMarkerClick?: (m: GlobeMarker) => void;
  globeImageUrl?: string;
  height?: string | number;
  width?: string | number;
  activeCountryCode?: string;
}

export default function GlobeComponent({
  markers = [],
  onMarkerClick,
  globeImageUrl,
  height = '100vh',
  width = '100%',
  activeCountryCode
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    
    const existingScript = document.getElementById('globe-gl-script');

    const initGlobe = () => {
      if (!containerRef.current) return;

      setTimeout(() => {
      if (!containerRef.current) return

      try {
        const Globe = (window as any).Globe;
        if (!Globe) {
          console.error('Globe not found on window');
          return;
        }

        const g = (Globe()(containerRef.current)as any)
          .globeImageUrl(
            globeImageUrl || 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
          )
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0)
          .pointsData(markers)
          .pointLat((d: any) => d.lat)
          .pointLng((d: any) => d.lng)
          .pointAltitude((d: any) => (d.magnitude ?? 1) * 0.01)
          .pointColor((d: any) => d.color || 'orange')
          .pointRadius((d: any) => d.countryCode === activeCountryCode ? 0.7 : 0.4)
          .onPointClick((d: any) => onMarkerClick && onMarkerClick(d))
          .pointLabel((d: any) => `
    <div style="
      background: rgba(0,0,0,0.75);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 18px;
      font-family: Bebas Neue, sans-serif;
      letter-spacing: 1px;
      border: 1px solid #0047AB;
      pointer-events: none;
    ">${d.country}</div>
  `)
        globeRef.current = g;

      } catch (err) {
        console.error('Failed to init globe', err);
        if (containerRef.current) {
          containerRef.current.textContent = 'Globe failed to load';
          containerRef.current.style.color = '#ffffff';
          containerRef.current.style.display = 'flex';
          containerRef.current.style.alignItems = 'center';
          containerRef.current.style.justifyContent = 'center';
        }
      }
    }, 1000)
    };

    if (existingScript) {
      // Script already loaded
      initGlobe();
    } else {
      // Inject script tag
      const script = document.createElement('script');
      script.id = 'globe-gl-script';
      script.src = 'https://unpkg.com/globe.gl/dist/globe.gl.min.js';
      script.onload = initGlobe;
      script.onerror = () => {
        console.error('Failed to load globe.gl script');
        if (containerRef.current) {
          containerRef.current.textContent = 'Globe failed to load';
          containerRef.current.style.color = '#ffffff';
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      if (globeRef.current?.pauseAnimation) globeRef.current.pauseAnimation();
    };
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      (globeRef.current as any)
        .pointsData(markers)
        .pointColor((d: any) => d.color || 'orange')
        .pointRadius((d: any) => d.countryCode === activeCountryCode ? 0.7 : 0.4)
        .onPointClick((d: any) => onMarkerClick && onMarkerClick(d))
        .pointLabel((d: any) => `
    <div style="
      background: rgba(0,0,0,0.75);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 18px;
      font-family: Bebas Neue, sans-serif;
      letter-spacing: 1px;
      border: 1px solid #0047AB;
      pointer-events: none;
    ">${d.country}</div>
  `)
    }
  }, [markers, activeCountryCode]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, display: 'block' }}
      aria-hidden={false}
    />
  );
}