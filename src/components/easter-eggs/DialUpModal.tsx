import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';

export const DialUpModal: React.FC = () => {
  const { unlockDiscovery } = useStoryStore();
  const { closeWindow, getWindowByAppId, openWindow } = useWindowStore();

  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Initializing USRobotics 56k Modem...',
    'Dialing 172222 (BSNL Delhi Gateway)...',
    'Connecting to remote carrier tone...',
    'Negotiating V.90 / K56flex Protocol (56,000 bps)...',
    'Authenticating Username: guest / Password: ***...',
    'Connected to World Wide Web at 53,333 bps!'
  ];

  const startConnection = () => {
    setError(null);
    setStep(0);
    unlockDiscovery('dial-up');
    const stopAudio = soundService.playDialUp();

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < 5) {
        setStep(currentStep);
      } else if (currentStep === 5) {
        // 30% chance of funny error or success
        const shouldFail = Math.random() < 0.35;
        if (shouldFail) {
          clearInterval(interval);
          stopAudio();
          soundService.playError();
          setError('ERROR 678: YOUR INTERNET IS TOO SLOW FOR THIS CENTURY (Or someone picked up the telephone phone downstairs).');
        } else {
          setStep(5);
          clearInterval(interval);
          soundService.playDing();
        }
      }
    }, 1100);
  };

  useEffect(() => {
    startConnection();
  }, []);

  const handleClose = () => {
    const win = getWindowByAppId('dial-up');
    if (win) closeWindow(win.id);
  };

  return (
    <div style={{ padding: '12px', background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column', fontSize: '11px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <img src="/icons/ie.svg" alt="" style={{ width: '40px', height: '40px' }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Connecting to BSNL Internet 1998</div>
          <div style={{ color: '#555' }}>Phone number: 172222 | Modem: COM3 56k</div>
        </div>
      </div>

      {/* Status Box */}
      <div
        className="win-inset"
        style={{
          background: '#ffffff',
          padding: '12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: '8px'
        }}
      >
        {error ? (
          <div style={{ color: '#cc0000', fontWeight: 'bold' }}>
            <div>⚠️ Connection Failed</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>{error}</div>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 'bold', color: step === 5 ? '#008000' : '#000080' }}>
              {steps[step]}
            </div>
            {step < 5 && (
              <div style={{ width: '80%', height: '14px', background: '#eee', border: '1px solid #888' }}>
                <div
                  style={{
                    width: `${(step / 5) * 100}%`,
                    height: '100%',
                    background: '#000080',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            )}
            {step === 5 && (
              <button
                className="win-button"
                onClick={() => {
                  handleClose();
                  openWindow('ie');
                }}
                style={{ fontWeight: 'bold', marginTop: '6px' }}
              >
                Launch Internet Explorer &gt;&gt;
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
        {error && (
          <button className="win-button" onClick={startConnection} style={{ fontWeight: 'bold' }}>
            Redial / Retry
          </button>
        )}
        <button className="win-button" onClick={handleClose}>
          {step === 5 ? 'Done' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};
