import { create } from 'zustand';
import { soundService } from '../services/soundService';

export interface GameAchievement {
  id: string;
  game: 'papa' | 'cafe' | 'download';
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}

export const INITIAL_ACHIEVEMENTS: GameAchievement[] = [
  // Papa Aa Gaye
  {
    id: 'papa-never-caught',
    game: 'papa',
    title: 'Never Caught',
    description: 'Survive a full inspection without raising suspicion over 50%.',
    unlocked: false,
    icon: '🕶️'
  },
  {
    id: 'papa-mummy-boss',
    game: 'papa',
    title: "Mummy's Final Boss",
    description: 'Survive Level 5 when Mummy inspects the room with her chappal.',
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'papa-homework-master',
    game: 'papa',
    title: 'Homework Master',
    description: 'Score 1,000+ points and convince Dad you are preparing for IIT JEE.',
    unlocked: false,
    icon: '📚'
  },
  {
    id: 'papa-pro-liar',
    game: 'papa',
    title: 'Professional Liar',
    description: 'Successfully deceive Dad 5 times in a single gaming session.',
    unlocked: false,
    icon: '🎭'
  },

  // Cyber Cafe
  {
    id: 'cafe-first-1000',
    game: 'cafe',
    title: 'First ₹1000 Earned',
    description: 'Accumulate ₹1,000 in your cyber café cash register.',
    unlocked: false,
    icon: '💵'
  },
  {
    id: 'cafe-king',
    game: 'cafe',
    title: 'Internet Cafe King',
    description: 'Survive Day 5 with >₹2,500 cash and high customer satisfaction.',
    unlocked: false,
    icon: '🏆'
  },
  {
    id: 'cafe-100-customers',
    game: 'cafe',
    title: '100 Happy Customers',
    description: 'Serve 20+ customers satisfactorily without system crashes.',
    unlocked: false,
    icon: '⭐'
  },
  {
    id: 'cafe-dialup-survivor',
    game: 'cafe',
    title: 'Dial-Up Survivor',
    description: 'Complete an entire business day on 56k dial-up without riots.',
    unlocked: false,
    icon: '📞'
  },

  // 99% Download
  {
    id: 'dl-finally-done',
    game: 'download',
    title: 'Finally Downloaded',
    description: 'Reach 100.0% completion on movie_final_REAL_final.avi.',
    unlocked: false,
    icon: '💾'
  },
  {
    id: 'dl-99-survivor',
    game: 'download',
    title: '99% Survivor',
    description: 'Survive 8 or more connection catastrophes during the download.',
    unlocked: false,
    icon: '🛡️'
  },
  {
    id: 'dl-modem-master',
    game: 'download',
    title: 'Modem Master',
    description: 'Reconnect within 1.5 seconds of an incoming landline phone call.',
    unlocked: false,
    icon: '⚡'
  },
  {
    id: 'dl-27-years',
    game: 'download',
    title: '27 Years Later',
    description: 'Open the 700 MB downloaded video and discover the truth.',
    unlocked: false,
    icon: '🎬'
  }
];

interface AchievementsStoreState {
  achievements: GameAchievement[];
  lastUnlocked: GameAchievement | null;
  unlockAchievement: (id: string) => void;
  clearNotification: () => void;
  resetAchievements: () => void;
}

export const useAchievementsStore = create<AchievementsStoreState>((set, get) => {
  const saved = localStorage.getItem('win98_game_achievements');
  let loaded = INITIAL_ACHIEVEMENTS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      loaded = INITIAL_ACHIEVEMENTS.map((a) => {
        const match = parsed.find((p: any) => p.id === a.id);
        return match ? { ...a, unlocked: match.unlocked, unlockedAt: match.unlockedAt } : a;
      });
    } catch (e) {}
  }

  return {
    achievements: loaded,
    lastUnlocked: null,

    unlockAchievement: (id: string) => {
      const { achievements } = get();
      const target = achievements.find((a) => a.id === id);
      if (!target || target.unlocked) return;

      soundService.playSuccess();
      const updated = achievements.map((a) =>
        a.id === id
          ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : a
      );

      localStorage.setItem('win98_game_achievements', JSON.stringify(updated));
      const newlyUnlocked = updated.find((a) => a.id === id) || null;

      set({
        achievements: updated,
        lastUnlocked: newlyUnlocked
      });

      // Clear toast after 4.5 seconds
      setTimeout(() => {
        set((state) => (state.lastUnlocked?.id === id ? { lastUnlocked: null } : state));
      }, 4500);
    },

    clearNotification: () => set({ lastUnlocked: null }),

    resetAchievements: () => {
      localStorage.removeItem('win98_game_achievements');
      set({ achievements: INITIAL_ACHIEVEMENTS, lastUnlocked: null });
    }
  };
});
