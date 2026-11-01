import React, { useState, useEffect } from 'react';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useWindowStore } from '../../store/windowStore';
import { useStoryStore } from '../../store/storyStore';
import { VirtualFile } from '../../types/filesystem';

interface FileExplorerProps {
  initialPath?: string;
  searchOpen?: boolean;
}

export const FileExplorerApp: React.FC<FileExplorerProps> = ({
  initialPath = 'C:',
  searchOpen = false
}) => {
  const {
    files,
    createFile,
    createFolder,
    deleteFile,
    restoreFile,
    renameFile,
    setClipboard,
    pasteClipboard,
    clipboard
  } = useFilesystemStore();
  const { openWindow } = useWindowStore();
  const { unlockDiscovery } = useStoryStore();

  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRenamingId, setIsRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  useEffect(() => {
    // Secret Folder Discovery check
    if (currentPath.toLowerCase().includes('secret/do_not_open')) {
      unlockDiscovery('secret-folder');
    }
  }, [currentPath, unlockDiscovery]);

  const navigateTo = (newPath: string) => {
    const clean = newPath.replace(/\/+$/, '');
    if (clean === currentPath) return;
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(clean);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setCurrentPath(clean);
    setSelectedFileId(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedFileId(null);
    }
  };

  const goUp = () => {
    if (currentPath === 'C:' || currentPath === 'D:' || currentPath === 'A:') return;
    const parts = currentPath.split('/');
    parts.pop();
    const upPath = parts.join('/') || 'C:';
    navigateTo(upPath);
  };

  // Get items in current directory or search query
  const items = files.filter((f) => {
    if (searchQuery.trim()) {
      return (
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.content && f.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return f.parentPath.toLowerCase() === currentPath.toLowerCase();
  });

  const handleItemDoubleClick = (file: VirtualFile) => {
    if (file.type === 'folder' || file.type === 'drive') {
      navigateTo(file.path);
    } else {
      // Open file according to extension
      if (file.name === 'ILOVEYOU.exe') {
        openWindow('fake-virus');
      } else if (file.extension === 'txt' || file.extension === 'bat' || file.extension === 'wsz') {
        openWindow('notepad', `${file.name} - Notepad`, '/icons/notepad.svg', undefined, { file });
      } else if (file.extension === 'bmp' || file.extension === 'jpg') {
        if (file.name.includes('family_trip')) {
          unlockDiscovery('old-photo');
          openWindow('old-photo');
        } else {
          openWindow('paint', `${file.name} - Paint`, '/icons/paint.svg', undefined, { file });
        }
      } else {
        openWindow('notepad', `${file.name} - Notepad`, '/icons/notepad.svg', undefined, { file });
      }
    }
  };

  const handleNewFolder = async () => {
    const name = prompt('Enter folder name:', 'New Folder');
    if (name) {
      await createFolder(currentPath, name);
    }
  };

  const handleNewFile = async () => {
    const name = prompt('Enter document name:', 'New Document.txt');
    if (name) {
      await createFile(currentPath, name, '');
    }
  };

  const handleDelete = async () => {
    if (!selectedFileId) return;
    const file = files.find((f) => f.id === selectedFileId);
    if (!file) return;
    if (confirm(`Are you sure you want to delete '${file.name}'?`)) {
      await deleteFile(file.id);
      setSelectedFileId(null);
    }
  };

  const handleStartRename = () => {
    if (!selectedFileId) return;
    const file = files.find((f) => f.id === selectedFileId);
    if (!file) return;
    setIsRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleFinishRename = async () => {
    if (isRenamingId && renameValue.trim()) {
      await renameFile(isRenamingId, renameValue.trim());
    }
    setIsRenamingId(null);
  };

  const isRecycleBin = currentPath === 'C:/Recycle Bin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={handleNewFolder}><u>N</u>ew Folder</div>
        <div className="win-menu-item" onClick={handleNewFile}>New <u>F</u>ile</div>
        <div className="win-menu-item" onClick={handleStartRename}><u>R</u>ename</div>
        <div className="win-menu-item" onClick={handleDelete}><u>D</u>elete</div>
        {clipboard && (
          <div className="win-menu-item" onClick={() => pasteClipboard(currentPath)}>
            <u>P</u>aste
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 6px',
          borderBottom: '1px solid #808080'
        }}
      >
        <button
          className="win-button"
          onClick={goBack}
          disabled={historyIndex <= 0}
          style={{ minWidth: '55px' }}
        >
          &larr; Back
        </button>
        <button
          className="win-button"
          onClick={goUp}
          disabled={currentPath === 'C:' || currentPath === 'D:' || currentPath === 'A:'}
          style={{ minWidth: '45px' }}
        >
          &#8679; Up
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, marginLeft: '6px' }}>
          <span style={{ fontSize: '11px' }}>Address:</span>
          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigateTo(currentPath);
            }}
            style={{ flex: 1, height: '20px' }}
          />
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px' }}>Find:</span>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '110px', height: '20px' }}
          />
        </div>
      </div>

      {/* Main File Table / Grid */}
      <div
        className="win-inset"
        style={{
          flex: 1,
          margin: '2px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          padding: '4px'
        }}
        onClick={() => setSelectedFileId(null)}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#dfdfdf', textAlign: 'left', borderBottom: '1px solid #808080' }}>
              <th style={{ padding: '3px 6px', width: '45%' }}>Name</th>
              <th style={{ padding: '3px 6px', width: '15%' }}>Size</th>
              <th style={{ padding: '3px 6px', width: '20%' }}>Type</th>
              <th style={{ padding: '3px 6px', width: '20%' }}>Modified</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelected = selectedFileId === item.id;
              const isRenaming = isRenamingId === item.id;
              return (
                <tr
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFileId(item.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleItemDoubleClick(item);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#000080' : 'transparent',
                    color: isSelected ? '#ffffff' : '#000000',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <td style={{ padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img
                      src={item.icon || (item.type === 'folder' ? '/icons/folder.svg' : '/icons/file-text.svg')}
                      alt=""
                      style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
                    />
                    {isRenaming ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleFinishRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFinishRename();
                        }}
                        autoFocus
                        style={{ height: '16px', fontSize: '11px', padding: '0 2px' }}
                      />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '2px 6px' }}>
                    {item.type === 'folder' ? '' : `${Math.max(1, Math.round(item.size / 1024))} KB`}
                  </td>
                  <td style={{ padding: '2px 6px' }}>
                    {item.type === 'folder'
                      ? 'File Folder'
                      : item.extension === 'exe'
                      ? 'Application'
                      : item.extension === 'bmp' || item.extension === 'jpg'
                      ? 'Bitmap Image'
                      : 'Text Document'}
                  </td>
                  <td style={{ padding: '2px 6px' }}>{item.modifiedAt}</td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  This folder is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">
          {items.length} object(s) {searchQuery ? `(matching "${searchQuery}")` : ''}
        </div>
        {isRecycleBin && selectedFileId && (
          <button
            className="win-button"
            onClick={() => restoreFile(selectedFileId)}
            style={{ height: '18px', padding: '0 6px', fontSize: '10px' }}
          >
            Restore this file
          </button>
        )}
      </div>
    </div>
  );
};
