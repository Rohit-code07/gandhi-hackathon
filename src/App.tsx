import React, { useState, useEffect } from 'react';
import { BootSequence } from './components/boot/BootSequence';
import { Desktop } from './components/desktop/Desktop';
import { WindowManager } from './components/windows/WindowManager';
import { Clippy } from './components/easter-eggs/Clippy';
import { BSOD } from './components/easter-eggs/BSOD';
import { RandomErrorModal } from './components/easter-eggs/RandomErrorModal';
import { KonamiListener } from './components/easter-eggs/KonamiListener';
import { PresentationMode } from './components/easter-eggs/PresentationMode';
import { ScreenSaverManager } from './components/screensavers/ScreenSaverManager';
import { AchievementToast } from './components/shared/AchievementToast';
import { useFilesystemStore } from './store/filesystemStore';
import './styles/global.css';

export const App: React.FC = () => {
  const [bootCompleted, setBootCompleted] = useState<boolean>(() => {
    return localStorage.getItem('win98_skip_boot') === 'true';
  });

  const { init: initFilesystem } = useFilesystemStore();

  useEffect(() => {
    initFilesystem();
  }, [initFilesystem]);

  const handleBootFinish = () => {
    setBootCompleted(true);
    // Mark in session so repeat refreshes within session can load fast, or keep boot sequence accessible
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {!bootCompleted ? (
        <BootSequence onComplete={handleBootFinish} />
      ) : (
        <>
          <Desktop />
          <WindowManager />
          <Clippy />
          <BSOD />
          <RandomErrorModal />
          <KonamiListener />
          <PresentationMode />
          <ScreenSaverManager />
          <AchievementToast />
        </>
      )}
    </div>
  );
};
