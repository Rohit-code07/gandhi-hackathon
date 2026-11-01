import React, { useState, useEffect } from 'react';
import { DesktopIcon, DesktopShortcut } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { soundService } from '../../services/soundService';

const DEFAULT_SHORTCUTS: DesktopShortcut[] = [
  { id: 'sc-computer', appId: 'my-computer', title: 'My Computer', icon: '/icons/my-computer.svg', initialX: 16, initialY: 16, action: () => {} },
  { id: 'sc-documents', appId: 'file-explorer', title: 'My Documents', icon: '/icons/my-documents.svg', initialX: 16, initialY: 96, action: () => {} },
  { id: 'sc-ie', appId: 'ie', title: 'Internet Explorer', icon: '/icons/ie.svg', initialX: 16, initialY: 176, action: () => {} },
  { id: 'sc-recycle', appId: 'file-explorer', title: 'Recycle Bin', icon: '/icons/recycle-full.svg', initialX: 16, initialY: 256, action: () => {} },
  { id: 'sc-paint', appId: 'paint', title: 'Paint', icon: '/icons/paint.svg', initialX: 16, initialY: 336, action: () => {} },
  { id: 'sc-notepad', appId: 'notepad', title: 'Notepad', icon: '/icons/notepad.svg', initialX: 16, initialY: 416, action: () => {} },
  { id: 'sc-meme', appId: 'meme-factory', title: 'Meme Factory', icon: '/icons/meme-factory.svg', initialX: 16, initialY: 496, action: () => {} },

  // Column 2
  { id: 'sc-minesweeper', appId: 'minesweeper', title: 'Minesweeper', icon: '/icons/minesweeper.svg', initialX: 104, initialY: 16, action: () => {} },
  { id: 'sc-solitaire', appId: 'solitaire', title: 'Solitaire', icon: '/icons/solitaire.svg', initialX: 104, initialY: 96, action: () => {} },
  { id: 'sc-snake', appId: 'snake', title: 'Snake 98', icon: '/icons/snake.svg', initialX: 104, initialY: 176, action: () => {} },
  { id: 'sc-winamp', appId: 'winamp', title: 'Winamp', icon: '/icons/winamp.svg', initialX: 104, initialY: 256, action: () => {} },
  { id: 'sc-icq', appId: 'icq', title: 'ICQ 99b', icon: '/icons/icq.svg', initialX: 104, initialY: 336, action: () => {} },
  { id: 'sc-outlook', appId: 'outlook', title: 'Outlook Express', icon: '/icons/outlook.svg', initialX: 104, initialY: 416, action: () => {} },
  { id: 'sc-terminal', appId: 'terminal', title: 'MS-DOS Prompt', icon: '/icons/terminal.svg', initialX: 104, initialY: 496, action: () => {} },

  // Column 3
  { id: 'sc-games', appId: 'file-explorer', title: 'Games', icon: '/icons/games-folder.svg', initialX: 192, initialY: 16, action: () => {} },
  { id: 'sc-papa', appId: 'papa-aa-gaye', title: 'Papa Aa Gaye!', icon: '/icons/papa.svg', initialX: 192, initialY: 96, action: () => {} },
  { id: 'sc-cybercafe', appId: 'cyber-cafe', title: 'Cyber Cafe', icon: '/icons/cyber-cafe.svg', initialX: 192, initialY: 176, action: () => {} },
  { id: 'sc-download99', appId: 'download-99', title: '99% Download', icon: '/icons/download-99.svg', initialX: 192, initialY: 256, action: () => {} },
  { id: 'sc-secret', appId: 'file-explorer', title: 'Secret Folder', icon: '/icons/secret-folder.svg', initialX: 192, initialY: 336, action: () => {} },
  { id: 'sc-pictures', appId: 'file-explorer', title: 'My Pictures', icon: '/icons/my-pictures.svg', initialX: 192, initialY: 416, action: () => {} },
  { id: 'sc-control', appId: 'control-panel', title: 'Control Panel', icon: '/icons/control-panel.svg', initialX: 192, initialY: 496, action: () => {} }
];

export const Desktop: React.FC = () => {
  const { openWindow } = useWindowStore();
  const { wallpaper, crtFilter } = useSettingsStore();
  const { createFile, createFolder, clipboard, pasteClipboard } = useFilesystemStore();

  const [shortcuts, setShortcuts] = useState<DesktopShortcut[]>(() => {
    const saved = localStorage.getItem('win98_desktop_shortcuts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return DEFAULT_SHORTCUTS.map((s) => {
          const match = parsed.find((p: any) => p.id === s.id);
          return match ? { ...s, initialX: match.x, initialY: match.y } : s;
        });
      } catch (e) {}
    }
    return DEFAULT_SHORTCUTS;
  });

  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Keyboard events: F5 refresh, Escape close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleRefresh();
      } else if (e.key === 'Escape') {
        setIsStartOpen(false);
        setContextMenuPos(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShortcutOpen = (sc: DesktopShortcut) => {
    soundService.playClick();
    if (sc.id === 'sc-documents') {
      openWindow('file-explorer', 'My Documents', '/icons/my-documents.svg', undefined, { initialPath: 'C:/My Documents' });
    } else if (sc.id === 'sc-games') {
      openWindow('file-explorer', 'Games', '/icons/games-folder.svg', undefined, { initialPath: 'C:/Games' });
    } else if (sc.id === 'sc-recycle') {
      openWindow('file-explorer', 'Recycle Bin', '/icons/recycle-full.svg', undefined, { initialPath: 'C:/Recycle Bin' });
    } else if (sc.id === 'sc-secret') {
      openWindow('file-explorer', 'C:/Secret/DO_NOT_OPEN', '/icons/secret-folder.svg', undefined, { initialPath: 'C:/Secret/DO_NOT_OPEN' });
    } else if (sc.id === 'sc-pictures') {
      openWindow('file-explorer', 'My Pictures', '/icons/my-pictures.svg', undefined, { initialPath: 'C:/My Pictures' });
    } else {
      openWindow(sc.appId as any);
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, initialX: x, initialY: y } : s));
    setShortcuts(updated);
    const saveList = updated.map((s) => ({ id: s.id, x: s.initialX, y: s.initialY }));
    localStorage.setItem('win98_desktop_shortcuts', JSON.stringify(saveList));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setIsStartOpen(false);
  };

  const handleRefresh = () => {
    soundService.playClick();
    setSelectedIconId(null);
  };

  const handleNewFolder = async () => {
    const name = prompt('Enter folder name:', 'New Folder');
    if (name) {
      await createFolder('C:/My Documents', name);
      alert(`Folder created at C:/My Documents/${name}!`);
    }
  };

  const handleNewFile = async () => {
    const name = prompt('Enter document name:', 'Note.txt');
    if (name) {
      await createFile('C:/My Documents', name, '');
      alert(`Document created at C:/My Documents/${name}!`);
    }
  };

  const getWallpaperBackground = () => {
    switch (wallpaper) {
      case 'clouds':
        return 'linear-gradient(180deg, #1084d0 0%, #70b0e0 40%, #ffffff 100%)';
      case 'space':
        return 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)';
      case 'matrix':
        return '#001100';
      case 'mystery':
        return 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)';
      case 'teal':
      default:
        return '#008080';
    }
  };

  return (
    <div
      className="desktop-container"
      style={{ background: getWallpaperBackground() }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setSelectedIconId(null);
        setIsStartOpen(false);
        setContextMenuPos(null);
      }}
    >
      {/* CRT Scanline Overlay */}
      {crtFilter && <div className="crt-overlay" />}

      {/* Desktop Workspace */}
      <div className="desktop-workspace">
        {shortcuts.map((sc) => (
          <DesktopIcon
            key={sc.id}
            shortcut={sc}
            isSelected={selectedIconId === sc.id}
            onSelect={() => setSelectedIconId(sc.id)}
            onOpen={() => handleShortcutOpen(sc)}
            onPositionChange={handlePositionChange}
          />
        ))}
      </div>

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onShutDownClick={() => {
          if (confirm('Are you sure you want to shut down Windows 98?')) {
            window.location.reload();
          }
        }}
      />

      {/* Desktop Right-Click Context Menu */}
      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setContextMenuPos(null)}
          onRefresh={handleRefresh}
          onNewTextFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onOpenProperties={() => openWindow('control-panel', 'Display Properties', '/icons/control-panel.svg')}
          onPaste={() => pasteClipboard('C:/My Documents')}
          hasClipboard={!!clipboard}
        />
      )}

      {/* Bottom Taskbar */}
      <Taskbar
        onStartClick={() => setIsStartOpen((prev) => !prev)}
        isStartOpen={isStartOpen}
      />
    </div>
  );
};
