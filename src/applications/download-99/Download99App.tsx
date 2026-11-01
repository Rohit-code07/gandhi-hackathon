import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../../services/soundService';
import { useAchievementsStore } from '../../store/achievementsStore';
import { useWindowStore } from '../../store/windowStore';

type Difficulty = 'normal' | 'hard' | 'insane';

interface PopupError {
  id: string;
  title: string;
  message: string;
  x: number;
  y: number;
}

export const Download99App: React.FC = () => {
  const { unlockAchievement } = useAchievementsStore();
  const { openWindow } = useWindowStore();

  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'failed' | 'complete' | 'meme_reveal'>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [progress, setProgress] = useState<number>(99.0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('4.2 KB/s');
  const [eta, setEta] = useState<string>('2 hours 43 minutes');
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // Counters
  const [timeSurvived, setTimeSurvived] = useState<number>(0);
  const [disconnectsSurvived, setDisconnectsSurvived] = useState<number>(0);
  const [popupsDismissed, setPopupsDismissed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('win98_download99_highscore') || 0);
  });

  // Active crisis state
  const [currentCrisis, setCurrentCrisis] = useState<'none' | 'phone_call' | 'mom_phone' | 'wire_puzzle' | 'antivirus' | 'storage_low'>('none');
  const [crisisTimer, setCrisisTimer] = useState<number>(5);
  const [wireSelected, setWireSelected] = useState<string | null>(null);
  const [activeErrors, setActiveErrors] = useState<PopupError[]>([]);
  const phoneCallStartRef = useRef<number>(0);

  const startDownload = (diff: Difficulty = difficulty) => {
    setDifficulty(diff);
    setGameState('playing');
    setProgress(99.0);
    setDownloadSpeed(diff === 'normal' ? '4.8 KB/s' : diff === 'hard' ? '2.8 KB/s' : '1.4 KB/s');
    setEta(diff === 'normal' ? '1 hr 12 min' : diff === 'hard' ? '3 hr 45 min' : '7 hr 20 min');
    setIsConnected(true);
    setCurrentCrisis('none');
    setCrisisTimer(5);
    setActiveErrors([]);
    setTimeSurvived(0);
    setDisconnectsSurvived(0);
    setPopupsDismissed(0);
    setScore(0);
    soundService.playClick();
  };

  // Keyboard controls (SPACE to reconnect, R to retry)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (currentCrisis === 'phone_call' || !isConnected) {
          handleReconnectModem();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (!isConnected) {
          handleReconnectModem();
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCrisis, isConnected, gameState]);

  // Main Game Tick Loop (Runs every 1 second)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeSurvived((t) => t + 1);

      // If crisis is active, count down
      if (currentCrisis !== 'none') {
        setCrisisTimer((prev) => {
          if (prev <= 1) {
            // Crisis failed! Download aborted!
            soundService.playGameOver();
            setGameState('failed');
            return 0;
          }
          return prev - 1;
        });
        return; // Download is paused while crisis is active
      }

      // If connected, advance download by 0.1%
      if (isConnected) {
        setProgress((prev) => {
          const next = Number((prev + 0.1).toFixed(1));
          if (next >= 100.0) {
            // WIN!
            soundService.playSuccess();
            setGameState('complete');
            unlockAchievement('dl-finally-done');
            if (disconnectsSurvived >= 8) unlockAchievement('dl-99-survivor');
            return 100.0;
          }
          return next;
        });

        // Add score
        setScore((sc) => {
          const nextSc = sc + 15;
          if (nextSc > highScore) {
            setHighScore(nextSc);
            localStorage.setItem('win98_download99_highscore', String(nextSc));
          }
          return nextSc;
        });

        // Escalating crisis spawn chance
        const spawnChance = difficulty === 'normal' ? 0.35 : difficulty === 'hard' ? 0.5 : 0.65;
        if (Math.random() < spawnChance && currentCrisis === 'none') {
          triggerRandomCrisis();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isConnected, currentCrisis, difficulty, highScore, disconnectsSurvived]);

  // Trigger one of the classic dial-up download crises
  const triggerRandomCrisis = () => {
    const list: ('phone_call' | 'mom_phone' | 'wire_puzzle' | 'antivirus' | 'storage_low' | 'error_swarm')[] = [
      'phone_call',
      'mom_phone',
      'wire_puzzle',
      'antivirus',
      'storage_low',
      'error_swarm'
    ];
    const picked = list[Math.floor(Math.random() * list.length)];

    if (picked === 'phone_call') {
      setIsConnected(false);
      setCurrentCrisis('phone_call');
      setCrisisTimer(4);
      phoneCallStartRef.current = Date.now();
      soundService.playRing();
    } else if (picked === 'mom_phone') {
      setIsConnected(false);
      setCurrentCrisis('mom_phone');
      setCrisisTimer(4);
      soundService.playRing();
    } else if (picked === 'wire_puzzle') {
      setIsConnected(false);
      setCurrentCrisis('wire_puzzle');
      setCrisisTimer(6);
      setWireSelected(null);
      soundService.playError();
    } else if (picked === 'antivirus') {
      setCurrentCrisis('antivirus');
      setCrisisTimer(5);
      soundService.playDing();
    } else if (picked === 'storage_low') {
      setCurrentCrisis('storage_low');
      setCrisisTimer(6);
      soundService.playDing();
    } else if (picked === 'error_swarm') {
      soundService.playError();
      spawnErrorPopups();
    }
  };

  // 1. Phone Call Reconnect
  const handleReconnectModem = () => {
    const elapsedSecs = (Date.now() - phoneCallStartRef.current) / 1000;
    if (elapsedSecs < 1.5 && currentCrisis === 'phone_call') {
      unlockAchievement('dl-modem-master');
    }

    soundService.playDing();
    setIsConnected(true);
    setCurrentCrisis('none');
    setDisconnectsSurvived((d) => d + 1);
    setScore((sc) => sc + 50);
  };

  // 2. Mom Telephone Signal
  const handleSignalMom = () => {
    soundService.playDing();
    setIsConnected(true);
    setCurrentCrisis('none');
    setDisconnectsSurvived((d) => d + 1);
    setScore((sc) => sc + 40);
  };

  // 3. Wire Puzzle Reconnect
  const handleWireFix = (color: string) => {
    if (color === 'green') {
      soundService.playDing();
      setIsConnected(true);
      setCurrentCrisis('none');
      setDisconnectsSurvived((d) => d + 1);
      setScore((sc) => sc + 60);
    } else {
      soundService.playError();
    }
  };

  // 4. Antivirus Threat Disinfection
  const handleAntivirusClean = (isCorrect: boolean) => {
    if (isCorrect) {
      soundService.playDing();
      setCurrentCrisis('none');
      setPopupsDismissed((p) => p + 1);
      setScore((sc) => sc + 40);
    } else {
      // Clicked trap button!
      soundService.playError();
      spawnErrorPopups();
      setCurrentCrisis('none');
    }
  };

  // 5. Storage Free space
  const handleDeleteJunkFile = () => {
    soundService.playDing();
    setCurrentCrisis('none');
    setScore((sc) => sc + 50);
  };

  // 6. Spawn Cascading Windows Errors
  const spawnErrorPopups = () => {
    const errorMessages = [
      'Error 404: Patience not found.',
      'Windows has detected an illegal operation.',
      'KaZaA peer disconnected.',
      'BSNL server is currently asleep.'
    ];

    const newErrors: PopupError[] = errorMessages.map((msg, i) => ({
      id: `err-${Date.now()}-${i}`,
      title: 'Windows System Warning',
      message: msg,
      x: 30 + i * 40,
      y: 40 + i * 30
    }));

    setActiveErrors((prev) => [...prev, ...newErrors]);
  };

  const dismissError = (id: string) => {
    soundService.playClick();
    setActiveErrors((prev) => prev.filter((e) => e.id !== id));
    setPopupsDismissed((p) => p + 1);
    setScore((sc) => sc + 10);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
        fontFamily: 'Tahoma, Arial, sans-serif',
        userSelect: 'none',
        position: 'relative',
        fontSize: '11px'
      }}
    >
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={() => startDownload('normal')}><u>N</u>ew Download</div>
        <div className="win-menu-item" onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}>
          {gameState === 'paused' ? '▶ <u>R</u>esume' : '⏸ <u>P</u>ause'}
        </div>
        <div className="win-menu-item" onClick={() => openWindow('achievements')}>🏆 <u>A</u>chievements</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', paddingRight: '6px' }}>
          <span>High Score: <b>{highScore}</b></span>
        </div>
      </div>

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            background: 'linear-gradient(135deg, #001f3f 0%, #003366 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <img src="/icons/download-99.svg" alt="" style={{ width: '64px', height: '64px', marginBottom: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#ffdd00', textShadow: '2px 2px #000' }}>
            THE 99% DOWNLOAD CHALLENGE
          </h1>
          <p style={{ margin: '4px 0 16px 0', fontSize: '12px', color: '#88ccff' }}>
            A 700 MB movie on 56K Dial-Up in 2005. Stuck at 99%. Protect it!
          </p>

          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid #4477aa',
              padding: '12px',
              maxWidth: '480px',
              textAlign: 'left',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}
          >
            <b>THE SITUATION:</b>
            <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>
              <li>Your download is at 99.0%. Every second of stable connection adds +0.1%.</li>
              <li>When the landline phone rings, press <b>SPACE</b> to reconnect immediately!</li>
              <li>Fix loose modem cables, disinfect fake trojans, and clear cascading errors.</li>
              <li>Reach 100.0% to open the downloaded file and discover the secret!</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {(['normal', 'hard', 'insane'] as const).map((d) => (
              <button
                key={d}
                className={`win-button ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
                style={{ fontWeight: difficulty === d ? 'bold' : 'normal' }}
              >
                {d === 'normal' ? '56k Modem' : d === 'hard' ? '28.8k BSNL' : '14.4k Stormy'}
              </button>
            ))}
          </div>

          <button
            className="win-button"
            onClick={() => startDownload(difficulty)}
            style={{ fontWeight: 'bold', fontSize: '13px', padding: '6px 24px', backgroundColor: '#ffdd00', color: '#000' }}
          >
            ▶ RESUME DOWNLOAD AT 99%
          </button>
        </div>
      )}

      {/* FAILED SCREEN */}
      {gameState === 'failed' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            backgroundColor: '#8b0000',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>❌📞</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#ffdd00' }}>DOWNLOAD ABORTED AT {progress}%!</h2>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>
            "Connection terminated by remote host. Resume is NOT supported."
          </p>
          <p style={{ fontSize: '11px', color: '#f0c0c0', maxWidth: '400px' }}>
            Someone picked up the landline phone downstairs and ruined 72 continuous hours of dial-up downloading!
          </p>

          <div className="win-outset" style={{ padding: '10px 24px', background: '#c0c0c0', color: '#000', margin: '14px 0' }}>
            <div>Final Progress: <b>{progress}%</b></div>
            <div>Time Survived: <b>{timeSurvived}s</b></div>
            <div>Score: <b>{score}</b></div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="win-button" onClick={() => startDownload(difficulty)} style={{ fontWeight: 'bold' }}>
              🔄 Retry Download
            </button>
            <button className="win-button" onClick={() => setGameState('start')}>
              Main Menu
            </button>
          </div>
        </div>
      )}

      {/* COMPLETE SCREEN */}
      {gameState === 'complete' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            background: 'linear-gradient(135deg, #003300 0%, #006600 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉💾</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#ffff00' }}>DOWNLOAD COMPLETE (100%)!</h2>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>
            After 27 years... movie_final_REAL_final.avi (700 MB) has finally finished downloading!
          </p>

          <div className="win-outset" style={{ padding: '10px 24px', background: '#c0c0c0', color: '#000', margin: '14px 0' }}>
            <div>Total Score: <b>{score}</b></div>
            <div>Disconnections Survived: <b>{disconnectsSurvived}</b></div>
            <div>Popups Dismissed: <b>{popupsDismissed}</b></div>
          </div>

          <button
            className="win-button"
            onClick={() => {
              setGameState('meme_reveal');
              unlockAchievement('dl-27-years');
            }}
            style={{ fontWeight: 'bold', fontSize: '13px', padding: '8px 24px', backgroundColor: '#ffff00', color: '#000' }}
          >
            ▶ OPEN DOWNLOADED MOVIE NOW
          </button>
        </div>
      )}

      {/* RIDICULOUS MEME REVEAL SCREEN */}
      {gameState === 'meme_reveal' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            backgroundColor: '#111111',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          {/* Windows Media Player 98 Header */}
          <div className="win-titlebar" style={{ width: '90%', marginBottom: '8px' }}>
            <span>Windows Media Player - movie_final_REAL_final.avi</span>
          </div>

          <div
            className="win-inset"
            style={{
              width: '90%',
              maxWidth: '460px',
              backgroundColor: '#000',
              padding: '16px',
              border: '2px solid #555',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: '64px', animation: 'spin 2s infinite' }}>🥔🕺</div>
            <h2 style={{ color: '#ff3333', margin: '8px 0 0 0' }}>404 MOVIE NOT FOUND!</h2>
            <div style={{ color: '#ffff00', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>
              YOU JUST DOWNLOADED A 700 MB VIDEO OF A DANCING POTATO!
            </div>
            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
              "Welcome to the 2005 KaZaA file sharing experience. Never trust a 700MB AVI file from an internet stranger!"
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button className="win-button" onClick={() => startDownload(difficulty)} style={{ fontWeight: 'bold' }}>
              Play Again
            </button>
            <button className="win-button" onClick={() => openWindow('achievements')}>
              View Achievements
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING SCREEN (WINDOWS 98 DOWNLOAD ACCELERATOR) */}
      {gameState === 'playing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px', gap: '6px' }}>
          {/* Download Dialog Window */}
          <div className="win-outset" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* File Info Header */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src="/icons/download-99.svg" alt="" style={{ width: '40px', height: '40px' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>movie_final_REAL_final.avi</div>
                <div style={{ color: '#555' }}>
                  From: <code>ftp.warez-1998.com/movies/bollywood/</code>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontWeight: 'bold' }}>
                <span>Progress: {progress}%</span>
                <span>{((progress / 100) * 700).toFixed(1)} MB / 700.0 MB</span>
              </div>
              <div
                className="win-inset"
                style={{
                  height: '24px',
                  backgroundColor: '#ffffff',
                  padding: '2px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${((progress - 98) / 2) * 100}%`,
                    backgroundColor: isConnected ? '#000080' : '#800000',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Diagnostics Grid */}
            <div
              className="win-inset"
              style={{
                backgroundColor: '#ffffff',
                padding: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px'
              }}
            >
              <div>Transfer Rate: <b>{isConnected ? downloadSpeed : '0.00 KB/s'}</b></div>
              <div>Estimated Time: <b>{isConnected ? eta : 'STALLED'}</b></div>
              <div>Connection: <b style={{ color: isConnected ? '#008000' : '#ff0000' }}>{isConnected ? 'ONLINE (56K V.90)' : 'DISCONNECTED'}</b></div>
              <div>Current Score: <b style={{ color: '#000080' }}>{score}</b></div>
            </div>
          </div>

          {/* CRISIS NOTIFICATION & INTERACTIVE PUZZLE AREA */}
          <div
            className="win-outset"
            style={{
              flex: 1,
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: currentCrisis !== 'none' ? '#ffffea' : '#e0e0e0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* CRISIS 1: INCOMING PHONE CALL */}
            {currentCrisis === 'phone_call' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '32px', animation: 'shake 0.3s infinite' }}>☎️💥</div>
                <div style={{ color: '#cc0000', fontWeight: 'bold', fontSize: '13px' }}>
                  INCOMING LANDLINE PHONE CALL! DIAL-UP DISCONNECTED!
                </div>
                <div style={{ fontSize: '11px', color: '#555' }}>
                  Reconnect before download aborts! (Time: <b>{crisisTimer}s</b>)
                </div>
                <button
                  className="win-button"
                  onClick={handleReconnectModem}
                  style={{
                    backgroundColor: '#ff3333',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    padding: '6px 20px',
                    animation: 'pulse 0.4s infinite'
                  }}
                >
                  ⚡ RECONNECT MODEM (PRESS SPACE)!
                </button>
              </div>
            )}

            {/* CRISIS 2: MOM ON TELEPHONE */}
            {currentCrisis === 'mom_phone' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '32px' }}>🗣️📞</div>
                <div style={{ color: '#cc0000', fontWeight: 'bold', fontSize: '13px' }}>
                  MOM PICKED UP THE PHONE TO TALK TO AUNTIE!
                </div>
                <div style={{ fontSize: '11px', color: '#555' }}>
                  Signal mom to hang up the receiver! (Time: <b>{crisisTimer}s</b>)
                </div>
                <button
                  className="win-button"
                  onClick={handleSignalMom}
                  style={{ backgroundColor: '#ff9900', color: '#000', fontWeight: 'bold', padding: '6px 18px' }}
                >
                  📢 SHOUT: "MUMMY PHONE RAKHO! INTERNET CHAL RAHA HAI!"
                </button>
              </div>
            )}

            {/* CRISIS 3: WIRE PUZZLE */}
            {currentCrisis === 'wire_puzzle' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#000080', fontSize: '12px' }}>
                  MODEM CABLE DISCONNECTED! CLICK THE GREEN RJ-11 WIRE TO RECONNECT:
                </div>
                <div style={{ display: 'flex', gap: '12px', margin: '8px 0' }}>
                  <button
                    className="win-button"
                    onClick={() => handleWireFix('red')}
                    style={{ backgroundColor: '#ff4444', color: '#fff', fontWeight: 'bold', padding: '6px 14px' }}
                  >
                    🔴 Red Wire
                  </button>
                  <button
                    className="win-button"
                    onClick={() => handleWireFix('green')}
                    style={{ backgroundColor: '#00cc44', color: '#fff', fontWeight: 'bold', padding: '6px 14px' }}
                  >
                    🟢 Green Wire
                  </button>
                  <button
                    className="win-button"
                    onClick={() => handleWireFix('blue')}
                    style={{ backgroundColor: '#3388ff', color: '#fff', fontWeight: 'bold', padding: '6px 14px' }}
                  >
                    🔵 Blue Wire
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Time left: {crisisTimer}s</div>
              </div>
            )}

            {/* CRISIS 4: ANTIVIRUS THREAT */}
            {currentCrisis === 'antivirus' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ color: '#cc0000', fontWeight: 'bold', fontSize: '12px' }}>
                  ⚠️ VIRUS WARNING: Trojan.DialUpWorm detected in download queue!
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    className="win-button"
                    onClick={() => handleAntivirusClean(true)}
                    style={{ backgroundColor: '#00aa00', color: '#fff', fontWeight: 'bold', padding: '4px 14px' }}
                  >
                    🛡️ Clean Virus Safely
                  </button>
                  <button
                    className="win-button"
                    onClick={() => handleAntivirusClean(false)}
                    style={{ backgroundColor: '#ffdd00', color: '#000', padding: '4px 14px' }}
                  >
                    ⚡ Click for 100x Download Speed!
                  </button>
                </div>
              </div>
            )}

            {/* CRISIS 5: STORAGE LOW */}
            {currentCrisis === 'storage_low' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ color: '#800000', fontWeight: 'bold' }}>
                  💾 DISK FULL: 0 KB Remaining on Local Disk C:!
                </div>
                <div style={{ fontSize: '10px', color: '#444' }}>Delete a junk file to make space for the last 1 MB:</div>
                <button
                  className="win-button"
                  onClick={handleDeleteJunkFile}
                  style={{ fontWeight: 'bold', padding: '4px 14px', marginTop: '4px' }}
                >
                  🗑️ Delete temp_kaZaA_junk.tmp (14 MB)
                </button>
              </div>
            )}

            {/* NORMAL STATUS (NO CRISIS) */}
            {currentCrisis === 'none' && (
              <div style={{ textAlign: 'center', color: '#444' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📡</div>
                <div style={{ fontWeight: 'bold' }}>Connection Stable at 53,333 bps...</div>
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  Watch out for incoming phone calls and telephone line interruptions!
                </div>
              </div>
            )}

            {/* CASCADING WINDOWS ERROR POPUPS */}
            {activeErrors.map((err) => (
              <div
                key={err.id}
                className="win-outset"
                style={{
                  position: 'absolute',
                  left: `${err.x}px`,
                  top: `${err.y}px`,
                  width: '230px',
                  backgroundColor: '#c0c0c0',
                  boxShadow: '3px 3px 8px rgba(0,0,0,0.5)',
                  zIndex: 100,
                  padding: '2px'
                }}
              >
                <div className="win-titlebar" style={{ fontSize: '10px' }}>
                  <span>{err.title}</span>
                  <button className="win-titlebar-btn" onClick={() => dismissError(err.id)}>✕</button>
                </div>
                <div style={{ padding: '8px', fontSize: '10px' }}>{err.message}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 6px 6px 6px' }}>
                  <button className="win-button" onClick={() => dismissError(err.id)} style={{ fontSize: '10px' }}>
                    OK
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Status bar */}
          <div className="win-statusbar">
            <div className="win-status-pane">
              Time Survived: <b>{timeSurvived}s</b> | Disconnects Defeated: <b>{disconnectsSurvived}</b>
            </div>
            <div className="win-status-pane" style={{ width: '130px' }}>
              Popups Dismissed: <b>{popupsDismissed}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
