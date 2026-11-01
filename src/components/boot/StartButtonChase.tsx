import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundService } from '../../services/soundService';
import { useStoryStore } from '../../store/storyStore';
import { useSettingsStore } from '../../store/settingsStore';

interface StartButtonChaseProps {
  onComplete: () => void;
  onSwitchToDos?: () => void;
}

interface DialogConfig {
  title: string;
  icon: string;
  message: string;
  soundType: 'warning' | 'error' | 'info';
}

const ATTEMPT_DIALOGS: Record<number, DialogConfig> = {
  1: {
    title: 'Windows 98 Warning!',
    icon: '/icons/warning.svg',
    message: 'Why are you chasing me?',
    soundType: 'warning'
  },
  2: {
    title: 'ERROR 404',
    icon: '/icons/error.svg',
    message: 'START BUTTON NOT FOUND.',
    soundType: 'error'
  },
  3: {
    title: 'System Alert!',
    icon: '/icons/warning.svg',
    message: 'Are you trying to break my computer?',
    soundType: 'warning'
  },
  4: {
    title: 'Microsoft Windows 98',
    icon: '/icons/win98.svg',
    message: 'I am faster than your mouse!',
    soundType: 'warning'
  },
  5: {
    title: 'FINAL WARNING!',
    icon: '/icons/warning.svg',
    message: 'Okay, you win. I am tired.',
    soundType: 'warning'
  }
};

const FINAL_LOADING_LINES = [
  { text: 'Loading patience.dll ........ OK', status: 'OK', delay: 500 },
  { text: 'Loading common_sense.dll .... FAILED', status: 'FAILED', delay: 1200 },
  { text: 'Loading coffee.exe .......... OK', status: 'OK', delay: 1800 },
  { text: 'Loading judge_mode.exe ...... OK', status: 'OK', delay: 2400 },
  { text: 'Starting Windows 98 ......... OK', status: 'OK', delay: 3000 }
];

export const StartButtonChase: React.FC<StartButtonChaseProps> = ({ onComplete, onSwitchToDos }) => {
  const { unlockDiscovery } = useStoryStore();
  const { soundsEnabled, setSoundsEnabled } = useSettingsStore();

  const [attempt, setAttempt] = useState<number>(0);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [activeDialog, setActiveDialog] = useState<DialogConfig | null>(null);
  const [isKeyboardEasterEgg, setIsKeyboardEasterEgg] = useState<boolean>(false);
  const [isLoadingSequence, setIsLoadingSequence] = useState<boolean>(false);
  const [visibleLoadingLines, setVisibleLoadingLines] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isTired, setIsTired] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const brandCardRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const timersRef = useRef<any[]>([]);

  // Safe timer helper
  const addTimer = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  };

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize initial center position on mount
  useEffect(() => {
    const updateInitialPosition = () => {
      if (attempt === 0 && brandCardRef.current) {
        const rect = brandCardRef.current.getBoundingClientRect();
        // Position centered right under "Welcome Back!" inside or below card
        setButtonPos({
          x: Math.round(rect.left + rect.width / 2 - 55),
          y: Math.round(rect.bottom - 56)
        });
      }
    };

    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, [attempt]);

  // Safe random coordinate generator: keeps button inside viewport and outside center card
  const getNextSafePosition = useCallback((): { x: number; y: number } => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const btnW = 120;
    const btnH = 38;
    const padding = 24;

    // Define card exclusion zone with margin
    let cardLeft = winW / 2 - 210;
    let cardRight = winW / 2 + 210;
    let cardTop = winH / 2 - 140;
    let cardBottom = winH / 2 + 140;

    if (brandCardRef.current) {
      const rect = brandCardRef.current.getBoundingClientRect();
      cardLeft = rect.left - 20;
      cardRight = rect.right + 20;
      cardTop = rect.top - 20;
      cardBottom = rect.bottom + 20;
    }

    // Four safe zones around central card:
    // 0: Top Zone, 1: Bottom Zone, 2: Left Zone, 3: Right Zone
    const zones: Array<{ minX: number; maxX: number; minY: number; maxY: number }> = [];

    // Top zone
    if (cardTop - padding > btnH + 10) {
      zones.push({
        minX: padding,
        maxX: Math.max(padding, winW - btnW - padding),
        minY: padding,
        maxY: Math.max(padding, cardTop - btnH - 10)
      });
    }

    // Bottom zone
    if (winH - padding - cardBottom > btnH + 10) {
      zones.push({
        minX: padding,
        maxX: Math.max(padding, winW - btnW - padding),
        minY: cardBottom + 10,
        maxY: Math.max(cardBottom + 10, winH - btnH - padding)
      });
    }

    // Left zone
    if (cardLeft - padding > btnW + 10) {
      zones.push({
        minX: padding,
        maxX: Math.max(padding, cardLeft - btnW - 10),
        minY: padding,
        maxY: Math.max(padding, winH - btnH - padding)
      });
    }

    // Right zone
    if (winW - padding - cardRight > btnW + 10) {
      zones.push({
        minX: cardRight + 10,
        maxX: Math.max(cardRight + 10, winW - btnW - padding),
        minY: padding,
        maxY: Math.max(padding, winH - btnH - padding)
      });
    }

    // Fallback if small screen
    if (zones.length === 0) {
      return {
        x: Math.max(padding, Math.min(winW - btnW - padding, Math.random() * (winW - btnW))),
        y: Math.max(padding, Math.min(winH - btnH - padding, winH - btnH - padding - 10))
      };
    }

    // Pick a random safe zone
    const chosenZone = zones[Math.floor(Math.random() * zones.length)];
    const x = Math.round(chosenZone.minX + Math.random() * (chosenZone.maxX - chosenZone.minX));
    const y = Math.round(chosenZone.minY + Math.random() * (chosenZone.maxY - chosenZone.minY));

    return { x, y };
  }, []);

  // Handle Start Button Click
  const handleStartButtonClick = () => {
    if (isTransitioningRef.current || isLoadingSequence) return;
    soundService.playClick();

    // If button is already tired (post-attempt 5), clicking it starts final loading!
    if (isTired) {
      startFinalLoadingSequence();
      return;
    }

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);
    setIsMoving(true);

    // Calculate next jump
    const nextPos = getNextSafePosition();
    setButtonPos(nextPos);

    // Sound effect based on dialog
    const dialog = ATTEMPT_DIALOGS[nextAttempt];
    if (dialog) {
      if (dialog.soundType === 'error') {
        soundService.playError();
      } else {
        soundService.playDing();
      }
    }

    // After animation delay, show dialog
    addTimer(() => {
      setIsMoving(false);
      if (dialog) {
        setActiveDialog(dialog);
      }
      if (nextAttempt >= 5) {
        setIsTired(true);
      }
    }, prefersReducedMotion ? 50 : 380);
  };

  // Close Attempt Dialog
  const handleDismissDialog = () => {
    soundService.playClick();
    setActiveDialog(null);

    // If dismissed Attempt 5, user is now prompted to click the tired button!
    if (attempt >= 5) {
      setIsTired(true);
    }
  };

  // Trigger Final Loading Sequence
  const startFinalLoadingSequence = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    unlockDiscovery('start-chase');
    setActiveDialog(null);
    setIsKeyboardEasterEgg(false);
    setIsLoadingSequence(true);

    // Progressive loading lines
    FINAL_LOADING_LINES.forEach((line) => {
      addTimer(() => {
        setVisibleLoadingLines((prev) => [...prev, line.text]);
        setLoadingProgress((prev) => Math.min(prev + 20, 100));

        if (line.status === 'FAILED') {
          soundService.playDing();
        } else {
          soundService.playClick();
        }

        // When all lines displayed, play startup chord and transition to desktop
        if (line.text.includes('Starting Windows 98')) {
          setLoadingProgress(100);
          addTimer(() => {
            soundService.playStartup();
            addTimer(() => {
              onComplete();
            }, 1200);
          }, 400);
        }
      }, line.delay);
    });
  }, [onComplete, unlockDiscovery]);

  // Global Keydown Listener for the ENTER Key Easter Egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // If an attempt dialog is active, Enter can dismiss it or trigger keyboard easter egg
        if (activeDialog && !isKeyboardEasterEgg) {
          e.preventDefault();
          handleDismissDialog();
          return;
        }

        // If not in loading sequence and not already transitioning, trigger Enter Easter egg!
        if (!isLoadingSequence && !isTransitioningRef.current && !isKeyboardEasterEgg) {
          e.preventDefault();
          soundService.playSuccess();
          setIsKeyboardEasterEgg(true);
          setActiveDialog(null);

          // After small delay showing the funny message, start final loading!
          addTimer(() => {
            startFinalLoadingSequence();
          }, 2000);
        }
      } else if (e.key === 'Escape' && activeDialog) {
        e.preventDefault();
        handleDismissDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialog, isKeyboardEasterEgg, isLoadingSequence, startFinalLoadingSequence]);

  // Cleanup all pending timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundsEnabled;
    setSoundsEnabled(next);
    soundService.setMuted(!next);
    if (next) soundService.playDing();
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#008080', // Authentic Windows 98 Teal
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
        userSelect: 'none'
      }}
    >
      {/* Top Utility Controls */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          right: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000
        }}
      >
        {/* Quick Skip to Desktop */}
        <button
          className="win-button"
          onClick={() => {
            soundService.playClick();
            onComplete();
          }}
          style={{ padding: '3px 10px', fontSize: '11px', opacity: 0.9 }}
          title="Directly enter Windows 98 desktop"
        >
          ⏩ Skip to Desktop
        </button>

        {/* Audio Mute / Unmute Toggle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onSwitchToDos && (
            <button
              className="win-button"
              onClick={() => {
                soundService.playClick();
                onSwitchToDos();
              }}
              style={{ padding: '3px 10px', fontSize: '11px' }}
              title="Switch to original MS-DOS BIOS boot"
            >
              📟 Classic DOS Boot
            </button>
          )}

          <button
            className="win-button"
            onClick={handleToggleSound}
            style={{ padding: '3px 8px', fontSize: '11px', minWidth: '32px' }}
            title={soundsEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundsEnabled ? '🔊 Sound: ON' : '🔈 Muted'}
          </button>
        </div>
      </div>

      {/* Main Central Branding Card */}
      {!isLoadingSequence && (
        <div
          ref={brandCardRef}
          className="win-outset"
          style={{
            width: '90%',
            maxWidth: '460px',
            backgroundColor: '#c0c0c0',
            padding: '24px 28px',
            textAlign: 'center',
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Windows 98 Logo & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <img
              src="/icons/win98.svg"
              alt="Microsoft Windows 98"
              style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#000080',
                  letterSpacing: '0.5px',
                  lineHeight: '1.2'
                }}
              >
                Microsoft Windows 98
              </div>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px' }}>
                SECOND EDITION — GANDHI HACKATHON
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#808080',
              borderBottom: '1px solid #ffffff',
              margin: '12px 0 16px 0'
            }}
          />

          {/* Welcome Message */}
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginBottom: '6px' }}>
            Welcome Back!
          </div>

          <div style={{ fontSize: '12px', color: '#333333', lineHeight: '1.4', marginBottom: '24px' }}>
            Click the <strong>START</strong> button below to power on Alex's Abandoned Computer and initialize the
            desktop.
          </div>

          {/* Reserved space for button on Attempt 0 */}
          <div style={{ height: '44px', width: '100%' }} />

          {/* Footer keyboard hint */}
          <div
            style={{
              marginTop: '10px',
              fontSize: '10px',
              color: '#666666',
              fontStyle: 'italic',
              borderTop: '1px dotted #a0a0a0',
              paddingTop: '8px',
              width: '100%'
            }}
          >
            Tip: A true 1990s power user knows the keyboard shortcut...
          </div>
        </div>
      )}

      {/* The Runaway START Button */}
      {!isLoadingSequence && buttonPos && (
        <button
          onClick={handleStartButtonClick}
          className="win-button"
          style={{
            position: 'fixed',
            left: `${buttonPos.x}px`,
            top: `${buttonPos.y}px`,
            width: '110px',
            height: '34px',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#000000',
            cursor: 'pointer',
            backgroundColor: '#c0c0c0',
            boxShadow: isMoving ? '0 0 10px rgba(255, 255, 0, 0.8)' : '2px 2px 4px rgba(0,0,0,0.3)',
            transition: prefersReducedMotion
              ? 'none'
              : 'left 0.45s cubic-bezier(0.25, 1, 0.5, 1), top 0.45s cubic-bezier(0.25, 1, 0.5, 1), transform 0.15s ease',
            transform: isMoving ? 'scale(1.08) rotate(3deg)' : isTired ? 'rotate(-2deg)' : 'scale(1)',
            outline: 'none'
          }}
          title={isTired ? 'Okay, you got me! Click to start Windows 98.' : 'Start Windows 98'}
        >
          <img
            src="/icons/win98.svg"
            alt=""
            style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
          />
          <span>{isTired ? 'Start 😮‍💨' : 'Start'}</span>
        </button>
      )}

      {/* Progressive Funny Windows 98 Dialog Popups */}
      {activeDialog && !isLoadingSequence && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={handleDismissDialog}
        >
          <div
            className="win-outset"
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#c0c0c0',
              padding: '2px',
              boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.5)',
              animation: 'win98FadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue Titlebar */}
            <div
              className="win-titlebar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px',
                height: '22px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
                <img
                  src={activeDialog.icon}
                  alt=""
                  style={{ width: '14px', height: '14px', imageRendering: 'pixelated' }}
                />
                <span>{activeDialog.title}</span>
              </div>
              <button
                className="win-titlebar-btn"
                onClick={handleDismissDialog}
                style={{ width: '16px', height: '14px', fontSize: '9px' }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Dialog Content */}
            <div
              style={{
                padding: '18px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backgroundColor: '#c0c0c0'
              }}
            >
              <img
                src={activeDialog.icon}
                alt=""
                style={{ width: '36px', height: '36px', flexShrink: 0, imageRendering: 'pixelated' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  lineHeight: '1.4',
                  color: '#000000',
                  fontWeight: attempt === 2 ? 'bold' : 'normal',
                  fontFamily: attempt === 2 ? 'monospace' : 'inherit'
                }}
              >
                {activeDialog.message}
              </div>
            </div>

            {/* OK Action Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 16px 14px 16px',
                backgroundColor: '#c0c0c0'
              }}
            >
              <button
                className="win-button"
                onClick={handleDismissDialog}
                autoFocus
                style={{ minWidth: '76px', fontWeight: 'bold' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Keyboard Easter Egg Dialog (ENTER pressed) */}
      {isKeyboardEasterEgg && !isLoadingSequence && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="win-outset"
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#c0c0c0',
              padding: '2px',
              boxShadow: '4px 4px 20px rgba(0, 0, 0, 0.6)',
              animation: 'win98FadeIn 0.25s ease-out'
            }}
          >
            <div
              className="win-titlebar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px',
                height: '22px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
                <img src="/icons/info.svg" alt="" style={{ width: '14px', height: '14px' }} />
                <span>Keyboard Easter Egg Unlocked!</span>
              </div>
            </div>

            <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="/icons/info.svg" alt="" style={{ width: '36px', height: '36px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#000080', marginBottom: '4px' }}>
                  Smart move! You finally used your keyboard.
                </div>
                <div style={{ fontSize: '11px', color: '#444' }}>
                  Skipping the chase sequence and booting directly into Windows 98...
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 16px 12px 16px' }}>
              <button
                className="win-button"
                onClick={startFinalLoadingSequence}
                style={{ minWidth: '90px', fontWeight: 'bold' }}
              >
                Proceed &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL RETRO STARTUP SEQUENCE & LOADING SCREEN */}
      {isLoadingSequence && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            color: '#ffffff',
            zIndex: 99999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Courier New', Courier, monospace"
          }}
        >
          {/* Retro Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img
              src="/icons/win98.svg"
              alt="Windows 98"
              style={{ width: '72px', height: '72px', imageRendering: 'pixelated' }}
            />
            <h1
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '28px',
                margin: '10px 0 0 0',
                color: '#ffffff',
                letterSpacing: '1px'
              }}
            >
              Microsoft<span style={{ fontSize: '16px', verticalAlign: 'super' }}>&reg;</span> Windows
              <span style={{ fontSize: '18px' }}> 98</span>
            </h1>
            <div style={{ color: '#00a4ef', fontSize: '12px', letterSpacing: '3px', marginTop: '4px' }}>
              STARTUP SUBSYSTEM INITIALIZATION
            </div>
          </div>

          {/* Retro Segmented Loading Bar */}
          <div
            style={{
              width: '320px',
              height: '18px',
              backgroundColor: '#000000',
              border: '2px solid #808080',
              padding: '2px',
              marginBottom: '20px',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${loadingProgress}%`,
                background: 'linear-gradient(90deg, #000080 0%, #00a4ef 50%, #ffffff 100%)',
                transition: 'width 0.25s linear'
              }}
            />
          </div>

          {/* Progressive DLL / System Loading Messages */}
          <div
            className="win-inset-gray"
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#0c0c0c',
              border: '2px solid #444',
              padding: '14px 18px',
              fontSize: '13px',
              lineHeight: '1.7',
              textAlign: 'left',
              minHeight: '150px'
            }}
          >
            {visibleLoadingLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  color: line.includes('FAILED')
                    ? '#ff4444'
                    : line.includes('Starting')
                    ? '#ffff00'
                    : '#00ff66',
                  fontWeight: line.includes('Starting') ? 'bold' : 'normal'
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', fontSize: '11px', color: '#777777', textAlign: 'center' }}>
            Gandhi Hackathon 2026 — IIT Bhilai Computer Science Lab
          </div>
        </div>
      )}
    </div>
  );
};
