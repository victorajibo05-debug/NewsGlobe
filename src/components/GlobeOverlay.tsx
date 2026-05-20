import React, { useState } from "react";
import type { GlobeMarker } from "./types/types"


interface GlobeOverlayProps {
  markers: GlobeMarker[];
  onCountrySearch: (countryCode: string) => void;
}

export function GlobeOverlay({ markers, onCountrySearch }: GlobeOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredMarkers = markers.filter(marker =>
    marker.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleCountrySelect = (countryCode: string, countryName: string) => {
    onCountrySearch(countryCode);
    setSearchQuery(countryName);
    setShowDropdown(false);
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '280px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '28px',
    color: '#0047AB',
    letterSpacing: '0px',
    textShadow: '0 0 20px rgba(0,71,171,0.5)',
  };

  const searchWrapperStyle: React.CSSProperties = {
    position: 'relative',
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 36px 10px 14px',
    backgroundColor: 'rgba(0,0,0,0.75)',
    border: '1px solid #0047AB',
    borderRadius: '8px',
    color: '#ffffff',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '1px',
    backdropFilter: 'blur(8px)',
  };

  const clearButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
    lineHeight: 1,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    border: '1px solid #0047AB',
    borderRadius: '8px',
    zIndex: 999,
    maxHeight: '220px',
    overflowY: 'auto',
    marginTop: '4px',
    backdropFilter: 'blur(8px)',
  };

  const dropdownItemStyle = (hovered: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '14px',
    letterSpacing: '1px',
    color: hovered ? '#0047AB' : '#ffffff',
    backgroundColor: hovered ? 'rgba(0,71,171,0.15)' : 'transparent',
    borderBottom: '1px solid #222',
  });

  return (
    <div style={containerStyle}>

      {/* Header */}
      <div style={headerStyle}>
         NEWSGLOBE
         <img
        src= "src/assets/Globe.jpg"
        alt= 'Globe Icon'
        style={{ width: '40px', height: '40px' }}>
        </img>
      </div>

      {/* Search */}
      <div style={searchWrapperStyle}>
        <input
          style={searchInputStyle}
          type="text"
          placeholder="SEARCH COUNTRY..."
          value={searchQuery}
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        {/* Clear button */}
        {searchQuery.length > 0 && (
          <button
            style={clearButtonStyle}
            onMouseDown={() => {
              setSearchQuery("");
              setShowDropdown(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && filteredMarkers.length > 0 && (
          <div style={dropdownStyle}>
            {filteredMarkers.map((marker, i) => (
              <div
                key={marker.countryCode}
                style={dropdownItemStyle(hoveredIndex === i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseDown={() => handleCountrySelect(marker.countryCode, marker.country)}
              >
                {marker.label} {marker.country}
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {showDropdown && filteredMarkers.length === 0 && (
          <div style={dropdownStyle}>
            <div style={{
              padding: '10px 14px',
              color: '#888',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '14px',
            }}>
              No countries found
            </div>
          </div>
        )}
      </div>

    </div>
  );
}