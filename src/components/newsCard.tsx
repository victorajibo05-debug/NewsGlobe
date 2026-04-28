import type {card} from "types/types";
import '@fontsource/inter'
import React, { useState } from "react";


interface props {
    card: card;
}

export function NewsCard ({ card}: props)  {
const [isvisible, setIsVisible] =    useState(true); 

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
    }

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-start',
        
    }
    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Bebas Neue, sans-serif',
        color: '#ffffff',
    }
    const contentStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-start',
    }
    const contentTextStyle: React.CSSProperties = {
        fontSize: '18px',
        color: '#ffffff',
        fontWeight: 'normal',
        fontFamily: 'Bebas Neue, sans-serif',
    }


    if (!isvisible) {
        return null;
    }
    return (
        <div style = {newscard}>
            <button style={{ cursor: "pointer",backgroundColor: "#ffffff", justifyContent: 'flex-end', display: 'flex'}}
        className="close-card" 
        onClick={() => {setIsVisible(false); card.onClose()}}
        
        aria-label="Close"
      >
        &times;
      </button>
            <div style = {headerStyle}>
                <h3  style={titleStyle}>{card.title}</h3>
            </div>
            <div style = {contentStyle}>
                <p style={contentTextStyle}>{card.content}</p>
            </div>
        </div>
    )
}