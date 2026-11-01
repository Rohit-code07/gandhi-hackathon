import React, { useState } from 'react';
import { useSettingsStore, WallpaperId, ScreenSaverId } from '../../store/settingsStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useStoryStore } from '../../store/storyStore';

export const ControlPanelApp: React.FC = () => {
  const {
    wallpaper,
    setWallpaper,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span>Type:</span>
                <select
                  value={screensaver}
                  onChange={(e) => setScreensaver(e.target.value as ScreenSaverId)}
                  style={{ width: '180px' }}
                >
                  <option value="flying-windows">Flying Windows 98 Logos</option>
                  <option value="pipes">3D Pipes Animation</option>
                  <option value="starfield">Starfield Warp</option>
                  <option value="matrix">Matrix Rain</option>
                  <option value="dvd">Bouncing DVD Logo</option>
                  <option value="none">(None)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Wait:</span>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={screensaverTimeout}
                  onChange={(e) => setScreensaverTimeout(Number(e.target.value))}
                  style={{ width: '50px' }}
                />
                <span>minutes of inactivity</span>
              </div>
            </fieldset>
          </div>
        )}

        {/* SOUNDS & NOTIFICATIONS TAB */}
        {activeTab === 'sounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Sound Effects</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={soundsEnabled}
                  onChange={(e) => setSoundsEnabled(e.target.checked)}
                />
                <span>Enable Windows 98 Chimes &amp; Audio Handshakes</span>
              </label>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Random Events &amp; Quirks</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={randomErrorsEnabled}
                  onChange={(e) => setRandomErrorsEnabled(e.target.checked)}
                />
                <span>Show random quirky Windows popups ("Brain.exe stopped responding")</span>
              </label>
            </fieldset>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Clock Format</legend>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={clock24Hour}
                  onChange={(e) => setClock24Hour(e.target.checked)}
                />
                <span>Use 24-hour military time</span>
              </label>
            </fieldset>

            <fieldset style={{ border: '1px solid #808080', padding: '10px' }}>
              <legend>Factory Reset</legend>
              <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                Restore all deleted files, original notes, and reset discoveries.
              </p>
              <button className="win-button" onClick={handleResetSystem} style={{ color: '#800000', fontWeight: 'bold' }}>
                Restore All Factory Defaults
              </button>
            </fieldset>
          </div>
        )}
      </div>

      {/* Footer OK / Cancel */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', padding: '6px' }}>
        <button className="win-button" style={{ fontWeight: 'bold' }}>
          OK
        </button>
        <button className="win-button">
          Cancel
        </button>
        <button className="win-button">
          Apply
        </button>
      </div>
    </div>
  );
};
