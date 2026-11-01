import { create } from 'zustand';
import { WindowState, AppId } from '../types/window';

interface WindowStoreState {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  openWindow: (
    appId: AppId,
    title?: string,
    icon?: string,
    defaultBounds?: { width?: number; height?: number; x?: number; y?: number },
    initialData?: any
  ) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  isAppOpen: (appId: AppId) => boolean;
  getWindowByAppId: (appId: AppId) => WindowState | undefined;
}

const DEFAULT_APP_CONFIGS: Record<
  AppId,
  { title: string; icon: string; width: number; height: number }
> = {
  'my-computer': {
    title: 'My Computer',
    icon: '/icons/my-computer.svg',
    width: 600,
    height: 420
  },
  'file-explorer': {
    title: 'Windows Explorer',
    icon: '/icons/folder.svg',
    width: 650,
    height: 440
  },
  notepad: {
    title: 'Notepad',
    icon: '/icons/notepad.svg',
    width: 520,
    height: 380
  },
  paint: {
    title: 'Paint',
    icon: '/icons/paint.svg',
    width: 680,
    height: 480
  },
  calculator: {
    title: 'Calculator',
    icon: '/icons/calculator.svg',
    width: 260,
    height: 320
  },
  ie: {
    title: 'Internet Explorer 5.0',
    icon: '/icons/ie.svg',
    width: 780,
    height: 520
  },
  outlook: {
    title: 'Outlook Express',
    icon: '/icons/outlook.svg',
    width: 720,
    height: 460
  },
  icq: {
    title: 'ICQ 99b - Online',
    icon: '/icons/icq.svg',
    width: 320,
    height: 500
  },
  winamp: {
    title: 'Winamp - v2.76',
    icon: '/icons/winamp.svg',
    width: 360,
    height: 400
  },
  'meme-factory': {
    title: 'Meme Factory 1998 & Generator',
    icon: '/icons/meme-factory.svg',
    width: 740,
    height: 520
  },
  minesweeper: {
    title: 'Minesweeper',
    icon: '/icons/minesweeper.svg',
    width: 300,
    height: 380
  },
  solitaire: {
    title: 'Solitaire',
    icon: '/icons/solitaire.svg',
    width: 620,
    height: 460
  },
  snake: {
    title: 'Snake 98',
    icon: '/icons/snake.svg',
    width: 360,
    height: 420
  },
  terminal: {
    title: 'MS-DOS Prompt',
    icon: '/icons/terminal.svg',
    width: 600,
    height: 360
  },
  'control-panel': {
    title: 'Control Panel & Display Properties',
    icon: '/icons/control-panel.svg',
    width: 540,
    height: 420
  },
  'secret-events': {
    title: 'Secret Discoveries Log',
    icon: '/icons/secret-folder.svg',
    width: 480,
    height: 380
  },
  'fake-virus': {
    title: 'SECURITY ALERT: ILOVEYOU.exe',
    icon: '/icons/warning.svg',
    width: 460,
    height: 280
  },
  'dial-up': {
    title: 'Connecting to BSNL Dial-Up...',
    icon: '/icons/ie.svg',
    width: 380,
    height: 260
  },
  'old-photo': {
    title: 'Family Photograph (Nov 1998)',
    icon: '/icons/file-image.svg',
    width: 500,
    height: 400
  }
};

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: 100,

  openWindow: (appId, customTitle, customIcon, defaultBounds, initialData) => {
    const { windows, maxZIndex } = get();
    const config = DEFAULT_APP_CONFIGS[appId];

    // Single instance check for most apps (except notepad or file explorer if opening specific file)
    const existing = windows.find((w) => w.appId === appId && !initialData?.forceNewInstance);
    if (existing) {
      if (existing.isMinimized) {
        set({
          windows: windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  isMinimized: false,
                  zIndex: maxZIndex + 1,
                  initialData: initialData || w.initialData
                }
              : w
          ),
          activeWindowId: existing.id,
          maxZIndex: maxZIndex + 1
        });
      } else {
        set({
          windows: windows.map((w) =>
            w.id === existing.id
              ? {
                  ...w,
                  zIndex: maxZIndex + 1,
                  initialData: initialData || w.initialData
                }
              : w
          ),
          activeWindowId: existing.id,
          maxZIndex: maxZIndex + 1
        });
      }
      return existing.id;
    }

    const nextZ = maxZIndex + 1;
    const count = windows.length;
    // Cascade position
    const offsetX = 50 + (count % 8) * 26;
    const offsetY = 40 + (count % 8) * 26;

    const width = defaultBounds?.width || config?.width || 550;
    const height = defaultBounds?.height || config?.height || 400;
    const x = defaultBounds?.x !== undefined ? defaultBounds.x : Math.min(offsetX, window.innerWidth - width - 20);
    const y = defaultBounds?.y !== undefined ? defaultBounds.y : Math.min(offsetY, window.innerHeight - height - 50);

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appId,
      title: customTitle || config?.title || 'Application',
      icon: customIcon || config?.icon || '/icons/win98.svg',
      x: Math.max(10, x),
      y: Math.max(10, y),
      width,
      height,
      minWidth: 220,
      minHeight: 180,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      initialData
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      maxZIndex: nextZ
    });

    return newWindow.id;
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const remaining = windows.filter((w) => w.id !== id);
    let nextActive = activeWindowId === id ? null : activeWindowId;

    if (activeWindowId === id && remaining.length > 0) {
      // Pick top-most visible remaining window
      const visible = remaining.filter((w) => !w.isMinimized);
      if (visible.length > 0) {
        visible.sort((a, b) => b.zIndex - a.zIndex);
        nextActive = visible[0].id;
      }
    }

    set({
      windows: remaining,
      activeWindowId: nextActive
    });
  },

  minimizeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const updated = windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
    let nextActive = activeWindowId === id ? null : activeWindowId;

    if (activeWindowId === id) {
      const visible = updated.filter((w) => !w.isMinimized);
      if (visible.length > 0) {
        visible.sort((a, b) => b.zIndex - a.zIndex);
        nextActive = visible[0].id;
      }
    }

    set({
      windows: updated,
      activeWindowId: nextActive
    });
  },

  toggleMaximizeWindow: (id) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          const prev = w.prevBounds || { x: 50, y: 50, width: 600, height: 400 };
          return {
            ...w,
            isMaximized: false,
            x: prev.x,
            y: prev.y,
            width: prev.width,
            height: prev.height
          };
        } else {
          // Maximize to full desktop minus taskbar
          return {
            ...w,
            isMaximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 30
          };
        }
      })
    });
  },

  focusWindow: (id) => {
    const { windows, maxZIndex, activeWindowId } = get();
    if (activeWindowId === id) return;
    const nextZ = maxZIndex + 1;
    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w
      ),
      activeWindowId: id,
      maxZIndex: nextZ
    });
  },

  updateWindowPosition: (id, x, y) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, x, y } : w))
    });
  },

  updateWindowSize: (id, width, height) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, width, height } : w))
    });
  },

  isAppOpen: (appId) => {
    return get().windows.some((w) => w.appId === appId && !w.isMinimized);
  },

  getWindowByAppId: (appId) => {
    return get().windows.find((w) => w.appId === appId);
  }
}));
