import { create } from 'zustand';

export type WallpaperId = 'gandhi' | 'teal' | 'clouds' | 'space' | 'matrix' | 'mystery';
export type WallpaperFit = 'contain' | 'cover' | 'stretch';
export type ScreenSaverId = 'flying-windows' | 'pipes' | 'starfield' | 'matrix' | 'dvd' | 'none';

interface SettingsStoreState {
  wallpaper: WallpaperId;
  wallpaperFit: WallpaperFit;
  customWallpaperUrl: string | null;
  screensaver: ScreenSaverId;
  screensaverTimeout: number; // minutes
  soundsEnabled: boolean;
  randomErrorsEnabled: boolean;
  crtFilter: boolean;
  clock24Hour: boolean;
  unlockedWallpapers: string[];

  setWallpaper: (w: WallpaperId) => void;
  setWallpaperFit: (f: WallpaperFit) => void;
  setCustomWallpaper: (url: string | null) => void;
  setScreensaver: (s: ScreenSaverId) => void;
  setScreensaverTimeout: (mins: number) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setRandomErrorsEnabled: (enabled: boolean) => void;
  setCrtFilter: (enabled: boolean) => void;
  setClock24Hour: (enabled: boolean) => void;
  unlockWallpaper: (w: string) => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => {
  const saved = localStorage.getItem('win98_settings');
  const initial = saved
    ? {
        ...JSON.parse(saved),
        wallpaper: JSON.parse(saved).wallpaper === 'teal' ? 'gandhi' : (JSON.parse(saved).wallpaper || 'gandhi'),
        wallpaperFit: JSON.parse(saved).wallpaperFit || 'contain',
        unlockedWallpapers: Array.from(new Set([...(JSON.parse(saved).unlockedWallpapers || []), 'gandhi', 'teal', 'clouds', 'space']))
      }
    : {
        wallpaper: 'gandhi',
        wallpaperFit: 'contain',
        customWallpaperUrl: null,
        screensaver: 'flying-windows',
        screensaverTimeout: 3,
        soundsEnabled: true,
        randomErrorsEnabled: true,
        crtFilter: false,
        clock24Hour: false,
        unlockedWallpapers: ['gandhi', 'teal', 'clouds', 'space']
      };

  const persist = (next: any) => {
    localStorage.setItem('win98_settings', JSON.stringify(next));
  };

  return {
    ...initial,
    setWallpaper: (wallpaper) =>
      set((state) => {
        const next = { ...state, wallpaper, customWallpaperUrl: null };
        persist(next);
        return { wallpaper, customWallpaperUrl: null };
      }),
    setWallpaperFit: (wallpaperFit) =>
      set((state) => {
        const next = { ...state, wallpaperFit };
        persist(next);
        return { wallpaperFit };
      }),
    setCustomWallpaper: (customWallpaperUrl) =>
      set((state) => {
        const next = { ...state, customWallpaperUrl };
        persist(next);
        return { customWallpaperUrl };
      }),
    setScreensaver: (screensaver) =>
      set((state) => {
        const next = { ...state, screensaver };
        persist(next);
        return { screensaver };
      }),
    setScreensaverTimeout: (screensaverTimeout) =>
      set((state) => {
        const next = { ...state, screensaverTimeout };
        persist(next);
        return { screensaverTimeout };
      }),
    setSoundsEnabled: (soundsEnabled) =>
      set((state) => {
        const next = { ...state, soundsEnabled };
        persist(next);
        return { soundsEnabled };
      }),
    setRandomErrorsEnabled: (randomErrorsEnabled) =>
      set((state) => {
        const next = { ...state, randomErrorsEnabled };
        persist(next);
        return { randomErrorsEnabled };
      }),
    setCrtFilter: (crtFilter) =>
      set((state) => {
        const next = { ...state, crtFilter };
        persist(next);
        return { crtFilter };
      }),
    setClock24Hour: (clock24Hour) =>
      set((state) => {
        const next = { ...state, clock24Hour };
        persist(next);
        return { clock24Hour };
      }),
    unlockWallpaper: (id) =>
      set((state) => {
        if (state.unlockedWallpapers.includes(id)) return state;
        const unlockedWallpapers = [...state.unlockedWallpapers, id];
        const next = { ...state, unlockedWallpapers };
        persist(next);
        return { unlockedWallpapers };
      })
  };
});
