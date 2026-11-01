import React, { useState } from 'react';
import { useAchievementsStore } from '../../store/achievementsStore';

export const AchievementsApp: React.FC = () => {
  const { achievements, resetAchievements } = useAchievementsStore();
  const [filter, setFilter] = useState<'all' | 'papa' | 'cafe' | 'download'>('all');

  const filtered = filter === 'all' ? achievements : achievements.filter((a) => a.game === filter);
  const unlockedTotal = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
        fontFamily: 'Tahoma, Arial, sans-serif',
        userSelect: 'none',
        fontSize: '11px'
      }}
    >
      {/* Header Banner */}
      <div
        className="win-outset"
        style={{
          margin: '4px',
          padding: '8px 12px',
          background: 'linear-gradient(90deg, #b8860b 0%, #ffd700 100%)',
          color: '#000000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
            🏆 RETRO MINI-GAMES TROPHY ROOM
          </div>
          <div style={{ fontSize: '10px', color: '#402000', marginTop: '2px' }}>
            Trophies Unlocked: <b>{unlockedTotal} of {achievements.length}</b> ({Math.round((unlockedTotal / achievements.length) * 100)}%)
          </div>
        </div>
        <button
          className="win-button"
          onClick={() => {
            if (confirm('Reset all unlocked mini-game achievements?')) {
              resetAchievements();
            }
          }}
          style={{ fontSize: '10px' }}
        >
          Reset Trophies
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '3px', padding: '0 6px', borderBottom: '1px solid #808080' }}>
        <button
          className={`win-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
        >
          All Games ({achievements.length})
        </button>
        <button
          className={`win-button ${filter === 'papa' ? 'active' : ''}`}
          onClick={() => setFilter('papa')}
          style={{ fontWeight: filter === 'papa' ? 'bold' : 'normal' }}
        >
          Papa Aa Gaye! (4)
        </button>
        <button
          className={`win-button ${filter === 'cafe' ? 'active' : ''}`}
          onClick={() => setFilter('cafe')}
          style={{ fontWeight: filter === 'cafe' ? 'bold' : 'normal' }}
        >
          Cyber Café 2005 (4)
        </button>
        <button
          className={`win-button ${filter === 'download' ? 'active' : ''}`}
          onClick={() => setFilter('download')}
          style={{ fontWeight: filter === 'download' ? 'bold' : 'normal' }}
        >
          99% Download (4)
        </button>
      </div>

      {/* Achievement List */}
      <div
        className="win-inset"
        style={{
          flex: 1,
          margin: '4px',
          padding: '6px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #808080',
              padding: '6px 10px',
              backgroundColor: item.unlocked ? '#ffffea' : '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              opacity: item.unlocked ? 1 : 0.65
            }}
          >
            <div style={{ fontSize: '24px' }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '12px', color: item.unlocked ? '#000080' : '#666' }}>
                  {item.title}
                </span>
                {item.unlocked && (
                  <span style={{ backgroundColor: '#008000', color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '2px' }}>
                    UNLOCKED
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                {item.description}
              </div>
              {item.unlocked && (
                <div style={{ fontSize: '9px', color: '#888', marginTop: '2px' }}>
                  Unlocked at {item.unlockedAt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">
          Achievements persist permanently across all game sessions.
        </div>
      </div>
    </div>
  );
};
