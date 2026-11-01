import { create } from 'zustand';

export interface Discovery {
  id: string;
  title: string;
  description: string;
  discovered: boolean;
  discoveredAt?: string;
  hint: string;
}

export const INITIAL_DISCOVERIES: Discovery[] = [
  {
    id: 'diary',
    title: "Read Alex's Personal Diary",
    description: "Discovered the 1998-2003 diary entries in C:/My Documents/diary.txt.",
    discovered: false,
    hint: 'Look in C:/My Documents for diary.txt'
  },
  {
    id: 'secret-folder',
    title: 'Discovered the DO_NOT_OPEN Folder',
    description: 'Found why Alex Sharma abandoned this computer in C:/Secret/DO_NOT_OPEN/.',
    discovered: false,
    hint: 'Explore C:/Secret/DO_NOT_OPEN'
  },
  {
    id: 'fake-virus',
    title: 'Ran ILOVEYOU.exe Virus',
    description: 'Surfaced the scary retro virus modal from C:/Downloads.',
    discovered: false,
    hint: 'Open C:/Downloads/ILOVEYOU.exe'
  },
  {
    id: 'bsod',
    title: 'Experienced Blue Screen of Death',
    description: 'Triggered the fatal exception 0E: TOO_MUCH_INTERNET.',
    discovered: false,
    hint: 'Run "crash" in MS-DOS prompt or press BSOD button'
  },
  {
    id: 'dial-up',
    title: 'Connected via 56k Dial-Up Modem',
    description: 'Heard the authentic synthesized handshake audio and connected to retro web.',
    discovered: false,
    hint: 'Open Internet Explorer or connect via Dial-Up shortcut'
  },
  {
    id: 'icq-chat',
    title: 'Chatted on ICQ 99b',
    description: 'Talked to Rahul_007, HackerBoy, and ComputerDad in 90s chat slang.',
    discovered: false,
    hint: 'Open ICQ Messenger from the desktop'
  },
  {
    id: 'konami',
    title: 'Executed the Konami Code',
    description: 'Entered UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A on desktop.',
    discovered: false,
    hint: 'Press the famous Konami arrow key sequence on your keyboard'
  },
  {
    id: 'meme-generator',
    title: 'Crafted a Meme in Meme Factory',
    description: 'Generated a custom vintage meme with top/bottom captions and exported PNG.',
    discovered: false,
    hint: 'Open Meme Factory on desktop and generate a meme'
  },
  {
    id: 'clippy',
    title: 'Summoned Clippy the Assistant',
    description: 'Received unsolicited hackathon advice from Clippy.',
    discovered: false,
    hint: 'Wait for Clippy to appear or launch from Start Menu'
  },
  {
    id: 'old-photo',
    title: 'Discovered the Old Photo',
    description: 'Looked at the 1998 family photograph in My Pictures.',
    discovered: false,
    hint: 'Open family_trip_1998.bmp in My Pictures'
  },
  {
    id: 'dos-hacker',
    title: 'Used DOS Terminal Hidden Commands',
    description: 'Executed matrix, hack_nasa, or sudo hire_me in MS-DOS prompt.',
    discovered: false,
    hint: 'Launch MS-DOS Prompt and type secret commands'
  },
  {
    id: 'presentation-mode',
    title: 'Activated Hackathon Presentation Mode',
    description: 'Triggered the judges walk-through with CTRL + SHIFT + H.',
    discovered: false,
    hint: 'Press Ctrl + Shift + H anywhere on desktop'
  }
];

interface StoryStoreState {
  discoveries: Discovery[];
  clippyVisible: boolean;
  clippyMessage: string;
  bsodVisible: boolean;
  presentationModeActive: boolean;
  presentationStep: number;
  unlockedCluesCount: number;

  unlockDiscovery: (id: string) => void;
  showClippy: (message?: string) => void;
  hideClippy: () => void;
  triggerBSOD: () => void;
  dismissBSOD: () => void;
  togglePresentationMode: () => void;
  setPresentationStep: (step: number) => void;
  resetDiscoveries: () => void;
}

export const useStoryStore = create<StoryStoreState>((set, get) => {
  const saved = localStorage.getItem('win98_discoveries');
  const initialDiscoveries = saved ? JSON.parse(saved) : INITIAL_DISCOVERIES;

  const countUnlocked = (items: Discovery[]) => items.filter((d) => d.discovered).length;

  return {
    discoveries: initialDiscoveries,
    clippyVisible: false,
    clippyMessage: "It looks like you're trying to win the Gandhi Hackathon! Would you like some unsolicited advice?",
    bsodVisible: false,
    presentationModeActive: false,
    presentationStep: 0,
    unlockedCluesCount: countUnlocked(initialDiscoveries),

    unlockDiscovery: (id) => {
      const { discoveries } = get();
      const updated = discoveries.map((d) =>
        d.id === id && !d.discovered
          ? {
              ...d,
              discovered: true,
              discoveredAt: new Date().toLocaleTimeString()
            }
          : d
      );
      localStorage.setItem('win98_discoveries', JSON.stringify(updated));
      set({
        discoveries: updated,
        unlockedCluesCount: countUnlocked(updated)
      });
    },

    showClippy: (message) => {
      set({
        clippyVisible: true,
        clippyMessage:
          message ||
          "It looks like you're trying to win the Gandhi Hackathon! Would you like me to add 47 unnecessary features?"
      });
      get().unlockDiscovery('clippy');
    },

    hideClippy: () => {
      set({ clippyVisible: false });
    },

    triggerBSOD: () => {
      set({ bsodVisible: true });
      get().unlockDiscovery('bsod');
    },

    dismissBSOD: () => {
      set({ bsodVisible: false });
    },

    togglePresentationMode: () => {
      const current = get().presentationModeActive;
      set({ presentationModeActive: !current, presentationStep: 0 });
      if (!current) {
        get().unlockDiscovery('presentation-mode');
      }
    },

    setPresentationStep: (step) => {
      set({ presentationStep: step });
    },

    resetDiscoveries: () => {
      localStorage.removeItem('win98_discoveries');
      set({
        discoveries: INITIAL_DISCOVERIES,
        unlockedCluesCount: 0
      });
    }
  };
});
