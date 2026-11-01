import React, { useState, useEffect, useRef } from 'react';
import { StoredPhoto, photoStorageService } from '../../services/photoStorageService';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { soundService } from '../../services/soundService';

interface ImageViewerProps {
  photoId?: string;
  folder?: string;
}

export const ImageViewerApp: React.FC<ImageViewerProps> = ({ photoId, folder = 'C:/My Pictures' }) => {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const { setCustomWallpaper } = useSettingsStore();

  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1); // 1 = 100%
  const [fitToWindow, setFitToWindow] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270

  // Pan / Drag state
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Delete modal
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load photos in folder
  useEffect(() => {
    const load = async () => {
      await photoStorageService.init();
      const list = await photoStorageService.getPhotosByFolder(folder);
      setPhotos(list);

      if (photoId) {
        const idx = list.findIndex((p) => p.id === photoId);
        if (idx !== -1) {
          setCurrentIndex(idx);
        }
      }
    };
    load();
  }, [photoId, folder]);

  const currentPhoto = photos[currentIndex];

  // Reset transforms on photo switch
  useEffect(() => {
    setZoom(1);
    setFitToWindow(true);
    setRotation(0);
    setPanPos({ x: 0, y: 0 });
  }, [currentIndex]);

  const handlePrev = () => {
    if (photos.length <= 1) return;
    soundService.playClick();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    if (photos.length <= 1) return;
    soundService.playClick();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handleZoomIn = () => {
    soundService.playClick();
    setFitToWindow(false);
    setZoom((z) => Math.min(z + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    soundService.playClick();
    setFitToWindow(false);
    setZoom((z) => Math.max(z - 0.25, 0.25));
  };

  const handleActualSize = () => {
    soundService.playClick();
    setFitToWindow(false);
    setZoom(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleFitToggle = () => {
    soundService.playClick();
    setFitToWindow(true);
    setZoom(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleRotateLeft = () => {
    soundService.playClick();
    setRotation((r) => (r - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    soundService.playClick();
    setRotation((r) => (r + 90) % 360);
  };

  const handleSetWallpaper = () => {
    if (!currentPhoto) return;
    soundService.playTada();
    const url = photoStorageService.getObjectUrl(currentPhoto);
    setCustomWallpaper(url);
    alert(`"${currentPhoto.name}" has been set as your Desktop Wallpaper!`);
  };

  const handleEditInPaint = () => {
    if (!currentPhoto) return;
    soundService.playClick();
    const url = photoStorageService.getObjectUrl(currentPhoto);
    openWindow('paint', `${currentPhoto.name} - Paint`, '/icons/paint.svg', undefined, {
      photoUrl: url,
      photoName: currentPhoto.name,
      forceNewInstance: true
    });
  };

  const handleDeletePhoto = async () => {
    if (!currentPhoto) return;
    soundService.playClick();
    await photoStorageService.deletePhoto(currentPhoto.id);
    const updated = photos.filter((p) => p.id !== currentPhoto.id);
    setPhotos(updated);
    setDeleteConfirm(false);

    if (updated.length === 0) {
      // Find current window and close it
      const myWin = windows.find((w) => w.appId === 'image-viewer');
      if (myWin) closeWindow(myWin.id);
    } else {
      setCurrentIndex((prev) => (prev >= updated.length ? 0 : prev));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (deleteConfirm) return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') handleFitToggle();
      else if (e.key === 'r' || e.key === 'R') handleRotateRight();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [photos, currentIndex, deleteConfirm]);

  // Pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (fitToWindow && zoom === 1) return;
    setIsPanning(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (!currentPhoto) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: '#c0c0c0',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <img src="/icons/file-image.svg" alt="" style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
        <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>No Picture Loaded</div>
        <div style={{ fontSize: '11px', color: '#555' }}>
          Open My Pictures or double-click an image file to view it in Windows Picture Viewer.
        </div>
      </div>
    );
  }

  const photoUrl = photoStorageService.getObjectUrl(currentPhoto);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
        userSelect: 'none',
        fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
        fontSize: '11px'
      }}
    >
      {/* Menubar */}
      <div className="win-menubar" style={{ padding: '2px 4px', display: 'flex', gap: '8px' }}>
        <div className="win-menu-item" onClick={handleSetWallpaper}>
          <u>F</u>ile
        </div>
        <div className="win-menu-item" onClick={handleEditInPaint}>
          <u>E</u>dit in Paint
        </div>
        <div className="win-menu-item" onClick={handleFitToggle}>
          <u>V</u>iew
        </div>
        <div
          className="win-menu-item"
          onClick={() => {
            alert(
              `Windows Picture Viewer 98\n\nFile: ${currentPhoto.name}\nDimensions: ${currentPhoto.width} × ${currentPhoto.height}\nType: ${currentPhoto.type}\nSize: ${(currentPhoto.size / 1024).toFixed(1)} KB`
            );
          }}
        >
          <u>H</u>elp
        </div>
      </div>

      {/* Retro Toolbar */}
      <div
        className="win-outset"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '3px 6px',
          margin: '2px',
          backgroundColor: '#c0c0c0',
          flexWrap: 'wrap'
        }}
      >
        {/* Previous / Next Photo */}
        <button
          className="win-button"
          onClick={handlePrev}
          disabled={photos.length <= 1}
          style={{ padding: '2px 6px' }}
          title="Previous Image (Left Arrow)"
        >
          ◀ Prev
        </button>
        <button
          className="win-button"
          onClick={handleNext}
          disabled={photos.length <= 1}
          style={{ padding: '2px 6px' }}
          title="Next Image (Right Arrow)"
        >
          Next ▶
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        {/* Zoom In & Out */}
        <button
          className="win-button"
          onClick={handleZoomIn}
          style={{ padding: '2px 6px' }}
          title="Zoom In (+)"
        >
          🔍+ In
        </button>
        <button
          className="win-button"
          onClick={handleZoomOut}
          style={{ padding: '2px 6px' }}
          title="Zoom Out (-)"
        >
          🔍- Out
        </button>
        <button
          className={`win-button ${!fitToWindow && zoom === 1 ? 'active' : ''}`}
          onClick={handleActualSize}
          style={{ padding: '2px 6px' }}
          title="Actual Size (100%)"
        >
          1:1
        </button>
        <button
          className={`win-button ${fitToWindow ? 'active' : ''}`}
          onClick={handleFitToggle}
          style={{ padding: '2px 6px' }}
          title="Fit to Window"
        >
          [ ] Fit
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        {/* Rotation */}
        <button
          className="win-button"
          onClick={handleRotateLeft}
          style={{ padding: '2px 6px' }}
          title="Rotate Left 90°"
        >
          ↺ -90°
        </button>
        <button
          className="win-button"
          onClick={handleRotateRight}
          style={{ padding: '2px 6px' }}
          title="Rotate Right 90° (R)"
        >
          ↻ +90°
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#808080', margin: '0 2px' }} />

        {/* Fullscreen */}
        <button
          className={`win-button ${isFullscreen ? 'active' : ''}`}
          onClick={() => setIsFullscreen((f) => !f)}
          style={{ padding: '2px 6px' }}
          title="Toggle Fullscreen"
        >
          ⛶ Full
        </button>

        {/* Wallpaper */}
        <button
          className="win-button"
          onClick={handleSetWallpaper}
          style={{ padding: '2px 8px', color: '#000080', fontWeight: 'bold' }}
          title="Set as Desktop Wallpaper"
        >
          🖥️ Wallpaper
        </button>

        {/* Edit in Paint */}
        <button
          className="win-button"
          onClick={handleEditInPaint}
          style={{ padding: '2px 6px' }}
          title="Edit image in Microsoft Paint"
        >
          🎨 Paint
        </button>

        {/* Delete button */}
        <button
          className="win-button"
          onClick={() => setDeleteConfirm(true)}
          style={{ padding: '2px 6px', color: '#a00000', marginLeft: 'auto' }}
          title="Delete this picture"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Main Image Display Area */}
      <div
        ref={containerRef}
        className="win-inset"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          backgroundColor: '#333333',
          backgroundImage:
            'linear-gradient(45deg, #2b2b2b 25%, transparent 25%), linear-gradient(-45deg, #2b2b2b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2b2b2b 75%), linear-gradient(-45deg, transparent 75%, #2b2b2b 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : zoom > 1 || !fitToWindow ? 'grab' : 'default',
          margin: '2px'
        }}
      >
        <img
          src={photoUrl}
          alt={currentPhoto.name}
          draggable={false}
          style={{
            maxWidth: fitToWindow ? '96%' : 'none',
            maxHeight: fitToWindow ? '96%' : 'none',
            transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Status Bar */}
      <div
        className="win-inset"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 6px',
          margin: '2px',
          backgroundColor: '#c0c0c0',
          fontSize: '10px'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          {currentPhoto.name} ({currentIndex + 1} of {photos.length})
        </span>
        <span>
          {currentPhoto.width} × {currentPhoto.height} pixels | {(currentPhoto.size / 1024).toFixed(1)} KB |{' '}
          {Math.round(zoom * 100)}% {fitToWindow ? '(Fit)' : ''} {rotation !== 0 ? `| ${rotation}°` : ''}
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="win-outset" style={{ width: '360px', backgroundColor: '#c0c0c0', padding: '2px' }}>
            <div
              style={{
                backgroundColor: '#000080',
                color: '#fff',
                padding: '3px 6px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>Confirm File Delete</span>
              <button
                className="win-button"
                style={{ padding: '0 4px', fontSize: '9px' }}
                onClick={() => setDeleteConfirm(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src="/icons/warning.svg" alt="" style={{ width: '36px', height: '36px' }} />
              <div>
                Are you sure you want to delete <strong>"{currentPhoto.name}"</strong>?
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                padding: '8px 16px',
                borderTop: '1px solid #808080'
              }}
            >
              <button
                className="win-button"
                onClick={handleDeletePhoto}
                style={{ padding: '4px 16px', fontWeight: 'bold' }}
              >
                Yes
              </button>
              <button
                className="win-button"
                onClick={() => setDeleteConfirm(false)}
                style={{ padding: '4px 16px' }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
