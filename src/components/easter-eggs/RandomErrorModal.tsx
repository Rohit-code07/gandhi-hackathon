import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { soundService } from '../../services/soundService';

const RANDOM_ERRORS = [
  'Critical error: Your motivation is missing.',
  'Windows has detected excessive procrastination.',
  'System warning: Too many open browser tabs in your brain.',
  'Your brain.exe has stopped responding. Restart brain?',
  'Update failed: Common sense not found.',
  'Please stop opening apps. I am only 128 MB RAM.',
  'Warning: Somebody is watching your cursor right now.'
];

export const RandomErrorModal: React.FC = () => {
  const { randomErrorsEnabled } = useSettingsStore();
  const [currentError, setCurrentError] = useState<string | null>(null);

  useEffect(() => {
    if (!randomErrorsEnabled) return;

    const timer = setInterval(() => {
      const err = RANDOM_ERRORS[Math.floor(Math.random() * RANDOM_ERRORS.length)];
      setCurrentError(err);
      soundService.playDing();
    }, 65000); // every 65 seconds

    return () => clearInterval(timer);
  }, [randomErrorsEnabled]);

  if (!currentError) return null;

  return (
    <div
      className="win-outset"
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        background: '#c0c0c0',
        zIndex: 9999998,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.4)',
        padding: '2px'
      }}
    >
      <div className="win-titlebar">
        <span>System Notification</span>
        <button className="win-titlebar-btn" onClick={() => setCurrentError(null)}>✕</button>
      </div>

      <div style={{ padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <img src="/icons/warning.svg" alt="" style={{ width: '32px', height: '32px' }} />
        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>{currentError}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', padding: '0 12px 10px 12px' }}>
        <button className="win-button" onClick={() => setCurrentError(null)} style={{ fontWeight: 'bold' }}>
          OK
        </button>
        <button className="win-button" onClick={() => setCurrentError(null)}>
          Ignore
        </button>
      </div>
    </div>
  );
};
