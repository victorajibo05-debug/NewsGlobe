import React, { useState, useCallback } from "react";
import '@fontsource/bebas-neue';
import { Pointer } from "./pointer";
import { NewsCard } from "./newsCard";

interface BottomSheetItem {
  article_id: string;
  title: string;
  description: string | null
  onClick: () => void;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string | null;
  items: BottomSheetItem[];
  loading: boolean;
  error: string | null;
}

export function BottomSheet({
  isOpen,
  onClose,
  countryName,
  items,
  loading,
  error,
}: BottomSheetProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; description: string | null } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY === null) return;
    const delta = e.touches[0].clientY - startY;
    if (delta > 0) setDragOffset(delta);
  }, [startY]);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 100) onClose();
    setDragOffset(0);
    setStartY(null);
    setIsDragging(false);
  }, [dragOffset, onClose]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
  };

  const sheetStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75vh',
    backgroundColor: '#000000',
    borderTop: '2px solid #0047AB',
    borderRadius: '16px 16px 0 0',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    transform: isOpen ? `translateY(${dragOffset}px)` : 'translateY(100%)',
    transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
    overflowY: 'auto',
    padding: '0 20px 20px 20px',
  };

  const dragHandleStyle: React.CSSProperties = {
    width: '40px',
    height: '4px',
    backgroundColor: '#444',
    borderRadius: '2px',
    margin: '12px auto 8px auto',
    flexShrink: 0,
    cursor: 'grab',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    paddingBottom: '16px',
    borderBottom: '1px solid #222',
    marginBottom: '16px',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    backgroundColor: '#000000',
    zIndex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '20px',
    color: '#0047AB',
    letterSpacing: '1px',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const itemStyle = (i: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    color: hoveredIndex === i ? '#0047AB' : '#ffffff',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222222',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: '15px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  });

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} onClick={onClose} />

      {/* Sheet */}
      <div
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div style={dragHandleStyle} />

        {/* Header */}
        <div style={headerStyle}>
          <span style={titleStyle}>
            {countryName ? countryName.toUpperCase() : 'HEADLINES'}
          </span>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ color: '#888', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px' }}>
            Loading...
          </p>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: '#EF4444', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px' }}>
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <p style={{ color: '#888', fontFamily: 'Bebas Neue, sans-serif', fontSize: '14px' }}>
            No headlines found.
          </p>
        )}

        {/* Headlines — onClick sets selectedArticle internally */}
        <div style={{ flex: 1 }}>
          {items.map((item, i) => (
            <div
              key={item.article_id}
              onClick={() => {
                // Find the article data from items and show card
                setSelectedArticle({ title: item.title, description: item.description });
                item.onClick(); // still fires the original onClick for App.tsx state
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={itemStyle(i)}
            >
              <Pointer />
              <div style={{ flex: 1 }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NewsCard renders here — inside BottomSheet, above it with zIndex 600 */}
      {selectedArticle && (
        <NewsCard
          card={{
            title: selectedArticle.title,
            description: selectedArticle.description,
            onClose: () => setSelectedArticle(null),
          }}
        />
      )}
    </>
  );
}