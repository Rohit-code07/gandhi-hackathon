import React, { useState, useEffect, useRef } from 'react';
import { StoredPhoto, photoStorageService } from '../../services/photoStorageService';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { soundService } from '../../services/soundService';

type ViewMode = 'large-icons' | 'small-icons' | 'list' | 'details';

const FUNNY_LOADING_MESSAGES = [
  'Calibrating Flatbed Scanner (300 DPI)...',
  'Interpolating 24-bit TrueColor pixels...',
  'Processing progressive JPEG scanlines...',
  'Reading EXIF tags (Year 1998 detected)...',
  'Allocating DirectDraw video memory...',
  'Optimizing palette for 256-color VGA mode...',
  'Saving cluster blocks to Drive C:\\My Pictures...'
];

export const MyPicturesApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const { setCustomWallpaper } = useSettingsStore();
  const { createFile, files, deleteFile: deleteVirtualFile } = useFilesystemStore();

  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('C:/My Pictures');
  const [folders, setFolders] = useState<string[]>(['C:/My Pictures']);
  const [viewMode, setViewMode] = useState<ViewMode>('large-icons');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Dialogs
  const [firstUploadModal, setFirstUploadModal] = useState<boolean>(false);
  const [photoToDelete, setPhotoToDelete] = useState<StoredPhoto | null>(null);
  const [renameTarget, setRenameTarget] = useState<StoredPhoto | null>(null);
  const [newPhotoName, setNewPhotoName] = useState<string>('');

  // Slideshow
  const [slideshowOpen, setSlideshowOpen] = useState<boolean>(false);
  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);
  const [slideshowPlaying, setSlideshowPlaying] = useState<boolean>(true);

  // Context menu
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number; photo: StoredPhoto } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load photos and folders on mount
  useEffect(() => {
    loadPhotos();
  }, [currentFolder]);

  const loadPhotos = async () => {
    await photoStorageService.init();
    const all = await photoStorageService.getPhotosByFolder(currentFolder);
    setPhotos(all);
    const availableFolders = await photoStorageService.getFolders();
    setFolders(availableFolders);
  };

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  // Folder subfolders in current folder
  const subfolders = folders.filter((f) => {
    if (f === currentFolder) return false;
    if (!f.startsWith(currentFolder)) return false;
    const rest = f.substring(currentFolder.length).replace(/^\/+/, '');
    return rest.length > 0 && !rest.includes('/');
  });

  // Handle file uploads (both input & drag-and-drop)
  const handleUploadFiles = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);
    const randMsg = FUNNY_LOADING_MESSAGES[Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)];
    setUploadMessage(randMsg);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, GIF, WEBP, BMP).');
      setIsUploading(false);
      return;
    }

    soundService.playDialUp();

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadMessage(`Processing ${file.name} (${i + 1}/${validFiles.length})...`);
      setUploadProgress(Math.round(((i + 1) / validFiles.length) * 90));

      const saved = await photoStorageService.savePhoto(file, file.name, currentFolder);

      // Also register into virtual filesystem so C:/My Pictures has file
      const objectUrl = photoStorageService.getObjectUrl(saved);
      await createFile(currentFolder, file.name, objectUrl);

      // Small delay for retro authenticity
      await new Promise((r) => setTimeout(r, 400));
    }

    setUploadProgress(100);
    soundService.playTada();
    setIsUploading(false);
    await loadPhotos();

    // First upload check
    const hasSeenWelcome = localStorage.getItem('win98_first_photo_uploaded');
    if (!hasSeenWelcome) {
      localStorage.setItem('win98_first_photo_uploaded', 'true');
      setFirstUploadModal(true);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Delete handler
  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;
    soundService.playClick();
    await photoStorageService.deletePhoto(photoToDelete.id);
    const vFile = files.find((f) => f.parentPath === photoToDelete.folder && f.name === photoToDelete.name);
    if (vFile) {
      deleteVirtualFile(vFile.id, true);
    }
    setPhotoToDelete(null);
    if (selectedPhotoId === photoToDelete.id) {
      setSelectedPhotoId(null);
    }
    await loadPhotos();
  };

  // Rename handler
  const submitRename = async () => {
    if (!renameTarget || !newPhotoName.trim()) return;
    soundService.playClick();
    await photoStorageService.renamePhoto(renameTarget.id, newPhotoName.trim());
    setRenameTarget(null);
    await loadPhotos();
  };

  // Wallpaper set
  const handleSetWallpaper = (photo: StoredPhoto) => {
    soundService.playTada();
    const url = photoStorageService.getObjectUrl(photo);
    setCustomWallpaper(url);
    alert(`"${photo.name}" has been set as your Windows 98 desktop wallpaper!`);
  };

  // Open in Image Viewer
  const handleOpenViewer = (photo: StoredPhoto) => {
    soundService.playClick();
    openWindow('image-viewer', `${photo.name} - Picture Viewer`, '/icons/file-image.svg', undefined, {
      photoId: photo.id,
      folder: currentFolder,
      forceNewInstance: true
    });
  };

  // Edit in Paint
  const handleEditInPaint = (photo: StoredPhoto) => {
    soundService.playClick();
    const url = photoStorageService.getObjectUrl(photo);
    openWindow('paint', `${photo.name} - Paint`, '/icons/paint.svg', undefined, {
      photoUrl: url,
      photoName: photo.name,
      forceNewInstance: true
    });
  };

  // Open in Meme Factory
  const handleUseInMeme = (photo: StoredPhoto) => {
    soundService.playClick();
    const url = photoStorageService.getObjectUrl(photo);
    openWindow('meme-factory', 'Meme Factory - Custom Photo', '/icons/meme-factory.svg', undefined, {
      customPhotoUrl: url,
      customPhotoName: photo.name
    });
  };

  // Create new album/folder
  const handleCreateAlbum = () => {
    soundService.playClick();
    const name = prompt('Enter new album / folder name:', 'Vacation 1998');
    if (name && name.trim()) {
      const newFolderPath = `${currentFolder}/${name.trim()}`;
      photoStorageService.addFolder(newFolderPath);
      photoStorageService.getFolders().then((f) => setFolders(f));
      setCurrentFolder(newFolderPath);
    }
  };

  // Navigation handlers
  const handleNavigateUp = () => {
    soundService.playClick();
    if (currentFolder === 'C:/My Pictures') return;
    const parts = currentFolder.split('/');
    parts.pop();
    setCurrentFolder(parts.join('/') || 'C:/My Pictures');
    setSelectedPhotoId(null);
  };

  // Slideshow timer
  useEffect(() => {
    if (!slideshowOpen || !slideshowPlaying || photos.length <= 1) return;
    const timer = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slideshowOpen, slideshowPlaying, photos.length]);

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
      onClick={() => setContextMenuPos(null)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden native multi-file picker */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/png, image/jpeg, image/webp, image/gif, image/bmp"
        onChange={(e) => {
          if (e.target.files) handleUploadFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Menubar */}
      <div className="win-menubar" style={{ padding: '2px 4px', display: 'flex', gap: '8px' }}>
        <div className="win-menu-item" onClick={() => fileInputRef.current?.click()}>
          <u>F</u>ile
        </div>
        <div className="win-menu-item" onClick={() => setViewMode('large-icons')}>
          <u>V</u>iew
        </div>
        <div className="win-menu-item" onClick={() => setSlideshowOpen(true)}>
          <u>S</u>lideshow
        </div>
        <div
          className="win-menu-item"
          onClick={() => {
            alert('Windows 98 My Pictures Album v4.10.1998\nBuilt with 24-bit TrueColor acceleration.');
          }}
        >
          <u>H</u>elp
        </div>
      </div>

      {/* Classic Toolbar */}
      <div
        className="win-outset"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 6px',
          margin: '2px',
          backgroundColor: '#c0c0c0'
        }}
      >
        <button
          className="win-button"
          onClick={handleNavigateUp}
          disabled={currentFolder === 'C:/My Pictures'}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px' }}
          title="Up one folder"
        >
          <span>⬆️ Up</span>
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', borderRight: '1px solid #fff' }} />

        {/* Upload Button */}
        <button
          className="win-button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontWeight: 'bold',
            color: '#000080'
          }}
          title="Upload personal photos from your computer"
        >
          <span>📷 Upload Photo...</span>
        </button>

        {/* New Folder */}
        <button
          className="win-button"
          onClick={handleCreateAlbum}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px' }}
          title="Create a new album folder"
        >
          <span>📁 New Album</span>
        </button>

        {/* Slideshow */}
        <button
          className="win-button"
          onClick={() => {
            if (photos.length === 0) {
              alert('No photos available in this folder to display a slideshow!');
              return;
            }
            soundService.playClick();
            setSlideshowIndex(selectedPhoto ? photos.indexOf(selectedPhoto) : 0);
            setSlideshowOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px' }}
          title="Play full slideshow"
        >
          <span>🎞️ Slideshow</span>
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#808080', borderRight: '1px solid #fff' }} />

        {/* View Mode Buttons */}
        <div style={{ display: 'flex', gap: '2px' }}>
          <button
            className={`win-button ${viewMode === 'large-icons' ? 'active' : ''}`}
            onClick={() => setViewMode('large-icons')}
            style={{ padding: '2px 5px' }}
            title="Large Thumbnails"
          >
            🔲 Thumbnails
          </button>
          <button
            className={`win-button ${viewMode === 'small-icons' ? 'active' : ''}`}
            onClick={() => setViewMode('small-icons')}
            style={{ padding: '2px 5px' }}
            title="Small Icons"
          >
            ◽ Icons
          </button>
          <button
            className={`win-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            style={{ padding: '2px 5px' }}
            title="List"
          >
            📋 List
          </button>
          <button
            className={`win-button ${viewMode === 'details' ? 'active' : ''}`}
            onClick={() => setViewMode('details')}
            style={{ padding: '2px 5px' }}
            title="Details"
          >
            📑 Details
          </button>
        </div>

        <button
          className="win-button"
          onClick={loadPhotos}
          style={{ padding: '2px 6px', marginLeft: 'auto' }}
          title="Refresh album"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Address Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 6px',
          backgroundColor: '#c0c0c0'
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#333' }}>Address:</span>
        <select
          className="win-inset"
          value={currentFolder}
          onChange={(e) => {
            soundService.playClick();
            setCurrentFolder(e.target.value);
            setSelectedPhotoId(null);
          }}
          style={{
            flex: 1,
            height: '22px',
            backgroundColor: '#ffffff',
            border: 'none',
            fontSize: '11px',
            fontFamily: 'monospace'
          }}
        >
          {folders.map((f) => (
            <option key={f} value={f}>
              📁 {f}
            </option>
          ))}
        </select>
      </div>

      {/* Drag and Drop notice or Uploading Progress Bar */}
      {isUploading && (
        <div
          className="win-outset"
          style={{
            margin: '4px',
            padding: '6px 10px',
            backgroundColor: '#ffffcc',
            border: '1px solid #808080'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 'bold' }}>{uploadMessage}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div
            className="win-inset"
            style={{ height: '14px', backgroundColor: '#e0e0e0', position: 'relative', overflow: 'hidden' }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#000080',
                transition: 'width 0.2s linear'
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area: Left Web View Panel + Right Gallery */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '2px', position: 'relative' }}>
        {/* Drag over visual overlay */}
        {isDragOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 128, 0.2)',
              border: '3px dashed #000080',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000080',
              fontSize: '16px',
              fontWeight: 'bold',
              backdropFilter: 'blur(1px)'
            }}
          >
            📥 Drop images here to add to "{currentFolder}"
          </div>
        )}

        {/* Left Web View Sidebar (Authentic Windows 98 Explorer Style) */}
        <div
          className="win-inset"
          style={{
            width: '210px',
            backgroundColor: '#ffffff',
            marginRight: '3px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}
        >
          {/* Header Gradient */}
          <div
            style={{
              background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
              color: '#ffffff',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <img src="/icons/my-pictures.svg" alt="" style={{ width: '24px', height: '24px' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>My Pictures</div>
              <div style={{ fontSize: '10px', opacity: 0.85 }}>Digital Photo Album</div>
            </div>
          </div>

          {/* Details / Preview */}
          <div style={{ padding: '8px', flex: 1 }}>
            {selectedPhoto ? (
              <div>
                {/* Thumbnail Preview Frame */}
                <div
                  className="win-inset"
                  style={{
                    width: '100%',
                    height: '130px',
                    backgroundColor: '#1b1b1b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={photoStorageService.getObjectUrl(selectedPhoto)}
                    alt={selectedPhoto.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <div style={{ fontWeight: 'bold', wordBreak: 'break-all', marginBottom: '4px', fontSize: '11px' }}>
                  {selectedPhoto.name}
                </div>

                <div style={{ color: '#444', lineHeight: '1.4', fontSize: '10px', marginBottom: '8px' }}>
                  <div>
                    <strong>Type:</strong> {selectedPhoto.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
                  </div>
                  <div>
                    <strong>Dimensions:</strong> {selectedPhoto.width} × {selectedPhoto.height} px
                  </div>
                  <div>
                    <strong>Size:</strong> {(selectedPhoto.size / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <strong>Saved:</strong> {selectedPhoto.uploadedAt}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid #c0c0c0',
                    paddingTop: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <button
                    className="win-button"
                    onClick={() => handleOpenViewer(selectedPhoto)}
                    style={{ textAlign: 'left', padding: '3px 6px' }}
                  >
                    🔍 Open in Picture Viewer
                  </button>

                  <button
                    className="win-button"
                    onClick={() => handleSetWallpaper(selectedPhoto)}
                    style={{ textAlign: 'left', padding: '3px 6px' }}
                  >
                    🖥️ Set as Wallpaper
                  </button>

                  <button
                    className="win-button"
                    onClick={() => handleEditInPaint(selectedPhoto)}
                    style={{ textAlign: 'left', padding: '3px 6px' }}
                  >
                    🎨 Edit in Paint
                  </button>

                  <button
                    className="win-button"
                    onClick={() => handleUseInMeme(selectedPhoto)}
                    style={{ textAlign: 'left', padding: '3px 6px' }}
                  >
                    🎭 Create Meme Template
                  </button>

                  <button
                    className="win-button"
                    onClick={() => {
                      setNewPhotoName(selectedPhoto.name);
                      setRenameTarget(selectedPhoto);
                    }}
                    style={{ textAlign: 'left', padding: '3px 6px' }}
                  >
                    ✏️ Rename Photo...
                  </button>

                  <button
                    className="win-button"
                    onClick={() => setPhotoToDelete(selectedPhoto)}
                    style={{ textAlign: 'left', padding: '3px 6px', color: '#a00000' }}
                  >
                    🗑️ Delete Photo...
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#333' }}>
                  Select an image file to view its preview and properties.
                </p>
                <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.5' }}>
                  <div>
                    <strong>Folder:</strong> {currentFolder}
                  </div>
                  <div>
                    <strong>Photos:</strong> {photos.length} item(s)
                  </div>
                  <div>
                    <strong>Total Size:</strong>{' '}
                    {(photos.reduce((acc, p) => acc + p.size, 0) / 1024).toFixed(1)} KB
                  </div>
                </div>

                <div
                  className="win-outset"
                  style={{
                    marginTop: '12px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    fontSize: '10px',
                    color: '#000080'
                  }}
                >
                  💡 <strong>Tip:</strong> Drag and drop any image file from your computer directly into this window to
                  store it!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Gallery / Files Area */}
        <div
          className="win-inset"
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            overflowY: 'auto',
            padding: '8px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPhotoId(null);
            }
          }}
        >
          {/* Subfolders if any */}
          {subfolders.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: '#666', borderBottom: '1px solid #e0e0e0', marginBottom: '6px' }}>
                Albums & Folders
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {subfolders.map((folderPath) => {
                  const folderName = folderPath.split('/').pop();
                  return (
                    <div
                      key={folderPath}
                      onDoubleClick={() => {
                        soundService.playClick();
                        setCurrentFolder(folderPath);
                        setSelectedPhotoId(null);
                      }}
                      style={{
                        width: '74px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px',
                        border: '1px solid transparent',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/icons/folder.svg" alt="" style={{ width: '32px', height: '32px' }} />
                      <span
                        style={{
                          fontSize: '11px',
                          marginTop: '2px',
                          wordBreak: 'break-word',
                          lineHeight: '1.2'
                        }}
                      >
                        {folderName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty album hint */}
          {photos.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60%',
                color: '#666',
                textAlign: 'center',
                padding: '16px'
              }}
            >
              <img
                src="/icons/my-pictures.svg"
                alt=""
                style={{ width: '48px', height: '48px', marginBottom: '8px', opacity: 0.6 }}
              />
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                This album is currently empty.
              </div>
              <div style={{ maxWidth: '300px', fontSize: '11px', marginBottom: '12px' }}>
                Click <strong>"Upload Photo..."</strong> above or drag and drop photos from your PC to preserve your
                memories in Windows 98!
              </div>
              <button
                className="win-button"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '4px 12px', fontWeight: 'bold' }}
              >
                📷 Upload Photos Now
              </button>
            </div>
          )}

          {/* VIEW MODE 1: Large Icons / Thumbnails */}
          {viewMode === 'large-icons' && photos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '12px'
              }}
            >
              {photos.map((photo) => {
                const isSelected = selectedPhotoId === photo.id;
                const photoUrl = photoStorageService.getObjectUrl(photo);
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedPhotoId(photo.id);
                    }}
                    onDoubleClick={() => handleOpenViewer(photo)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedPhotoId(photo.id);
                      setContextMenuPos({ x: e.clientX, y: e.clientY, photo });
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '4px',
                      backgroundColor: isSelected ? '#000080' : 'transparent',
                      color: isSelected ? '#ffffff' : '#000000',
                      border: isSelected ? '1px dotted #ffff00' : '1px solid transparent'
                    }}
                  >
                    {/* Thumbnail box */}
                    <div
                      className="win-outset"
                      style={{
                        width: '94px',
                        height: '76px',
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        marginBottom: '4px'
                      }}
                    >
                      <img
                        src={photoUrl}
                        alt={photo.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover'
                        }}
                        loading="lazy"
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        maxWidth: '100px',
                        lineHeight: '1.2'
                      }}
                    >
                      {photo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: Small Icons */}
          {viewMode === 'small-icons' && photos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '6px'
              }}
            >
              {photos.map((photo) => {
                const isSelected = selectedPhotoId === photo.id;
                const photoUrl = photoStorageService.getObjectUrl(photo);
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedPhotoId(photo.id);
                    }}
                    onDoubleClick={() => handleOpenViewer(photo)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedPhotoId(photo.id);
                      setContextMenuPos({ x: e.clientX, y: e.clientY, photo });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#000080' : 'transparent',
                      color: isSelected ? '#ffffff' : '#000000'
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt=""
                      style={{ width: '20px', height: '20px', objectFit: 'cover', border: '1px solid #808080' }}
                    />
                    <span style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 3: List */}
          {viewMode === 'list' && photos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {photos.map((photo) => {
                const isSelected = selectedPhotoId === photo.id;
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedPhotoId(photo.id);
                    }}
                    onDoubleClick={() => handleOpenViewer(photo)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedPhotoId(photo.id);
                      setContextMenuPos({ x: e.clientX, y: e.clientY, photo });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#000080' : 'transparent',
                      color: isSelected ? '#ffffff' : '#000000'
                    }}
                  >
                    <img src="/icons/file-image.svg" alt="" style={{ width: '16px', height: '16px' }} />
                    <span style={{ flex: 1 }}>{photo.name}</span>
                    <span style={{ fontSize: '10px', color: isSelected ? '#ddd' : '#666' }}>
                      {(photo.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 4: Details */}
          {viewMode === 'details' && photos.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '1px solid #808080', textAlign: 'left' }}>
                  <th style={{ padding: '3px 6px' }}>Name</th>
                  <th style={{ padding: '3px 6px' }}>Dimensions</th>
                  <th style={{ padding: '3px 6px' }}>Type</th>
                  <th style={{ padding: '3px 6px' }}>Size</th>
                  <th style={{ padding: '3px 6px' }}>Modified</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => {
                  const isSelected = selectedPhotoId === photo.id;
                  return (
                    <tr
                      key={photo.id}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedPhotoId(photo.id);
                      }}
                      onDoubleClick={() => handleOpenViewer(photo)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedPhotoId(photo.id);
                        setContextMenuPos({ x: e.clientX, y: e.clientY, photo });
                      }}
                      style={{
                        backgroundColor: isSelected ? '#000080' : 'transparent',
                        color: isSelected ? '#ffffff' : '#000000',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img src="/icons/file-image.svg" alt="" style={{ width: '16px', height: '16px' }} />
                        <span>{photo.name}</span>
                      </td>
                      <td style={{ padding: '3px 6px' }}>
                        {photo.width} × {photo.height}
                      </td>
                      <td style={{ padding: '3px 6px' }}>{photo.type}</td>
                      <td style={{ padding: '3px 6px' }}>{(photo.size / 1024).toFixed(1)} KB</td>
                      <td style={{ padding: '3px 6px' }}>{photo.uploadedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
        <span>
          {photos.length} photo(s){selectedPhoto ? ` | Selected: ${selectedPhoto.name}` : ''}
        </span>
        <span>Drive C: 1.44 GB Free (Local Disk)</span>
      </div>

      {/* Context Menu on Photo */}
      {contextMenuPos && (
        <div
          className="win-outset"
          style={{
            position: 'fixed',
            left: `${Math.min(contextMenuPos.x, window.innerWidth - 180)}px`,
            top: `${Math.min(contextMenuPos.y, window.innerHeight - 220)}px`,
            width: '180px',
            backgroundColor: '#c0c0c0',
            zIndex: 999999,
            padding: '2px',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="win-dropdown-item"
            onClick={() => {
              handleOpenViewer(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span>🔍 Open in Picture Viewer</span>
          </div>

          <div
            className="win-dropdown-item"
            onClick={() => {
              handleSetWallpaper(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span>🖥️ Set as Wallpaper</span>
          </div>

          <div
            className="win-dropdown-item"
            onClick={() => {
              handleEditInPaint(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span>🎨 Edit in Paint</span>
          </div>

          <div
            className="win-dropdown-item"
            onClick={() => {
              handleUseInMeme(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span>🎭 Use in Meme Factory</span>
          </div>

          <div className="win-dropdown-separator" />

          <div
            className="win-dropdown-item"
            onClick={() => {
              setNewPhotoName(contextMenuPos.photo.name);
              setRenameTarget(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span>✏️ Rename...</span>
          </div>

          <div
            className="win-dropdown-item"
            onClick={() => {
              setPhotoToDelete(contextMenuPos.photo);
              setContextMenuPos(null);
            }}
          >
            <span style={{ color: '#a00000' }}>🗑️ Delete Photo</span>
          </div>
        </div>
      )}

      {/* First Photo Upload Celebration Modal */}
      {firstUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            className="win-outset"
            style={{
              width: '400px',
              backgroundColor: '#c0c0c0',
              padding: '2px'
            }}
          >
            <div
              style={{
                backgroundColor: '#000080',
                color: '#fff',
                padding: '3px 6px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Windows 98 - Digital Memories</span>
              <button
                className="win-button"
                style={{ padding: '0 4px', fontSize: '9px' }}
                onClick={() => setFirstUploadModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
              <img src="/icons/my-pictures.svg" alt="" style={{ width: '40px', height: '40px' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px', color: '#000080' }}>
                  Welcome to your digital memories!
                </div>
                <div style={{ fontSize: '11px', lineHeight: '1.4', color: '#222' }}>
                  (1998 scanner quality guaranteed!)
                  <br />
                  <br />
                  Your personal photos are now permanently preserved in this abandoned PC's local browser memory.
                  <br />
                  You can set them as wallpaper, open them in Paint, or generate vintage memes!
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 16px',
                borderTop: '1px solid #808080'
              }}
            >
              <button
                className="win-button"
                onClick={() => {
                  soundService.playClick();
                  setFirstUploadModal(false);
                }}
                style={{ padding: '4px 20px', fontWeight: 'bold' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {photoToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            className="win-outset"
            style={{
              width: '380px',
              backgroundColor: '#c0c0c0',
              padding: '2px'
            }}
          >
            <div
              style={{
                backgroundColor: '#000080',
                color: '#fff',
                padding: '3px 6px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Confirm File Delete</span>
              <button
                className="win-button"
                style={{ padding: '0 4px', fontSize: '9px' }}
                onClick={() => setPhotoToDelete(null)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src="/icons/warning.svg" alt="" style={{ width: '36px', height: '36px' }} />
              <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                Are you sure you want to permanently delete <strong>"{photoToDelete.name}"</strong>?
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
                onClick={confirmDeletePhoto}
                style={{ padding: '4px 16px', fontWeight: 'bold' }}
              >
                Yes
              </button>
              <button
                className="win-button"
                onClick={() => setPhotoToDelete(null)}
                style={{ padding: '4px 16px' }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renameTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            className="win-outset"
            style={{
              width: '360px',
              backgroundColor: '#c0c0c0',
              padding: '2px'
            }}
          >
            <div
              style={{
                backgroundColor: '#000080',
                color: '#fff',
                padding: '3px 6px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Rename Photo</span>
              <button
                className="win-button"
                style={{ padding: '0 4px', fontSize: '9px' }}
                onClick={() => setRenameTarget(null)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '11px' }}>Enter new name for file:</div>
              <input
                type="text"
                className="win-inset"
                value={newPhotoName}
                onChange={(e) => setNewPhotoName(e.target.value)}
                style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename();
                  if (e.key === 'Escape') setRenameTarget(null);
                }}
              />
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
                onClick={submitRename}
                style={{ padding: '4px 16px', fontWeight: 'bold' }}
              >
                OK
              </button>
              <button
                className="win-button"
                onClick={() => setRenameTarget(null)}
                style={{ padding: '4px 16px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Slideshow Fullscreen Modal */}
      {slideshowOpen && photos.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
              fontSize: '13px'
            }}
          >
            <div>
              <strong>Windows 98 Slideshow</strong> — {photos[slideshowIndex].name} ({slideshowIndex + 1} /{' '}
              {photos.length})
            </div>
            <button
              className="win-button"
              onClick={() => {
                soundService.playClick();
                setSlideshowOpen(false);
              }}
              style={{ padding: '4px 12px', fontWeight: 'bold' }}
            >
              ✕ Exit Slideshow (ESC)
            </button>
          </div>

          {/* Central Image with retro transition */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              overflow: 'hidden',
              padding: '10px'
            }}
          >
            <img
              key={photos[slideshowIndex].id}
              src={photoStorageService.getObjectUrl(photos[slideshowIndex])}
              alt={photos[slideshowIndex].name}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                animation: 'win98FadeIn 0.5s ease-in-out'
              }}
            />
          </div>

          {/* Bottom Controls Bar */}
          <div
            className="win-outset"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 16px',
              backgroundColor: '#c0c0c0'
            }}
          >
            <button
              className="win-button"
              onClick={() => {
                soundService.playClick();
                setSlideshowIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
              }}
              style={{ padding: '4px 12px' }}
            >
              ⏮️ Previous
            </button>

            <button
              className="win-button"
              onClick={() => {
                soundService.playClick();
                setSlideshowPlaying((p) => !p);
              }}
              style={{ padding: '4px 16px', fontWeight: 'bold' }}
            >
              {slideshowPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>

            <button
              className="win-button"
              onClick={() => {
                soundService.playClick();
                setSlideshowIndex((prev) => (prev + 1) % photos.length);
              }}
              style={{ padding: '4px 12px' }}
            >
              Next ⏭️
            </button>

            <div style={{ width: '1px', height: '20px', backgroundColor: '#808080' }} />

            <button
              className="win-button"
              onClick={() => handleSetWallpaper(photos[slideshowIndex])}
              style={{ padding: '4px 12px' }}
            >
              🖥️ Set as Wallpaper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
