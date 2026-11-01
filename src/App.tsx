import React, { useState, useEffect } from 'react';
import { StartButtonChase } from './components/boot/StartButtonChase';
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
  const [startupPhase, setStartupPhase] = useState<'chase' | 'dos-boot' | 'desktop'>(() => {
    return localStorage.getItem('win98_skip_boot') === 'true' ? 'desktop' : 'chase';
  });

  const { init: initFilesystem } = useFilesystemStore();

  useEffect(() => {
    initFilesystem();
  }, [initFilesystem]);

  useEffect(() => {
    const handleRestartChase = () => setStartupPhase('chase');
    window.addEventListener('win98-restart-chase', handleRestartChase);
    return () => window.removeEventListener('win98-restart-chase', handleRestartChase);
  }, []);

  const handleFinishStartup = () => {
    setStartupPhase('desktop');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {startupPhase === 'chase' ? (
        <StartButtonChase
          onComplete={handleFinishStartup}
          onSwitchToDos={() => setStartupPhase('dos-boot')}
        />
      ) : startupPhase === 'dos-boot' ? (
        <BootSequence
          onComplete={handleFinishStartup}
          onSwitchToChase={() => setStartupPhase('chase')}
        />
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
