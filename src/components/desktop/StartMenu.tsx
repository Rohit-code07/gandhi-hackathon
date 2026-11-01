import React, { useState } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { useStoryStore } from '../../store/storyStore';
import { useFilesystemStore } from '../../store/filesystemStore';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutDownClick: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutDownClick }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { openWindow } = useWindowStore();
  const { showClippy, triggerBSOD } = useStoryStore();
  const { files } = useFilesystemStore();

  if (!isOpen) return null;

  const handleLaunch = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div
      className="start-menu"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '230px',
        backgroundColor: '#c0c0c0',
        zIndex: 1000000
      }}
    >
      {/* Blue Banner */}
      <div className="start-menu-banner">
        <span>Windows<b>98</b></span>
      </div>

      {/* Main Items */}
      <div className="start-menu-items">
        {/* Programs */}
        <div
          className={`start-menu-item ${activeSubmenu === 'programs' ? 'active' : ''}`}
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <img src="/icons/folder.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>P</u>rograms</span>
          <span className="menu-arrow">&#9658;</span>

          {activeSubmenu === 'programs' && (
            <div className="start-submenu" style={{ width: '210px' }}>
              {/* Accessories */}
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('paint'))}
              >
                <img src="/icons/paint.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Paint</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('notepad'))}
              >
                <img src="/icons/notepad.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Notepad</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('calculator'))}
              >
                <img src="/icons/calculator.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Calculator</span>
              </div>

              <div className="win-dropdown-separator" />

              {/* Games */}
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('papa-aa-gaye'))}
                style={{ fontWeight: 'bold' }}
              >
                <img src="/icons/papa.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Papa Aa Gaye!</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('cyber-cafe'))}
                style={{ fontWeight: 'bold' }}
              >
                <img src="/icons/cyber-cafe.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Cyber Café 2005</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('download-99'))}
                style={{ fontWeight: 'bold' }}
              >
                <img src="/icons/download-99.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>99% Download</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('achievements'))}
              >
                <img src="/icons/achievements.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Game Trophies</span>
              </div>

              <div className="win-dropdown-separator" />

              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('minesweeper'))}
              >
                <img src="/icons/minesweeper.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Minesweeper</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('solitaire'))}
              >
                <img src="/icons/solitaire.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Solitaire</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('snake'))}
              >
                <img src="/icons/snake.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Snake 98</span>
              </div>

              <div className="win-dropdown-separator" />

              {/* Internet & Multimedia */}
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('ie'))}
              >
                <img src="/icons/ie.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Internet Explorer</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('outlook'))}
              >
                <img src="/icons/outlook.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Outlook Express</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('icq'))}
              >
                <img src="/icons/icq.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>ICQ Messenger</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('winamp'))}
              >
                <img src="/icons/winamp.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Winamp</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('meme-factory'))}
              >
                <img src="/icons/meme-factory.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Meme Factory 1998</span>
              </div>

              <div className="win-dropdown-separator" />

              {/* Secret programs */}
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('fake-virus'))}
              >
                <img src="/icons/warning.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>ILOVEYOU.exe</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('terminal'))}
              >
                <img src="/icons/terminal.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>MS-DOS Prompt</span>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <div
          className={`start-menu-item ${activeSubmenu === 'documents' ? 'active' : ''}`}
          onMouseEnter={() => setActiveSubmenu('documents')}
        >
          <img src="/icons/my-documents.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>D</u>ocuments</span>
          <span className="menu-arrow">&#9658;</span>

          {activeSubmenu === 'documents' && (
            <div className="start-submenu" style={{ width: '220px' }}>
              <div
                className="start-menu-item"
                onClick={() =>
                  handleLaunch(() => {
                    const f = files.find((item) => item.name === 'diary.txt');
                    openWindow('notepad', 'diary.txt - Notepad', '/icons/notepad.svg', undefined, { file: f });
                  })
                }
              >
                <img src="/icons/file-text.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>diary.txt</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() =>
                  handleLaunch(() => {
                    const f = files.find((item) => item.name === 'passwords.txt');
                    openWindow('notepad', 'passwords.txt - Notepad', '/icons/notepad.svg', undefined, { file: f });
                  })
                }
              >
                <img src="/icons/file-text.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>passwords.txt</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() =>
                  handleLaunch(() => {
                    const f = files.find((item) => item.name === 'why_this_pc_was_abandoned.txt');
                    openWindow('notepad', 'why_this_pc_was_abandoned.txt', '/icons/notepad.svg', undefined, { file: f });
                  })
                }
              >
                <img src="/icons/file-text.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>why_abandoned.txt</span>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div
          className={`start-menu-item ${activeSubmenu === 'settings' ? 'active' : ''}`}
          onMouseEnter={() => setActiveSubmenu('settings')}
        >
          <img src="/icons/control-panel.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>S</u>ettings</span>
          <span className="menu-arrow">&#9658;</span>

          {activeSubmenu === 'settings' && (
            <div className="start-submenu" style={{ width: '200px' }}>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('control-panel'))}
              >
                <img src="/icons/control-panel.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Control Panel</span>
              </div>
              <div
                className="start-menu-item"
                onClick={() => handleLaunch(() => openWindow('control-panel', 'Display Properties', '/icons/control-panel.svg'))}
              >
                <img src="/icons/control-panel.svg" alt="" style={{ width: '16px', height: '16px' }} />
                <span>Display Properties</span>
              </div>
            </div>
          )}
        </div>

        {/* Find / Search */}
        <div
          className="start-menu-item"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() =>
            handleLaunch(() =>
              openWindow('file-explorer', 'Find: All Files', '/icons/folder.svg', undefined, {
                initialPath: 'C:',
                searchOpen: true
              })
            )
          }
        >
          <img src="/icons/folder.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>F</u>ind...</span>
        </div>

        {/* Help / Clippy */}
        <div
          className="start-menu-item"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() =>
            handleLaunch(() => {
              showClippy("Need help? I'm Clippy, your trusty hackathon companion. Have you tried turning your brain off and on again?");
            })
          }
        >
          <img src="/icons/clippy.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>H</u>elp (Summon Clippy)</span>
        </div>

        {/* Run... */}
        <div
          className="start-menu-item"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch(() => openWindow('terminal'))}
        >
          <img src="/icons/terminal.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span><u>R</u>un (DOS Prompt)...</span>
        </div>

        <div className="win-dropdown-separator" />

        {/* Secret Discoveries */}
        <div
          className="start-menu-item"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch(() => openWindow('secret-events'))}
        >
          <img src="/icons/secret-folder.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span style={{ fontWeight: 'bold', color: '#800000' }}>Secret Discoveries</span>
        </div>

        <div className="win-dropdown-separator" />

        {/* Shut Down */}
        <div
          className="start-menu-item"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            onClose();
            onShutDownClick();
          }}
        >
          <img src="/icons/win98.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <span>Sh<u>u</u>t Down...</span>
        </div>
      </div>
    </div>
  );
};
