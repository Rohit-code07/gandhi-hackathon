import React from 'react';

export const OldPhotoModal: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#2b2b2b',
        padding: '12px'
      }}
    >
      {/* Polaroid Frame */}
      <div
        style={{
          backgroundColor: '#f8f5ee',
          padding: '12px 12px 28px 12px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '380px'
        }}
      >
        {/* Retro Sepia / Vintage SVG Photo Illustration */}
        <svg
          viewBox="0 0 320 240"
          width="320"
          height="240"
          style={{ border: '1px solid #d0c0a0', backgroundColor: '#e8dcba' }}
        >
          {/* Room Background */}
          <rect width="320" height="240" fill="#d2b48c" />
          <line x1="0" y1="180" x2="320" y2="180" stroke="#8b5a2b" stroke-width="2" />

          {/* Wooden Table */}
          <rect x="20" y="160" width="280" height="70" fill="#a0522d" stroke="#5c2e17" stroke-width="2" />

          {/* CRT Monitor */}
          <rect x="140" y="80" width="110" height="90" rx="4" fill="#eed9b3" stroke="#8b7355" stroke-width="2" />
          <rect x="150" y="90" width="90" height="70" rx="3" fill="#008080" />
          <text x="195" y="130" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">
            Windows 98
          </text>
          <rect x="180" y="170" width="30" height="10" fill="#c0a880" />

          {/* Computer Tower on Floor */}
          <rect x="260" y="120" width="45" height="100" fill="#eed9b3" stroke="#8b7355" stroke-width="2" />
          <rect x="270" y="135" width="25" height="6" fill="#888" />
          <circle cx="282" cy="155" r="3" fill="#00ff00" />

          {/* Alex Sharma Figure standing proudly */}
          <circle cx="85" cy="80" r="24" fill="#ffe0bd" stroke="#000" stroke-width="1.5" />
          {/* 90s Haircut */}
          <path d="M60 80 Q85 50 110 80 Z" fill="#3d2314" />
          {/* Eyeglasses */}
          <circle cx="78" cy="80" r="6" fill="none" stroke="#000" stroke-width="1.5" />
          <circle cx="92" cy="80" r="6" fill="none" stroke="#000" stroke-width="1.5" />
          <line x1="84" y1="80" x2="86" y2="80" stroke="#000" stroke-width="1.5" />
          {/* Smile */}
          <path d="M78 92 Q85 98 92 92" stroke="#000" stroke-width="1.5" fill="none" />
          {/* Shirt */}
          <path d="M60 104 L110 104 L120 180 L50 180 Z" fill="#000080" stroke="#000" stroke-width="1.5" />
          {/* Thumbs up */}
          <circle cx="120" cy="130" r="6" fill="#ffe0bd" stroke="#000" />
          <text x="120" y="126" font-size="12">👍</text>

          {/* Floppy disks on table */}
          <rect x="50" y="165" width="24" height="20" fill="#0000aa" stroke="#000" />
          <rect x="52" y="163" width="24" height="20" fill="#ff0000" stroke="#000" />
          <rect x="54" y="161" width="24" height="20" fill="#ffd700" stroke="#000" />
        </svg>

        {/* Handwritten text */}
        <div
          style={{
            marginTop: '12px',
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            fontSize: '12px',
            color: '#333333',
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}
        >
          "Me &amp; my Pentium II 350MHz. Hostel Room 204 - Nov 1998."
        </div>
      </div>
    </div>
  );
};
