import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';
import { soundService } from '../../services/soundService';

export const FakeVirusModal: React.FC = () => {
  const { unlockDiscovery } = useStoryStore();
  const { closeWindow, getWindowByAppId } = useWindowStore();

  const [stage, setStage] = useState<'warning' | 'progress' | 'punchline'>('warning');
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Corrupting system files...');

  useEffect(() => {
    unlockDiscovery('fake-virus');
    soundService.playError();
  }, [unlockDiscovery]);

  useEffect(() => {
    if (stage === 'progress') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('punchline'), 500);
            return 100;
          }
          if (prev === 30) setStatusText('Deleting System32...');
          if (prev === 60) setStatusText('Overheating Pentium II processor...');
          if (prev === 85) setStatusText('Transmitting browser history to parents...');
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStartInfection = () => {
    setStage('progress');
  };

  const handleClose = () => {
    const win = getWindowByAppId('fake-virus');
    if (win) closeWindow(win.id);
  };

  return (
    <div style={{ padding: '12px', background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {stage === 'warning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src="/icons/warning.svg" alt="" style={{ width: '48px', height: '48px' }} />
            <div>
              <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '13px' }}>
                SECURITY CRITICAL: YOUR COMPUTER HAS BEEN INFECTED!
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                Trojan.ILOVEYOU-1998 detected in C:/Downloads/ILOVEYOU.exe.
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', background: '#ffffff', padding: '8px', border: '1px solid #808080' }}>
            Threat Level: MAXIMUM<br />
            Estimated Damage: 100% of all floppy disks within a 5-mile radius.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button className="win-button" onClick={handleStartInfection} style={{ fontWeight: 'bold', color: '#ff0000' }}>
              Run Antivirus / Clean Now
            </button>
            <button className="win-button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {stage === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ fontWeight: 'bold', color: '#aa0000', fontSize: '12px' }}>
            {statusText}
          </div>
          <div style={{ width: '100%', height: '20px', background: '#ffffff', border: '2px solid #808080', padding: '2px' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#000080',
                transition: 'width 0.1s linear'
              }}
            />
          </div>
          <div style={{ fontSize: '11px' }}>{progress}% Complete</div>
        </div>
      )}

      {stage === 'punchline' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>😂</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#008000' }}>
            Relax. Even this virus is unemployed.
          </div>
          <p style={{ fontSize: '11px', color: '#555', margin: 0, maxWidth: '340px' }}>
            Your computer is 100% safe! This was an Easter egg written by Alex Sharma back in 2001. No actual files were touched.
          </p>
          <button className="win-button" onClick={handleClose} style={{ fontWeight: 'bold', padding: '4px 16px', marginTop: '6px' }}>
            Close &amp; Keep Exploring
          </button>
        </div>
      )}
    </div>
  );
};
