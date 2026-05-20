import React, { useState, useEffect } from "react";


interface card {
  title: string;
  description?: string | null;
  onClose: () => void;
}

interface props {
  card: card;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export function NewsCard({ card }: props) {
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  if (!isVisible) return null;

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 600,        // above bottom sheet
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    };

    const cardStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
      border: '1px solid #0047AB',
      borderRadius: '12px',
      boxSizing: 'border-box',
      width: '100%',
      maxHeight: '75vh',
      overflowY: 'auto',
      padding: '20px',
      animation: 'fadeIn 0.25s ease',
    };

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
      gap: '12px',
      position: 'sticky',
      top: 0,
      backgroundColor: '#000000',
      paddingBottom: '12px',
      borderBottom: '1px solid #222',
      zIndex: 1,
    };

    const titleStyle: React.CSSProperties = {
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'Bebas Neue, sans-serif',
      color: '#ffffff',
      lineHeight: '1.4',
      flex: 1,
    };

    const closeButtonStyle: React.CSSProperties = {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      width: '28px',
      height: '28px',
      minWidth: '28px',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    };

    return (
      <>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <div
          style={overlayStyle}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVisible(false);
              card.onClose();
            }
          }}
        >
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3 style={titleStyle}>{card.title}</h3>
              <button
                style={closeButtonStyle}
                onClick={() => { setIsVisible(false); card.onClose(); }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'Bebas Neue, sans-serif',
                lineHeight: '1.7',
                letterSpacing: '0.5px',
              }}>
                { card.description ?? 'No content available.'}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── DESKTOP ─────────────────────────────────────────────
  const newscard: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    width: '600px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#000000',
    border: '1px solid #444',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: 'Bebas Neue, sans-serif',
    color: '#ffffff',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
  };

  const contentTextStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#ffffff',
    fontWeight: 'normal',
    fontFamily: 'Bebas Neue, sans-serif',
  };

  return (
    <div style={newscard}>
      <button
        style={{
          cursor: 'pointer',
          backgroundColor: '#ffffff',
          justifyContent: 'flex-end',
          display: 'flex',
          alignSelf: 'flex-end',
        }}
        aria-label="Close"
        className="close-card"
        onClick={() => { setIsVisible(false); card.onClose(); }}
      >
        &times;
      </button>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{card.title}</h3>
      </div>
      <div style={contentStyle}>
        <p style={contentTextStyle}>
          { card.description ?? 'No content available.'}
        </p>
      </div>
    </div>
  );
}