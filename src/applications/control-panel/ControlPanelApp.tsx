import React, { useState } from 'react';
import { useSettingsStore, WallpaperId, WallpaperFit, ScreenSaverId } from '../../store/settingsStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useStoryStore } from '../../store/storyStore';

export const ControlPanelApp: React.FC = () => {
  const {
    wallpaper,
    setWallpaper,
    wallpaperFit,
    setWallpaperFit,
    screensaver,
    setScreensaver,
    screensaverTimeout,
    setScreensaverTimeout,
    soundsEnabled,
    setSoundsEnabled,
    randomErrorsEnabled,
    setRandomErrorsEnabled,
    crtFilter,
    setCrtFilter,
    clock24Hour,
    setClock24Hour,
    unlockedWallpapers
  } = useSettingsStore();

  const { resetAll } = useFilesystemStore();
  const { resetDiscoveries } = useStoryStore();

  const [activeTab, setActiveTab] = useState<'display' | 'screensaver' | 'system' | 'sounds'>('display');

  const handleResetSystem = async () => {
    if (confirm('Are you sure you want to restore The Abandoned PC to its original 1998 defaults?')) {
      await resetAll();
      resetDiscoveries();
      alert('System restored to original factory state!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', padding: '4px 6px 0 6px', borderBottom: '1px solid #808080' }}>
        <button
          className={`win-button ${activeTab === 'display' ? 'active' : ''}`}
          onClick={() => setActiveTab('display')}
          style={{ fontWeight: activeTab === 'display' ? 'bold' : 'normal' }}
        >
          🖥️ Display
        </button>
        <button
          className={`win-button ${activeTab === 'screensaver' ? 'active' : ''}`}
          onClick={() => setActiveTab('screensaver')}
          style={{ fontWeight: activeTab === 'screensaver' ? 'bold' : 'normal' }}
        >
          ✨ Screen Saver
        </button>
        <button
          className={`win-button ${activeTab === 'sounds' ? 'active' : ''}`}
          onClick={() => setActiveTab('sounds')}
          style={{ fontWeight: activeTab === 'sounds' ? 'bold' : 'normal' }}
        >
          🔊 Sounds &amp; Errors
        </button>
        <button
          className={`win-button ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
          style={{ fontWeight: activeTab === 'system' ? 'bold' : 'normal' }}
        >
          ⚙️ System
        </button>
      </div>

      {/* Main Tab Body */}
      <div className="win-outset" style={{ flex: 1, margin: '4px', padding: '12px', fontSize: '11px' }}>
        {/* DISPLAY TAB */}
        {activeTab === 'display' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Desktop Wallpaper</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'gandhi', label: 'Gandhi Meme - Aaj Bich Me Koi Nahi Aayega (Hackathon Edition)' },
                  { id: 'teal', label: 'Classic Windows Teal (#008080)' },
                  { id: 'clouds', label: 'Windows Clouds (Gradient Blue)' },
                  { id: 'space', label: 'Retro Space 1998' },
                  { id: 'matrix', label: 'Matrix Code Stream' },
                  { id: 'mystery', label: 'Abandoned Mystery (Unlocked)' }
                ].map((wp) => {
                  const isUnlocked = unlockedWallpapers.includes(wp.id);
                  return (
                    <label key={wp.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="wallpaper"
                        checked={wallpaper === wp.id}
                        disabled={!isUnlocked}
                        onChange={() => setWallpaper(wp.id as WallpaperId)}
                      />
                      <span>
                        {wp.label} {!isUnlocked ? '(Locked - Find Easter Egg)' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Picture Display Mode</legend>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { id: 'contain', label: 'Fit in Frame (Contain - Full Meme Visible)' },
                  { id: 'cover', label: 'Fill Screen (Cover)' },
                  { id: 'stretch', label: 'Stretch to Screen' }
                ].map((mode) => (
                  <label key={mode.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="wallpaperFit"
                      checked={wallpaperFit === mode.id}
                      onChange={() => setWallpaperFit(mode.id as WallpaperFit)}
                    />
                    <span>{mode.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Visual Effects</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={crtFilter}
                  onChange={(e) => setCrtFilter(e.target.checked)}
                />
                <span>Enable CRT Scanline Monitor Effect</span>
              </label>
            </fieldset>
          </div>
        )}

        {/* SCREEN SAVER TAB */}
        {activeTab === 'screensaver' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Screen Saver</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'flying-windows', label: '3D Flying Windows Logo' },
                  { id: 'pipes', label: '3D OpenGL Pipes Simulator' },
                  { id: 'starfield', label: 'Starfield Simulation (Hyperspace)' },
                  { id: 'matrix', label: 'The Matrix Digital Rain' },
                  { id: 'dvd', label: 'Bouncing DVD Video Logo' },
                  { id: 'none', label: '(None)' }
                ].map((ss) => (
                  <label key={ss.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="screensaver"
                      checked={screensaver === ss.id}
                      onChange={() => setScreensaver(ss.id as ScreenSaverId)}
                    />
                    <span>{ss.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label>Wait time before screensaver activation:</label>
              <select
                className="win-inset"
                value={screensaverTimeout}
                onChange={(e) => setScreensaverTimeout(Number(e.target.value))}
                style={{ width: '80px' }}
              >
                <option value={1}>1 minute</option>
                <option value={2}>2 minutes</option>
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
              </select>
            </div>
          </div>
        )}

        {/* SOUNDS & ERRORS TAB */}
        {activeTab === 'sounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Audio Configuration</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={soundsEnabled}
                  onChange={(e) => setSoundsEnabled(e.target.checked)}
                />
                <span>Enable Sound Blaster 16 Synthesizer Audio</span>
              </label>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Random Windows 98 Crashes &amp; Errors</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={randomErrorsEnabled}
                  onChange={(e) => setRandomErrorsEnabled(e.target.checked)}
                />
                <span>Simulate authentic random Windows 98 error popups</span>
              </label>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Taskbar Clock Format</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={clock24Hour}
                  onChange={(e) => setClock24Hour(e.target.checked)}
                />
                <span>Use 24-Hour Time Format</span>
              </label>
            </fieldset>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img src="/icons/my-computer.svg" alt="" style={{ width: '48px', height: '48px' }} />
              <div style={{ lineHeight: '1.5' }}>
                <div><strong>Computer:</strong> GenuineIntel Pentium(R) II 350MHz</div>
                <div><strong>Memory:</strong> 128.0 MB SDRAM</div>
                <div><strong>OS:</strong> Microsoft Windows 98 SE (4.10.2222 A)</div>
                <div><strong>User:</strong> Alex Sharma (Hostel Room 204, 1998-2005)</div>
                <div><strong>Hackathon:</strong> Gandhi Hackathon, IIT Bhilai (2026)</div>
              </div>
            </div>

            <fieldset style={{ border: '1px solid #808080', padding: '10px', marginTop: '10px' }}>
              <legend>Danger Zone</legend>
              <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                Reset virtual files, browser cache, and unlocked story discoveries back to original state.
              </p>
              <button className="win-button" onClick={handleResetSystem} style={{ color: '#a00000' }}>
                Factory Reset Abandoned PC
              </button>
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
};
