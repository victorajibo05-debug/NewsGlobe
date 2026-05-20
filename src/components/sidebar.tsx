import type { bar } from "./types/types";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredDropdownIndex, setHoveredDropdownIndex] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Called when user starts dragging the handle
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleCountrySelect = (countryCode: string, countryName: string) => {
    sidebar.onCountrySearch(countryCode);
    setSearchQuery(countryName);
    setShowDropdown(false);
  };

   const filteredMarkers = sidebar.markers.filter(marker =>
    marker.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#111111',
    padding: '8px 32px 8px 12px',
    border: '1px solid #0047AB',
    borderRadius: '6px',
    color: '#ffffff',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '1px',
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: '20px',
  };


  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#111111',
    border: '1px solid #0047AB',
    borderRadius: '6px',
    zIndex: 999,
    maxHeight: '200px',
    overflowY: 'auto',
    marginTop: '4px',
  };

  const dropdownItemStyle = (hovered: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '14px',
    letterSpacing: '1px',
    color: hovered ? '#0047AB' : '#ffffff',
    backgroundColor: hovered ? '#1a1a1a' : 'transparent',
    borderBottom: '1px solid #222',
  });

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

      <div style={searchContainerStyle}>
        <input
          style={searchInputStyle}
          type="text"
          placeholder="SEARCH COUNTRY..."
          value={searchQuery}
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        {searchQuery.length > 0 && (
      <button
        onMouseDown={() => {
          setSearchQuery("");
          setShowDropdown(false);
        }}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          lineHeight: 1,
          fontFamily: 'sans-serif',
        }}
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
  
      
         {showDropdown && filteredMarkers.length > 0 && (
          <div style={dropdownStyle}>
            {filteredMarkers.map((marker, i) => (
              <div
                key={marker.countryCode}
                style={dropdownItemStyle(hoveredDropdownIndex === i)}
                onMouseEnter={() => setHoveredDropdownIndex(i)}
                onMouseLeave={() => setHoveredDropdownIndex(null)}
                onMouseDown={() => handleCountrySelect(marker.countryCode, marker.country)}
              >
                {marker.label} {marker.country}
              </div>
            ))}
          </div>
        )}

        

        {showDropdown && filteredMarkers.length === 0 && (
          <div style={dropdownStyle}>
            <div style={{ padding: '8px 12px', color: '#888', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px' }}>
              No countries found
            </div>
          </div>
        )}
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