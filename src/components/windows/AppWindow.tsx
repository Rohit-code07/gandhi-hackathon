import React, { useRef, useState, useEffect } from 'react';
import { WindowState } from '../../types/window';
import { WindowControls } from './WindowControls';
import { useWindowStore } from '../../store/windowStore';

interface AppWindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const AppWindow: React.FC<AppWindowProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize
  } = useWindowStore();

  const isActive = activeWindowId === win.id;
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const isResizingRef = useRef<string | null>(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Handle Dragging
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if (e.button !== 0) return; // only left click
    focusWindow(win.id);
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    };
    e.preventDefault();
  };

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (win.isMaximized) return;
    if (e.button !== 0) return;
    focusWindow(win.id);
    isResizingRef.current = direction;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffsetRef.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffsetRef.current.y));
        updateWindowPosition(win.id, newX, newY);
      }

      if (isResizingRef.current) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        const dir = isResizingRef.current;

        let newW = resizeStartRef.current.width;
        let newH = resizeStartRef.current.height;

        if (dir.includes('right')) {
          newW = Math.max(win.minWidth || 240, resizeStartRef.current.width + deltaX);
        }
        if (dir.includes('bottom')) {
          newH = Math.max(win.minHeight || 180, resizeStartRef.current.height + deltaY);
        }

        updateWindowSize(win.id, newW, newH);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [win.id, win.isMaximized, win.minWidth, win.minHeight, updateWindowPosition, updateWindowSize]);

  if (win.isMinimized) {
    return null;
  }

  return (
    <div
      className="win-outset"
      onMouseDown={() => focusWindow(win.id)}
      style={{
        position: 'absolute',
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Titlebar */}
      <div
        className={`win-titlebar ${!isActive ? 'inactive' : ''}`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(win.id)}
        style={{ cursor: win.isMaximized ? 'default' : 'move', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
          <img
            src={win.icon}
            alt=""
            style={{ width: '16px', height: '16px', imageRendering: 'pixelated', flexShrink: 0 }}
          />
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '11px'
            }}
          >
            {win.title}
          </span>
        </div>

        <WindowControls
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximizeWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          isMaximized={win.isMaximized}
        />
      </div>

      {/* Window Body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#c0c0c0',
          padding: '2px',
          position: 'relative'
        }}
      >
        {children}
      </div>

      {/* Resizing handles (when not maximized) */}
      {!win.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '5px',
              height: '100%',
              cursor: 'ew-resize'
            }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '5px',
              cursor: 'ns-resize'
            }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '12px',
              height: '12px',
              cursor: 'nwse-resize',
              zIndex: 10
            }}
          />
        </>
      )}
    </div>
  );
};
