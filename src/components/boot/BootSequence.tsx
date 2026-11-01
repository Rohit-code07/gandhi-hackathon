import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(1);
  const [diagLines, setDiagLines] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [username, setUsername] = useState<string>('Guest');
  const [password, setPassword] = useState<string>('********');

  // Stage 1 & 2 & 3 progression
  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => {
        setStage(2);
      }, 1600);
      return () => clearTimeout(timer);
    }

    if (stage === 2) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage(3), 300);
            return 100;
          }
          return prev + 10;
        });
      }, 140);
      return () => clearInterval(interval);
    }

    if (stage === 3) {
      const checks = [
        'Checking Processor..... Intel Pentium II 350MHz [OK]',
        'Checking Memory........ 128 MB SDRAM [OK]',
        'Checking Hard Disk..... 4.3 GB Ultra ATA [OK]',
        'Checking Floppy 3.5"... Found (Empty) [OK]',
        'Checking Sound Blaster. 16-Bit Audio [OK]',
        'Checking 56k Modem..... BSNL Dial-Up Line [CONNECTED]',
        'Checking Hackathon IQ.. CRITICAL OVERFLOW [OK]'
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < checks.length) {
          const next = checks[i];
          setDiagLines((prev) => [...prev, next]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            soundService.playStartup();
            setStage(4); // Login screen
          }, 800);
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundService.playClick();
    onComplete();
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Courier New', Courier, monospace",
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}
    >
      {/* Quick Skip Button */}
      <button
        onClick={onComplete}
        className="win-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000000,
          background: '#c0c0c0',
          color: '#000',
          fontSize: '12px',
          padding: '4px 14px'
        }}
      >
        Skip Boot Sequence &gt;&gt;
      </button>

      {/* STAGE 1: DOS Prompt Boot */}
      {stage === 1 && (
        <div style={{ textAlign: 'left', width: '80%', maxWidth: '700px', fontSize: '15px', lineHeight: '1.6' }}>
          <p>PhoenixBIOS 4.0 Release 6.0</p>
          <p>Copyright 1985-1998 Phoenix Technologies Ltd.</p>
          <p>All Rights Reserved</p>
          <br />
          <p>CPU = Intel Pentium(R) II Processor 350 MHz</p>
          <p>640K System RAM Passed</p>
          <p>130048K Extended RAM Passed</p>
          <br />
          <p style={{ color: '#00ff00' }}>Starting Microsoft(R) Windows 98...</p>
        </div>
      )}

      {/* STAGE 2: Windows 98 Splash & Loading Bar */}
      {stage === 2 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <img src="/icons/win98.svg" alt="Windows 98" style={{ width: '90px', height: '90px' }} />
            <h1
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '36px',
                margin: '12px 0 0 0',
                color: '#ffffff',
                letterSpacing: '1px'
              }}
            >
              Microsoft<span style={{ fontSize: '20px', verticalAlign: 'super' }}>&reg;</span> Windows<span style={{ fontSize: '22px' }}> 98</span>
            </h1>
            <p style={{ color: '#00a4ef', margin: '4px 0 0 0', fontSize: '14px', letterSpacing: '4px' }}>
              SECOND EDITION
            </p>
          </div>

          {/* Retro Animated Loading Bar */}
          <div
            style={{
              width: '320px',
              height: '18px',
              backgroundColor: '#000000',
              border: '2px solid #808080',
              padding: '2px',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #000080 0%, #00a4ef 50%, #ffffff 100%)',
                transition: 'width 0.15s ease-out'
              }}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#aaaaaa' }}>Booting Abandoned PC 1998-2026...</span>
        </div>
      )}

      {/* STAGE 3: Fake Diagnostic Sequence */}
      {stage === 3 && (
        <div
          style={{
            textAlign: 'left',
            width: '85%',
            maxWidth: '680px',
            fontSize: '14px',
            lineHeight: '1.8',
            fontFamily: "'Courier New', Courier, monospace"
          }}
        >
          <h3 style={{ color: '#00ffff', borderBottom: '1px solid #444', paddingBottom: '6px' }}>
            SYSTEM HARDWARE &amp; STORY INTEGRITY DIAGNOSTIC
          </h3>
          {diagLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                color: line.includes('CRITICAL') ? '#ff5555' : line.includes('CONNECTED') ? '#ffff00' : '#00ff66'
              }}
            >
              {line}
            </div>
          ))}
          <p style={{ marginTop: '16px', color: '#888' }}>Initializing GUI desktop subsystems...</p>
        </div>
      )}

      {/* STAGE 4: Windows 98 Login Dialog */}
      {stage === 4 && (
        <div
          className="win-outset"
          style={{
            width: '420px',
            background: '#c0c0c0',
            color: '#000',
            fontFamily: 'Tahoma, sans-serif'
          }}
        >
          {/* Titlebar */}
          <div className="win-titlebar">
            <span>Welcome to Windows</span>
          </div>

          <form onSubmit={handleLogin} style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img
                src="/icons/win98.svg"
                alt="Win98 Keys"
                style={{ width: '48px', height: '48px', flexShrink: 0 }}
              />
              <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Type a user name and password to log on to Windows.</p>
                <p style={{ margin: '4px 0 0 0', color: '#444' }}>Abandoned PC owner: <b>Alex Sharma</b></p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ width: '80px', fontSize: '11px', textAlign: 'right' }}>User name:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ flex: 1, padding: '2px 4px' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ width: '80px', fontSize: '11px', textAlign: 'right' }}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ flex: 1, padding: '2px 4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="submit" className="win-button" style={{ fontWeight: 'bold' }}>
                OK
              </button>
              <button type="button" onClick={() => onComplete()} className="win-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
