import React, { useEffect } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { soundService } from '../../services/soundService';

export const BSOD: React.FC = () => {
  const { bsodVisible, dismissBSOD } = useStoryStore();

  useEffect(() => {
    if (bsodVisible) {
      soundService.playError();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          dismissBSOD();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [bsodVisible, dismissBSOD]);

  if (!bsodVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0000aa',
        color: '#ffffff',
        fontFamily: "'Courier New', Courier, monospace",
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        userSelect: 'none',
        cursor: 'default'
      }}
      onClick={dismissBSOD}
    >
      <div
        style={{
          background: '#c0c0c0',
          color: '#0000aa',
          padding: '2px 14px',
          fontWeight: 'bold',
          fontSize: '18px',
          marginBottom: '24px'
        }}
      >
        Windows
      </div>

      <div style={{ maxWidth: '720px', lineHeight: '1.8', fontSize: '15px' }}>
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
        <p style={{ color: '#ffff00', fontWeight: 'bold' }}>Error: TOO_MUCH_INTERNET_AND_HACKATHON_OVERLOAD</p>
        <br />
        <p>* Press <b>ESC</b> to immediately recover your computer and return to desktop.</p>
        <p>* Press any other key to contemplate the beauty of 1998 nostalgia.</p>
        <br />
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#ffaaaa' }}>
          (Click anywhere or Press ESC to recover)
        </p>
      </div>
    </div>
  );
};
