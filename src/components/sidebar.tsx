import type { bar } from 'types/types';
import '@fontsource/bebas-neue';
import { Pointer } from "./pointer";
import React, { useState, useRef, useCallback } from "react";

interface props {
  sidebar: bar;
}

export function Sidebar({ sidebar }: props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Called when user starts dragging the handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.min(600, Math.max(200, startWidth + delta));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#000000',
    width: sidebarWidth,       
    height: '100vh',
    border: '1px solid #444',
    boxSizing: 'border-box',
    overflowY: 'auto',
    padding: '20px',
    position: 'relative',      
    flexShrink: 0,
    transition: isDragging ? 'none' : 'width 0.1s ease', 
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '5px',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: 'Bebas Neue, sans-serif',
    color: '#0047AB',
    marginBottom: '35px',
  };

  const dragHandleStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '5px',
    height: '100%',
    cursor: 'col-resize',
    backgroundColor: isDragging ? '#0047AB' : 'transparent',
    transition: 'background-color 0.2s ease',
    zIndex: 10,
  };

  const itemStyle = (i: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: hoveredIndex === i ? '#0047AB' : '#ffffff',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222222',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: sidebarWidth < 250 ? '12px' : '24px', 
    lineHeight: '1.5',
    wordBreak: 'break-word',  
  });

  if (!sidebar.items || sidebar.items.length === 0) {
    return (
      <div style={containerStyle} ref={sidebarRef}>
    
        <div style={dragHandleStyle} onMouseDown={handleMouseDown} />
        <div style={headerStyle}>NewsGlobe <img
        src= "src/assets/Globe.jpg"
        alt= 'Globe Icon'
        style={{ width: '50px', height: '50px' }}>
        </img></div>
        <h5 style={{ fontSize: '18px', fontFamily: 'Bebas Neue, sans-serif', color: '#ffffff' }}>
          Click a marker to load headlines
        </h5>
      </div>
    );
  }

  return (
    <div style={containerStyle} ref={sidebarRef}>

      
      <div
        style={dragHandleStyle}
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      />

     
      <div style={headerStyle}>NewsGlobe
        <img
        src= "src/assets/Globe.jpg"
        alt= 'Globe Icon'
        style={{ width: '50px', height: '50px' }}>
        </img>
      </div>
      <div style={{fontSize: '24px', fontFamily: 'Bebas Neue, sans-serif', color: '#ffffff', marginBottom: '30px' }}>
        {sidebar.countryName ? `Top headlines in ${sidebar.countryName}` : 'Click a marker to load headlines'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sidebar.items.map((it, i) => (
          <div
            key={it.article_id}
            onClick={it.onClick}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={itemStyle(i)}
          >
            <Pointer />
            <div style={{ flex: 1 }}>{it.title}</div>
          </div>
        ))}
      </div>

    </div>
  );
}