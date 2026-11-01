import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../../services/soundService';
import { useAchievementsStore } from '../../store/achievementsStore';
import { useWindowStore } from '../../store/windowStore';

type GameMode = 'game' | 'homework';
type DadState = 'away' | 'approaching' | 'at_door' | 'in_room';

const DAD_DIALOGUES_PASS = [
  'Hmm, padhai chal rahi hai... shabash beta.',
  'Sharma ji ka ladka 14 ghante padhta hai, seekho kuch.',
  'Chalo theek hai, IIT Bhilai mein selection hona chahiye.',
  'TV dekhne ja raha hoon, monitor ki brightness kam karo.',
  'Beta, thoda badam khao, dimaag tez hoga.'
];

const MUMMY_DIALOGUES_PASS = [
  'Dekh rahi hoon, monitor garam nahi hai... bach gaye tum.',
  'Dinner garam ho gaya hai, 10 minute mein aao.',
  'Padhai khatam karke doodh peena.'
];

export const PapaAaGayeApp: React.FC = () => {
  const { unlockAchievement } = useAchievementsStore();
  const { openWindow } = useWindowStore();

  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover' | 'victory'>('start');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [currentMode, setCurrentMode] = useState<GameMode>('game');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('win98_papa_highscore') || 0);
  });
  const [level, setLevel] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(30); // seconds per level
  const [suspicion, setSuspicion] = useState<number>(0); // 0 to 100
  const [dadState, setDadState] = useState<DadState>('away');
  const [dadDistance, setDadDistance] = useState<number>(100); // 100 = far, 0 = in room
  const [dadDialogue, setDadDialogue] = useState<string>('');
  const [specialEvent, setSpecialEvent] = useState<string | null>(null);
  const [shoutPromptActive, setShoutPromptActive] = useState<boolean>(false);
  const [keyboardJammed, setKeyboardJammed] = useState<boolean>(false);
  const [screenBlackout, setScreenBlackout] = useState<boolean>(false);

  // Stats for achievements
  const [deceptionsInRow, setDeceptionsInRow] = useState<number>(0);
  const [homeworkSeconds, setHomeworkSeconds] = useState<number>(0);
  const [maxSuspicionSeen, setMaxSuspicionSeen] = useState<number>(0);

  // Mini arcade game inside Game Mode (Dave dodging fire)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const daveXRef = useRef<number>(120);
  const coinsRef = useRef<{ x: number; y: number }[]>([
    { x: 60, y: 50 },
    { x: 180, y: 70 },
    { x: 280, y: 40 }
  ]);
  const fireXRef = useRef<number>(0);

  // Audio helper
  const isMuted = soundService.getMuted();

  const handleStartGame = (diff: 'easy' | 'normal' | 'hard' = difficulty) => {
    setDifficulty(diff);
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTimeRemaining(30);
    setSuspicion(0);
    setDadState('away');
    setDadDistance(100);
    setDadDialogue('');
    setCurrentMode('game');
    setSpecialEvent(null);
    setShoutPromptActive(false);
    setKeyboardJammed(false);
    setScreenBlackout(false);
    setDeceptionsInRow(0);
    setHomeworkSeconds(0);
    setMaxSuspicionSeen(0);
    soundService.playClick();
  };

  // Toggle Mode (SPACE key or Panic Button)
  const toggleMode = () => {
    if (gameState !== 'playing') return;
    if (keyboardJammed) {
      soundService.playError();
      return;
    }
    soundService.playSwitch();
    setCurrentMode((prev) => (prev === 'game' ? 'homework' : 'game'));
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleMode();
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
      } else if (e.key === 'h' || e.key === 'H') {
        if (shoutPromptActive) {
          handleShoutBack();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        daveXRef.current = Math.max(20, daveXRef.current - 25);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        daveXRef.current = Math.min(320, daveXRef.current + 25);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, keyboardJammed, shoutPromptActive]);

  const handleShoutBack = () => {
    soundService.playClick();
    setShoutPromptActive(false);
    setSuspicion((s) => Math.max(0, s - 25));
    setSpecialEvent('Shouted: "Padh raha hoon Papa!" (Dad satisfied)');
    setTimeout(() => setSpecialEvent(null), 2500);
  };

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tickSpeed = difficulty === 'easy' ? 400 : difficulty === 'normal' ? 300 : 220;

    const interval = setInterval(() => {
      // 1. Level Timer
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Level Clear!
          if (level >= 5) {
            // Victory!
            setGameState('victory');
            soundService.playSuccess();
            unlockAchievement('papa-mummy-boss');
            if (maxSuspicionSeen < 50) unlockAchievement('papa-never-caught');
            return 0;
          } else {
            soundService.playDing();
            setLevel((lvl) => lvl + 1);
            setScore((sc) => sc + 200);
            return 30;
          }
        }
        return prev - 1;
      });

      // 2. Score & Suspicion accumulation based on mode
      if (currentMode === 'game') {
        setScore((sc) => {
          const next = sc + (level * 5);
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('win98_papa_highscore', String(next));
          }
          return next;
        });

        // Suspicion increases faster when Dad is approaching
        const suspicionRate = dadState === 'approaching' ? 8 : dadState === 'at_door' ? 18 : 2;
        setSuspicion((s) => {
          const nextS = Math.min(100, s + suspicionRate);
          setMaxSuspicionSeen((m) => Math.max(m, nextS));
          return nextS;
        });
      } else {
        // In Homework mode
        setHomeworkSeconds((s) => {
          const next = s + 1;
          if (next >= 60) unlockAchievement('papa-homework-master');
          return next;
        });
        setSuspicion((s) => Math.max(0, s - 6));
      }

      // 3. Dad Approaching Logic
      if (dadState === 'away') {
        // Chance to start approaching
        const approachChance = (level * 0.08) + (difficulty === 'hard' ? 0.08 : 0.04);
        if (Math.random() < approachChance) {
          setDadState('approaching');
          setDadDistance(80);
          soundService.playFootstep();
        }
      } else if (dadState === 'approaching') {
        soundService.playFootstep();
        setDadDistance((dist) => {
          const nextDist = dist - (difficulty === 'hard' ? 25 : 18);
          if (nextDist <= 30) {
            setDadState('at_door');
            // Trigger Level 3 specific shout prompt
            if (level >= 3 && Math.random() < 0.4 && !shoutPromptActive) {
              setShoutPromptActive(true);
              soundService.playDing();
            }
          }
          return nextDist;
        });
      } else if (dadState === 'at_door') {
        soundService.playFootstep();
        setDadDistance((dist) => {
          const nextDist = dist - (difficulty === 'hard' ? 20 : 15);
          if (nextDist <= 0) {
            // DAD ENTERS ROOM!
            setDadState('in_room');
            checkConfrontation();
          }
          return nextDist;
        });
      }

      // 4. Random Events
      if (Math.random() < 0.04 && !specialEvent) {
        triggerRandomEvent();
      }
    }, tickSpeed);

    return () => clearInterval(interval);
  }, [gameState, currentMode, dadState, level, difficulty, highScore, shoutPromptActive, maxSuspicionSeen]);

  // Handle Confrontation when Dad/Mummy enters
  const checkConfrontation = () => {
    if (currentMode === 'game') {
      // CAUGHT!
      soundService.playGameOver();
      setGameState('gameover');
    } else {
      // PASSED!
      soundService.playSuccess();
      const dialoguePool = level === 5 ? MUMMY_DIALOGUES_PASS : DAD_DIALOGUES_PASS;
      const text = dialoguePool[Math.floor(Math.random() * dialoguePool.length)];
      setDadDialogue(text);

      setScore((sc) => sc + 100);
      setDeceptionsInRow((d) => {
        const next = d + 1;
        if (next >= 5) unlockAchievement('papa-pro-liar');
        return next;
      });

      // Dad leaves after inspection
      setTimeout(() => {
        setDadState('away');
        setDadDistance(100);
        setDadDialogue('');
      }, 2400);
    }
  };

  // Special Events generator
  const triggerRandomEvent = () => {
    const events = ['batti_gul', 'keyboard_jam', 'dad_call', 'assignment'];
    const chosen = events[Math.floor(Math.random() * events.length)];

    if (chosen === 'batti_gul') {
      setScreenBlackout(true);
      setSpecialEvent('⚡ BATTI GUL! Electricity cut for 2 seconds!');
      setTimeout(() => {
        setScreenBlackout(false);
        setSpecialEvent(null);
      }, 2000);
    } else if (chosen === 'keyboard_jam') {
      setKeyboardJammed(true);
      setSpecialEvent('⚠️ KEYBOARD JAM! Use the mouse to click Panic Button!');
      setTimeout(() => {
        setKeyboardJammed(false);
        setSpecialEvent(null);
      }, 3500);
    } else if (chosen === 'dad_call') {
      setSpecialEvent('📢 Dad from hallway: "Ek minute idhar aao!"');
      setTimeout(() => setSpecialEvent(null), 3000);
    } else if (chosen === 'assignment') {
      setSpecialEvent('📚 Physics teacher called: "Assignment complete hua?"');
      setTimeout(() => setSpecialEvent(null), 3000);
    }
  };

  // Canvas Dave / Road Rash Mini-Game loop inside Game Mode
  useEffect(() => {
    if (gameState !== 'playing' || currentMode !== 'game') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const renderMiniGame = () => {
      // Sky & ground
      ctx.fillStyle = '#000033';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#555555';
      ctx.fillRect(0, 110, canvas.width, 50);

      // Road dashes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.fillRect((i + fireXRef.current) % canvas.width, 132, 16, 4);
      }
      fireXRef.current = (fireXRef.current + 4) % canvas.width;

      // Draw Dangerous Dave / Bike
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(daveXRef.current, 100, 24, 20);
      // Wheels
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(daveXRef.current + 4, 122, 6, 0, Math.PI * 2);
      ctx.arc(daveXRef.current + 20, 122, 6, 0, Math.PI * 2);
      ctx.fill();

      // Collectible Floppy disks / coins
      coinsRef.current.forEach((coin, idx) => {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(coin.x, coin.y + 40, 10, 10);
        // Collision with player
        if (Math.abs(coin.x - daveXRef.current) < 18) {
          coin.x = Math.random() * 320;
          setScore((sc) => sc + 25);
        }
      });

      // Retro score label
      ctx.fillStyle = '#00ff00';
      ctx.font = '10px monospace';
      ctx.fillText('ROAD RASH 98 [RUNNING]', 8, 16);
      ctx.fillText('ARROW KEYS / A-D TO STEER', 8, 30);

      animId = requestAnimationFrame(renderMiniGame);
    };

    renderMiniGame();
    return () => cancelAnimationFrame(animId);
  }, [gameState, currentMode]);

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
        overflow: 'hidden'
      }}
    >
      {/* Blackout Flicker Effect */}
      {screenBlackout && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '18px',
            fontFamily: 'monospace'
          }}
        >
          ⚡ BATTI GUL... (POWER OUTAGE) ⚡
        </div>
      )}

      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={() => handleStartGame('normal')}><u>N</u>ew Game</div>
        <div className="win-menu-item" onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}>
          {gameState === 'paused' ? '▶ <u>R</u>esume' : '⏸ <u>P</u>ause'}
        </div>
        <div className="win-menu-item" onClick={() => openWindow('achievements')}>
          🏆 <u>A</u>chievements
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', fontSize: '11px', paddingRight: '6px' }}>
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
            background: 'linear-gradient(135deg, #102040 0%, #203a60 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <img src="/icons/papa.svg" alt="" style={{ width: '64px', height: '64px', marginBottom: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '26px', color: '#ffdd00', textShadow: '2px 2px #000' }}>
            PAPA AA GAYE!
          </h1>
          <p style={{ margin: '4px 0 16px 0', fontSize: '12px', color: '#a0c0e0' }}>
            Indian Student Stealth &amp; Reflex Simulator (1998)
          </p>

          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid #6080a0',
              padding: '12px',
              maxWidth: '480px',
              fontSize: '11px',
              lineHeight: '1.6',
              textAlign: 'left',
              marginBottom: '16px'
            }}
          >
            <b>MISSION:</b>
            <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>
              <li>Play games secretly to rack up score points.</li>
              <li>Listen for Dad's heavy footsteps approaching down the hallway.</li>
              <li>Press <b>SPACEBAR</b> to instantly switch to <i>Homework Mode</i>!</li>
              <li>If Dad catches you playing games, your gaming career is OVER.</li>
              <li>Survive 5 levels to face the Final Boss: <b>MUMMY</b>!</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px' }}>Select Difficulty:</span>
            {(['easy', 'normal', 'hard'] as const).map((d) => (
              <button
                key={d}
                className={`win-button ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
                style={{ textTransform: 'capitalize', fontWeight: difficulty === d ? 'bold' : 'normal' }}
              >
                {d === 'easy' ? 'Casual' : d === 'normal' ? 'Hostel Pro' : 'Board Exam'}
              </button>
            ))}
          </div>

          <button
            className="win-button"
            onClick={() => handleStartGame(difficulty)}
            style={{ fontWeight: 'bold', fontSize: '13px', padding: '6px 24px', backgroundColor: '#ffd700', color: '#000' }}
          >
            ▶ START GAME
          </button>
        </div>
      )}

      {/* PAUSED SCREEN */}
      {gameState === 'paused' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <h2>GAME PAUSED</h2>
          <button className="win-button" onClick={() => setGameState('playing')} style={{ fontWeight: 'bold', padding: '4px 18px' }}>
            Resume (P)
          </button>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === 'gameover' && (
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
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🩴💥</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#ffff00' }}>PAPA NE PAKAD LIYA!</h2>
          <p style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '6px' }}>
            "Congratulations! Your gaming career has ended."
          </p>
          <p style={{ fontSize: '12px', color: '#f0c0c0', maxWidth: '400px' }}>
            "Padhai ki umar mein Road Rash?! Kal se coaching class subah 5 baje!"
          </p>

          <div
            className="win-outset"
            style={{
              padding: '10px 20px',
              backgroundColor: '#c0c0c0',
              color: '#000',
              margin: '14px 0',
              fontSize: '12px'
            }}
          >
            <div>Final Score: <b>{score}</b></div>
            <div>Reached Level: <b>{level} / 5</b></div>
            <div>Personal Best: <b>{highScore}</b></div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="win-button" onClick={() => handleStartGame(difficulty)} style={{ fontWeight: 'bold' }}>
              🔄 Try Again
            </button>
            <button className="win-button" onClick={() => setGameState('start')}>
              Main Menu
            </button>
            <button className="win-button" onClick={() => openWindow('achievements')}>
              View High Score &amp; Trophies
            </button>
          </div>
        </div>
      )}

      {/* VICTORY SCREEN */}
      {gameState === 'victory' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            background: 'linear-gradient(135deg, #004d00 0%, #008000 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆🎓</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#ffff00' }}>BOARD EXAM CLEARED WITH 98%!</h2>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>
            You defeated the Final Boss (MUMMY) and proved your stealth supremacy!
          </p>
          <div
            className="win-outset"
            style={{
              padding: '10px 24px',
              backgroundColor: '#c0c0c0',
              color: '#000',
              margin: '14px 0',
              fontSize: '12px'
            }}
          >
            <div>Grand Score: <b>{score}</b></div>
            <div>Honor Title: <b>National Level Secret Gamer</b></div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="win-button" onClick={() => handleStartGame(difficulty)} style={{ fontWeight: 'bold' }}>
              Play Again
            </button>
            <button className="win-button" onClick={() => openWindow('achievements')}>
              View Trophies
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px', gap: '4px' }}>
          {/* Top Status HUD */}
          <div
            className="win-outset"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: '#d8d8d8'
            }}
          >
            <div>
              Level: <b>{level} / 5</b> ({level === 5 ? 'MUMMY FINAL BOSS' : `Stage ${level}`})
            </div>
            <div>Score: <b style={{ color: '#000080' }}>{score}</b></div>
            <div>Time Left: <b>{timeRemaining}s</b></div>

            {/* Suspicion Meter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Suspicion:</span>
              <div style={{ width: '90px', height: '14px', background: '#fff', border: '1px solid #808080', padding: '1px' }}>
                <div
                  style={{
                    width: `${suspicion}%`,
                    height: '100%',
                    backgroundColor: suspicion > 70 ? '#ff0000' : suspicion > 40 ? '#ffaa00' : '#00aa00',
                    transition: 'width 0.2s ease'
                  }}
                />
              </div>
              <span style={{ fontWeight: 'bold', width: '32px' }}>{suspicion}%</span>
            </div>
          </div>

          {/* Main Visual Arena (Split: Left is Computer Screen, Right is Room / Door Area) */}
          <div style={{ flex: 1, display: 'flex', gap: '4px', overflow: 'hidden' }}>
            {/* The Computer Screen being played */}
            <div
              className="win-inset"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: currentMode === 'game' ? '#111' : '#ffffff',
                padding: '4px',
                position: 'relative'
              }}
            >
              {/* Virtual App Header */}
              <div
                className="win-titlebar"
                style={{
                  background: currentMode === 'game' ? 'linear-gradient(90deg, #800000, #ff0000)' : 'linear-gradient(90deg, #000080, #1084d0)'
                }}
              >
                <span>
                  {currentMode === 'game'
                    ? '🎮 Dangerous Dave & Road Rash 98 - [ACTIVE GAME]'
                    : '📄 Microsoft Word - NCERT_Physics_Notes.doc (Studying)'}
                </span>
                <span style={{ fontSize: '9px' }}>Mode: {currentMode.toUpperCase()}</span>
              </div>

              {/* GAME MODE VIEW */}
              {currentMode === 'game' ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <canvas ref={canvasRef} width={340} height={170} style={{ border: '2px solid #555' }} />
                  <div style={{ color: '#00ff00', fontSize: '11px', marginTop: '6px', textAlign: 'center' }}>
                    *EARNING POINTS FAST* | Press <b>SPACE</b> to switch to Homework!
                  </div>
                </div>
              ) : (
                /* HOMEWORK MODE VIEW */
                <div
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: '11px',
                    color: '#000000',
                    lineHeight: '1.5',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold' }}>
                    NCERT PHYSICS - CHAPTER 4: LAWS OF MOTION &amp; KINEMATICS
                  </div>
                  <p>1. Newton's First Law of Inertia:</p>
                  <p style={{ color: '#000080', marginLeft: '12px' }}>
                    "A student shall continue in a state of rest (sleeping) unless acted upon by an external unbalanced force (Dad's angry voice)."
                  </p>
                  <p>2. Thermodynamics of the Examination Hall:</p>
                  <p style={{ color: '#000080', marginLeft: '12px' }}>
                    dE = Q - W where W = Work done trying to hide Road Rash 98.
                  </p>
                  <p>3. Derivation of Kinetic Energy: E = ½ m v²</p>
                  <div style={{ background: '#eef', padding: '6px', border: '1px dashed #99a', marginTop: '8px' }}>
                    Status: Dad thinks you are studying diligently. Suspicion dropping rapidly...
                  </div>
                </div>
              )}
            </div>

            {/* Room / Door & Footstep Surveillance Panel */}
            <div
              className="win-outset"
              style={{
                width: '210px',
                display: 'flex',
                flexDirection: 'column',
                padding: '6px',
                gap: '8px',
                backgroundColor: '#d0d0d0'
              }}
            >
              {/* Door Visual */}
              <div
                className="win-inset"
                style={{
                  height: '140px',
                  backgroundColor: '#7b4b28',
                  border: '3px solid #3d2412',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Door Knocker */}
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #ffd700', margin: '4px 0' }} />

                {/* State of Door */}
                {dadState === 'away' && (
                  <div style={{ color: '#fff', fontSize: '10px', textAlign: 'center' }}>
                    🚪 Door Closed<br />(Hallway Quiet)
                  </div>
                )}
                {dadState === 'approaching' && (
                  <div style={{ color: '#ffff00', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', animation: 'pulse 0.5s infinite' }}>
                    👣 FOOTSTEPS!<br />*thump... thump...*
                  </div>
                )}
                {dadState === 'at_door' && (
                  <div style={{ color: '#ff4444', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', animation: 'shake 0.3s infinite' }}>
                    ⚠️ DOOR CREAKING!<br />DAD AT THE DOOR!
                  </div>
                )}
                {dadState === 'in_room' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/icons/papa.svg" alt="" style={{ width: '48px', height: '48px' }} />
                    <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '10px' }}>
                      {level === 5 ? 'MUMMY IS WATCHING' : 'DAD IN ROOM'}
                    </div>
                  </div>
                )}
              </div>

              {/* Dialogue Bubble when Dad checks */}
              {dadDialogue && (
                <div
                  className="win-outset"
                  style={{
                    backgroundColor: '#ffffdd',
                    border: '1px solid #aa0',
                    padding: '6px',
                    fontSize: '10px',
                    color: '#800000',
                    fontWeight: 'bold',
                    lineHeight: '1.3'
                  }}
                >
                  "{dadDialogue}"
                </div>
              )}

              {/* Level 3 Shout Back Button Prompt */}
              {shoutPromptActive && (
                <button
                  className="win-button"
                  onClick={handleShoutBack}
                  style={{
                    background: '#ff0000',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    padding: '4px',
                    animation: 'pulse 0.5s infinite'
                  }}
                >
                  🗣️ Shout "Padh raha hoon!" (Press H)
                </button>
              )}

              {/* Big Panic Switch Button */}
              <button
                className="win-button"
                onClick={toggleMode}
                style={{
                  marginTop: 'auto',
                  height: '42px',
                  backgroundColor: currentMode === 'game' ? '#ff3333' : '#33cc33',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  boxShadow: 'inset 2px 2px 0 #fff, inset -2px -2px 0 #000'
                }}
              >
                {currentMode === 'game' ? '🚨 PANIC! HIDE GAME (SPACE)' : '🎮 RESUME GAME (SPACE)'}
              </button>
            </div>
          </div>

          {/* Random Event Banner */}
          {specialEvent && (
            <div
              style={{
                backgroundColor: '#ffff00',
                color: '#000000',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                border: '1px solid #990',
                textAlign: 'center'
              }}
            >
              {specialEvent}
            </div>
          )}

          {/* Bottom Status bar */}
          <div className="win-statusbar">
            <div className="win-status-pane">
              Mode: <b>{currentMode === 'game' ? 'GAMING (Points Accumulating)' : 'HOMEWORK (Safe)'}</b>
            </div>
            <div className="win-status-pane" style={{ width: '130px' }}>
              Dad Distance: {dadDistance}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
