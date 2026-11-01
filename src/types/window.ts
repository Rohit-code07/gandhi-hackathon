export type AppId =
  | 'my-computer'
  | 'file-explorer'
  | 'notepad'
  | 'paint'
  | 'calculator'
  | 'ie'
  | 'outlook'
  | 'icq'
  | 'winamp'
  | 'meme-factory'
  | 'minesweeper'
  | 'solitaire'
  | 'snake'
  | 'terminal'
  | 'control-panel'
  | 'secret-events'
  | 'fake-virus'
  | 'dial-up'
  | 'old-photo';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
  initialData?: any;
}
