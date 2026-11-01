import React, { useEffect, useState } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useSettingsStore } from '../../store/settingsStore';
import { soundService } from '../../services/soundService';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export const KonamiListener: React.FC = () => {
  const { unlockDiscovery } = useStoryStore();
  const { setWallpaper, unlockWallpaper } = useSettingsStore();
  const [inputSeq, setInputSeq] = useState<string[]>([]);
  const [showMatrixToast, setShowMatrixToast] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const expectedKey = KONAMI_CODE[inputSeq.length];

      if (key.toLowerCase() === expectedKey?.toLowerCase()) {
        const next = [...inputSeq, key];
        if (next.length === KONAMI_CODE.length) {
          // Success!
          soundService.playStartup();
          unlockDiscovery('konami');
          unlockWallpaper('matrix');
          setWallpaper('matrix');
          setShowMatrixToast(true);
          setTimeout(() => setShowMatrixToast(false), 5000);
          setInputSeq([]);
        } else {
          setInputSeq(next);
        }
      } else {
        setInputSeq([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSeq, unlockDiscovery, unlockWallpaper, setWallpaper]);

  if (!showMatrixToast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#001100',
        color: '#00ff66',
        border: '2px solid #00ff66',
        padding: '14px 28px',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 9999999,
        boxShadow: '0 0 20px #00ff66',
        textAlign: 'center',
        animation: 'pulse 1s infinite'
      }}
    >
      <div>⚡ KONAMI CODE ACTIVATED ⚡</div>
      <div style={{ fontSize: '11px', marginTop: '4px', color: '#fff' }}>
        You have unlocked the Matrix theme &amp; secret hacker wallpaper!
      </div>
    </div>
  );
};
