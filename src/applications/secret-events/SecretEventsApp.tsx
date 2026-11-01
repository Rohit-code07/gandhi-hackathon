import React from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';

export const SecretEventsApp: React.FC = () => {
  const { discoveries, unlockedCluesCount, showClippy, triggerBSOD } = useStoryStore();
  const { openWindow } = useWindowStore();

  const handleTestClue = (id: string) => {
    switch (id) {
      case 'diary':
        openWindow('file-explorer', 'C:/My Documents', '/icons/folder.svg', undefined, { initialPath: 'C:/My Documents' });
        break;
      case 'secret-folder':
        openWindow('file-explorer', 'C:/Secret/DO_NOT_OPEN', '/icons/secret-folder.svg', undefined, { initialPath: 'C:/Secret/DO_NOT_OPEN' });
        break;
      case 'fake-virus':
        openWindow('fake-virus');
        break;
      case 'bsod':
        triggerBSOD();
        break;
      case 'dial-up':
        openWindow('dial-up');
        break;
      case 'icq-chat':
        openWindow('icq');
        break;
      case 'meme-generator':
        openWindow('meme-factory');
        break;
      case 'clippy':
        showClippy();
        break;
      case 'old-photo':
        openWindow('old-photo');
        break;
      case 'dos-hacker':
        openWindow('terminal');
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Header Banner */}
      <div
        className="win-outset"
        style={{
          margin: '4px',
          padding: '8px 12px',
          background: 'linear-gradient(90deg, #800000 0%, #000080 100%)',
          color: '#ffffff'
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
          🕵️ THE ABANDONED PC - SECRET DISCOVERIES LOG
        </div>
        <div style={{ fontSize: '11px', marginTop: '3px', color: '#ffdd00' }}>
          Discoveries Unlocked: {unlockedCluesCount} of {discoveries.length} (
          {Math.round((unlockedCluesCount / discoveries.length) * 100)}% Explored)
        </div>
      </div>

      {/* Discoveries List */}
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
        {discoveries.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #808080',
              padding: '6px 10px',
              backgroundColor: item.discovered ? '#e6ffe6' : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px', color: item.discovered ? '#006600' : '#444' }}>
                {item.discovered ? '✓ ' : '🔒 '} {item.title}
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                {item.discovered ? item.description : `HINT: ${item.hint}`}
              </div>
              {item.discovered && (
                <div style={{ fontSize: '10px', color: '#008800', marginTop: '2px' }}>
                  Discovered at {item.discoveredAt}
                </div>
              )}
            </div>

            <button
              className="win-button"
              onClick={() => handleTestClue(item.id)}
              style={{ fontSize: '10px', padding: '2px 8px' }}
            >
              {item.discovered ? 'Inspect' : 'Search'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="win-statusbar">
        <div className="win-status-pane">Explore files, games, dial-up and easter eggs to reveal the full story.</div>
      </div>
    </div>
  );
};
