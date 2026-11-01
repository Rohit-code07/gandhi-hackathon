import React from 'react';
import { useStoryStore } from '../../store/storyStore';
import { soundService } from '../../services/soundService';

export const Clippy: React.FC = () => {
  const { clippyVisible, clippyMessage, hideClippy } = useStoryStore();

  if (!clippyVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '50px',
        right: '25px',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        animation: 'bounceIn 0.4s ease-out'
      }}
    >
      {/* Speech Bubble */}
      <div
        className="win-outset"
        style={{
          width: '240px',
          backgroundColor: '#ffffcc',
          border: '2px solid #000000',
          boxShadow: '3px 3px 6px rgba(0,0,0,0.3)',
          padding: '10px',
          fontSize: '11px',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
          position: 'relative'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#000080' }}>
          📎 Clippy (Office Assistant)
        </div>
        <div style={{ lineHeight: '1.4' }}>{clippyMessage}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '6px' }}>
          <button
            className="win-button"
            onClick={() => {
              soundService.playClick();
              hideClippy();
            }}
            style={{ fontSize: '10px', padding: '2px 8px' }}
          >
            Go Away, Clippy
          </button>
        </div>
      </div>

      {/* Clippy Icon Graphic */}
      <img
        src="/icons/clippy.svg"
        alt="Clippy"
        style={{
          width: '64px',
          height: '64px',
          filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.5))',
          cursor: 'pointer'
        }}
        onClick={() => soundService.playDing()}
      />
    </div>
  );
};
