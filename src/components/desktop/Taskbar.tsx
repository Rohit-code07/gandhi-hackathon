import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useStoryStore } from '../../store/storyStore';
import { soundService } from '../../services/soundService';

interface TaskbarProps {
  onStartClick: () => void;
  isStartOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ onStartClick, isStartOpen }) => {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowStore();
  const { soundsEnabled, setSoundsEnabled, clock24Hour } = useSettingsStore();
  const { togglePresentationMode, presentationModeActive } = useStoryStore();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (clock24Hour) {
        setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      } else {
        setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clock24Hour]);

  const handleTaskClick = (winId: string) => {
    soundService.playClick();
    if (activeWindowId === winId) {
      // If currently active, clicking minimizes it
      minimizeWindow(winId);
    } else {
      focusWindow(winId);
    }
  };

  const toggleSound = () => {
    const next = !soundsEnabled;
    setSoundsEnabled(next);
    soundService.setMuted(!next);
    if (next) soundService.playDing();
  };

  return (
    <div className="taskbar">
      {/* Start Button */}
      <button
        className={`win-button start-button ${isStartOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <img src="/icons/win98.svg" alt="Start" />
        <span>Start</span>
      </button>

      <div className="taskbar-divider" />

      {/* Taskbar Application Buttons */}
      <div className="taskbar-tasks">
        {windows.map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <button
              key={win.id}
              className={`win-button taskbar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTaskClick(win.id)}
              title={win.title}
            >
              <img
                src={win.icon}
                alt=""
                style={{ width: '16px', height: '16px', imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {win.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="taskbar-tray">
        {/* Presentation Mode Quick Button */}
        <button
          className="win-button"
          onClick={togglePresentationMode}
          title="Toggle Hackathon Presentation Mode (Ctrl+Shift+H)"
          style={{
            minWidth: 'auto',
            padding: '1px 5px',
            height: '18px',
            fontSize: '10px',
            background: presentationModeActive ? '#ffeb3b' : '#c0c0c0',
            fontWeight: 'bold'
          }}
        >
          {presentationModeActive ? '⭐ DEMO' : 'DEMO'}
        </button>

        {/* Volume Speaker Icon */}
        <img
          src={soundsEnabled ? '/icons/file-audio.svg' : '/icons/warning.svg'}
          alt="Sound"
          className="tray-icon"
          onClick={toggleSound}
          title={soundsEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        />

        {/* Digital Clock */}
        <span style={{ fontSize: '11px', fontWeight: '500', minWidth: '55px', textAlign: 'center' }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
};
