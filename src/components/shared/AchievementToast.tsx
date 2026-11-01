import React from 'react';
import { useAchievementsStore } from '../../store/achievementsStore';

export const AchievementToast: React.FC = () => {
  const { lastUnlocked, clearNotification } = useAchievementsStore();

  if (!lastUnlocked) return null;

  return (
    <div
      className="win-outset"
      style={{
        position: 'fixed',
        bottom: '38px',
        right: '16px',
        width: '280px',
        backgroundColor: '#ffffdd',
        border: '2px solid #b8860b',
        boxShadow: '3px 3px 10px rgba(0,0,0,0.4)',
        zIndex: 9999998,
        padding: '3px',
        animation: 'bounceIn 0.3s ease-out'
      }}
    >
      <div className="win-titlebar" style={{ background: 'linear-gradient(90deg, #b8860b, #ffd700)', color: '#000' }}>
        <span>🏆 ACHIEVEMENT UNLOCKED!</span>
        <button className="win-titlebar-btn" onClick={clearNotification}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px' }}>
        <div style={{ fontSize: '28px' }}>{lastUnlocked.icon}</div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#800000' }}>
            {lastUnlocked.title}
          </div>
          <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>
            {lastUnlocked.description}
          </div>
        </div>
      </div>
    </div>
  );
};
