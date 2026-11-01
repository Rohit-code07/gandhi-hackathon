import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onNewTextFile: () => void;
  onNewFolder: () => void;
  onOpenProperties: () => void;
  onPaste?: () => void;
  hasClipboard?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onRefresh,
  onNewTextFile,
  onNewFolder,
  onOpenProperties,
  onPaste,
  hasClipboard
}) => {
  // Prevent overflow outside viewport
  const menuX = Math.min(x, window.innerWidth - 170);
  const menuY = Math.min(y, window.innerHeight - 200);

  return (
    <div
      className="win-outset"
      style={{
        position: 'fixed',
        left: `${menuX}px`,
        top: `${menuY}px`,
        width: '160px',
        backgroundColor: '#c0c0c0',
        zIndex: 999999,
        padding: '2px',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.4)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="win-dropdown-item"
        onClick={() => {
          onRefresh();
          onClose();
        }}
      >
        <span>Refresh (F5)</span>
      </div>

      <div className="win-dropdown-separator" />

      <div
        className={`win-dropdown-item ${!hasClipboard ? 'disabled' : ''}`}
        style={{ color: !hasClipboard ? '#888' : '#000' }}
        onClick={() => {
          if (hasClipboard && onPaste) {
            onPaste();
            onClose();
          }
        }}
      >
        <span>Paste</span>
      </div>

      <div className="win-dropdown-separator" />

      <div
        className="win-dropdown-item"
        onClick={() => {
          onNewFolder();
          onClose();
        }}
      >
        <span>New Folder</span>
      </div>

      <div
        className="win-dropdown-item"
        onClick={() => {
          onNewTextFile();
          onClose();
        }}
      >
        <span>New Text Document</span>
      </div>

      <div className="win-dropdown-separator" />

      <div
        className="win-dropdown-item"
        style={{ fontWeight: 'bold' }}
        onClick={() => {
          onOpenProperties();
          onClose();
        }}
      >
        <span>Properties</span>
      </div>
    </div>
  );
};
