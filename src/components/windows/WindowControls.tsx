import React from 'react';

interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMaximized: boolean;
}

export const WindowControls: React.FC<WindowControlsProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  isMaximized
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        type="button"
        className="win-titlebar-btn"
        title="Minimize"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
      >
        <span style={{ transform: 'translateY(-2px)' }}>_</span>
      </button>
      <button
        type="button"
        className="win-titlebar-btn"
        title={isMaximized ? 'Restore' : 'Maximize'}
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
      >
        {isMaximized ? '❐' : '□'}
      </button>
      <button
        type="button"
        className="win-titlebar-btn"
        title="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
};
