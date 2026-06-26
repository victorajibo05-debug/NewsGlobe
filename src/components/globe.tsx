// @ts-nocheck
import { useEffect, useRef } from 'react';
import type { GlobeMarker } from '../types/types';

interface Props {
  markers?: GlobeMarker[];
  onMarkerClick?: (m: GlobeMarker) => void;
  globeImageUrl?: string;
  height?: string | number;
  width?: string | number;
  activeCountryCode?: string;
  showLabels?: boolean;
}

export default function GlobeComponent({
  markers = [],
  onMarkerClick,
  globeImageUrl,
  height = '100vh',
  width = '100%',
  activeCountryCode,
  showLabels = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);

  // Builds a dot + permanent label for each marker
  const createMarkerElement = (d: any) => {
    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    el.style.cursor = 'pointer';
    el.style.pointerEvents = 'auto';

    const isActive = d.countryCode === activeCountryCode;

    el.innerHTML = `
      <div style="
        width: ${isActive ? '14px' : '10px'};
        height: ${isActive ? '14px' : '10px'};
        background: ${isActive ? '#ffffff' : (d.color || 'orange')};
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 6px ${d.color || 'orange'};
      "></div>
      <div style="
        margin-top: 4px;
        background: rgba(0,0,0,0.7);
        color: #ffffff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: ${showLabels ? '10px' : '11px'};
        font-family: Bebas Neue, sans-serif;
        letter-spacing: 0.5px;
        white-space: nowrap;
        pointer-events: none;
      ">${d.country}</div>
    `;

    el.onclick = () => onMarkerClick && onMarkerClick(d);

    return el;
  };

  useEffect(() => {
    const existingScript = document.getElementById('globe-gl-script');

    const initGlobe = () => {
      if (!containerRef.current) return;

      setTimeout(() => {
        if (!containerRef.current) return;

        try {
          const Globe = (window as any).Globe;
          if (!Globe) {
            console.error('Globe not found on window');
            return;
          }

          const chain = (Globe()(containerRef.current) as any)
            .globeImageUrl(
              globeImageUrl || 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
            )
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0)
            .htmlElementsData(markers)
            .htmlLat((d: any) => d.lat)
            .htmlLng((d: any) => d.lng)
            .htmlAltitude(0.01)
            .htmlElement(createMarkerElement);

          globeRef.current = chain;

          // Explicitly enable zoom on the orbit controls — globe.gl doesn't
          // always turn this on by default once a parent has overflow:hidden.
          const controls = chain.controls();
          if (controls) {
            controls.enableZoom = true;
            controls.minDistance = 150;   // closest you can zoom in
            controls.maxDistance = 800;   // farthest you can zoom out
            controls.zoomSpeed = 0.8;
            controls.enableDamping = true;
          }

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
      }, 500);
    };

    if (existingScript) {
      initGlobe();
    } else {
      const script = document.createElement('script');
      script.id = 'globe-gl-script';
      script.src = 'https://unpkg.com/globe.gl/dist/globe.gl.min.js';
      script.onload = initGlobe;
      script.onerror = () => {
        console.error('Failed to load globe.gl script');
        if (containerRef.current) {
          containerRef.current.textContent = 'Globe failed to load';
          containerRef.current.style.color = '#ffffff';
          containerRef.current.style.display = 'flex';
          containerRef.current.style.alignItems = 'center';
          containerRef.current.style.justifyContent = 'center';
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      if (globeRef.current?.pauseAnimation) globeRef.current.pauseAnimation();
    };
  }, []);

  // Keeps labels and highlighting in sync when markers/activeCountryCode change
  useEffect(() => {
    if (globeRef.current) {
      (globeRef.current as any)
        .htmlElementsData(markers)
        .htmlElement(createMarkerElement);
    }
  }, [markers, activeCountryCode, showLabels]);

  return (
    <div
      ref={containerRef}
      style={{ width, height, display: 'block', touchAction: 'none' }}
      aria-hidden={false}
    />
  );
}