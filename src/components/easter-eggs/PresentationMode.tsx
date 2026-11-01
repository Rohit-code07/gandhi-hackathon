import React, { useEffect } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { soundService } from '../../services/soundService';

interface DemoStep {
  title: string;
  description: string;
  action: () => void;
}

export const PresentationMode: React.FC = () => {
  const {
    presentationModeActive,
    togglePresentationMode,
    presentationStep,
    setPresentationStep,
    showClippy,
    triggerBSOD
  } = useStoryStore();

  const { openWindow } = useWindowStore();
  const { files, resetAll } = useFilesystemStore();

  // Listen for CTRL + SHIFT + H
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
        e.preventDefault();
        togglePresentationMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePresentationMode]);

  const steps: DemoStep[] = [
    {
      title: '1. Welcome & The Abandoned PC Story',
      description: 'An authentic Windows 98 PC discovered after 27 years (1998-2026), belonging to student Alex Sharma.',
      action: () => {
        soundService.playDing();
      }
    },
    {
      title: '2. Explore My Computer & 4.3 GB HDD',
      description: 'Review drive properties for A: (Floppy), C: (Hard Drive), and D: (NFS II CD-ROM).',
      action: () => {
        openWindow('my-computer');
      }
    },
    {
      title: '3. Discover Suspicious Diary & Passwords',
      description: 'Open Alex Sharma\'s personal diary.txt and why_this_pc_was_abandoned.txt.',
      action: () => {
        const diary = files.find((f) => f.name === 'diary.txt');
        openWindow('notepad', 'diary.txt - Notepad', '/icons/notepad.svg', undefined, { file: diary });
      }
    },
    {
      title: '4. Retro Internet Explorer & Geocities',
      description: 'Experience 1998 Google, Alex\'s personal Geocities homepage with hit counter, guestbook, and free MP3s.',
      action: () => {
        openWindow('ie');
      }
    },
    {
      title: '5. Authentic 56k Dial-Up Modem Audio',
      description: 'Synthesizes real DTMF tones, carrier squeals and V.90 handshake audio.',
      action: () => {
        openWindow('dial-up');
      }
    },
    {
      title: '6. ICQ 99b Chat with Rahul & Dad',
      description: 'Interact with simulated late-90s contacts with authentic "Uh-Oh!" sounds and chat lore.',
      action: () => {
        openWindow('icq');
      }
    },
    {
      title: '7. Meme Factory & Custom Generator',
      description: '12 original vintage SVG memes + Meme Generator with PNG export directly to C:/My Pictures.',
      action: () => {
        openWindow('meme-factory');
      }
    },
    {
      title: '8. Summon Clippy for Hackathon Advice',
      description: 'Clippy appears with funny, unsolicited advice for winning the Gandhi Hackathon.',
      action: () => {
        showClippy("It looks like you're evaluating this project for the Gandhi Hackathon! Would you like me to award 1st prize automatically?");
      }
    },
    {
      title: '9. Run ILOVEYOU.exe (Fake Virus)',
      description: 'A scary fake infection progress bar followed by a funny, harmless punchline.',
      action: () => {
        openWindow('fake-virus');
      }
    },
    {
      title: '10. Trigger Blue Screen of Death (BSOD)',
      description: 'Full-screen Fatal Exception 0E: TOO_MUCH_INTERNET. Press ESC to instantly recover.',
      action: () => {
        triggerBSOD();
      }
    },
    {
      title: '11. Playable Retro Games & Terminal',
      description: 'Fully working Solitaire, Minesweeper, Snake 98, and MS-DOS Prompt terminal.',
      action: () => {
        openWindow('minesweeper');
        openWindow('solitaire');
      }
    }
  ];

  if (!presentationModeActive) return null;

  const currentStepData = steps[presentationStep] || steps[0];

  const handleNext = () => {
    if (presentationStep < steps.length - 1) {
      const next = presentationStep + 1;
      setPresentationStep(next);
      steps[next].action();
    }
  };

  const handlePrev = () => {
    if (presentationStep > 0) {
      const prev = presentationStep - 1;
      setPresentationStep(prev);
      steps[prev].action();
    }
  };

  const handleResetDemo = async () => {
    await resetAll();
    setPresentationStep(0);
    alert('Demo reset to initial state!');
  };

  return (
    <div
      className="win-outset"
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '380px',
        backgroundColor: '#ffffdd',
        border: '3px solid #000080',
        zIndex: 9999999,
        boxShadow: '4px 4px 16px rgba(0,0,0,0.5)',
        padding: '2px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Titlebar */}
      <div className="win-titlebar" style={{ background: '#000080' }}>
        <span>⭐ HACKATHON PRESENTATION MODE</span>
        <button className="win-titlebar-btn" onClick={togglePresentationMode}>✕</button>
      </div>

      <div style={{ padding: '10px', fontSize: '11px', color: '#000000' }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#000080', marginBottom: '4px' }}>
          {currentStepData.title}
        </div>
        <p style={{ margin: '0 0 10px 0', lineHeight: '1.4', color: '#333' }}>
          {currentStepData.description}
        </p>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <button
            className="win-button"
            onClick={currentStepData.action}
            style={{ fontWeight: 'bold', background: '#000080', color: '#fff', flex: 1 }}
          >
            ▶ Execute This Step
          </button>
          <button className="win-button" onClick={handleResetDemo} style={{ color: '#800000' }}>
            Reset Demo
          </button>
        </div>

        {/* Step Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ccc', paddingTop: '6px' }}>
          <button
            className="win-button"
            onClick={handlePrev}
            disabled={presentationStep <= 0}
            style={{ minWidth: '60px' }}
          >
            &laquo; Prev
          </button>

          <span style={{ fontWeight: 'bold' }}>
            Step {presentationStep + 1} of {steps.length}
          </span>

          <button
            className="win-button"
            onClick={handleNext}
            disabled={presentationStep >= steps.length - 1}
            style={{ minWidth: '60px' }}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};
