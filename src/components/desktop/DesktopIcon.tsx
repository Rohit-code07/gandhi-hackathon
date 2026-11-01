import React, { useRef, useState, useEffect } from 'react';

export interface DesktopShortcut {
  id: string;
  appId: string;
  title: string;
  icon: string;
  initialX: number;
  initialY: number;
  action: () => void;
}

interface DesktopIconProps {
  shortcut: DesktopShortcut;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onPositionChange: (id: string, x: number, y: number) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  shortcut,
  isSelected,
  onSelect,
  onOpen,
  onPositionChange
}) => {
  const [pos, setPos] = useState({ x: shortcut.initialX, y: shortcut.initialY });
  const isDraggingRef = useRef(false);
  const startDragRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    setPos({ x: shortcut.initialX, y: shortcut.initialY });
  }, [shortcut.initialX, shortcut.initialY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    onSelect();
    isDraggingRef.current = false;
    startDragRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startDragRef.current.mouseX;
      const deltaY = moveEvent.clientY - startDragRef.current.mouseY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        isDraggingRef.current = true;
        const newX = Math.max(5, Math.min(window.innerWidth - 80, startDragRef.current.startX + deltaX));
        const newY = Math.max(5, Math.min(window.innerHeight - 80, startDragRef.current.startY + deltaY));
        setPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (isDraggingRef.current) {
        onPositionChange(shortcut.id, pos.x, pos.y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        cursor: 'pointer'
      }}
    >
      <img
        src={shortcut.icon}
        alt={shortcut.title}
        className="icon-img"
        draggable={false}
      />
      <div className="icon-label">{shortcut.title}</div>
    </div>
  );
};
