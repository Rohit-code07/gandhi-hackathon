import React, { useState, useEffect } from 'react';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useStoryStore } from '../../store/storyStore';
import { VirtualFile } from '../../types/filesystem';

interface NotepadProps {
  initialFile?: VirtualFile;
}

export const NotepadApp: React.FC<NotepadProps> = ({ initialFile }) => {
  const { createFile, updateFileContent } = useFilesystemStore();
  const { unlockDiscovery } = useStoryStore();

  const [currentFile, setCurrentFile] = useState<VirtualFile | null>(initialFile || null);
  const [content, setContent] = useState<string>(initialFile?.content || '');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [showFindModal, setShowFindModal] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');

  useEffect(() => {
    if (initialFile) {
      setCurrentFile(initialFile);
      setContent(initialFile.content || '');
      setIsSaved(true);
      if (initialFile.name === 'diary.txt') {
        unlockDiscovery('diary');
      }
    }
  }, [initialFile, unlockDiscovery]);

  const handleSave = async () => {
    if (currentFile) {
      await updateFileContent(currentFile.path, content);
      setIsSaved(true);
    } else {
      const fileName = prompt('Enter file name to save in C:/My Documents:', 'untitled.txt');
      if (fileName) {
        const saved = await createFile('C:/My Documents', fileName, content);
        setCurrentFile(saved);
        setIsSaved(true);
      }
    }
  };

  const handleNew = () => {
    if (!isSaved && !confirm('Discard unsaved changes?')) return;
    setCurrentFile(null);
    setContent('');
    setIsSaved(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={handleNew}><u>N</u>ew</div>
        <div className="win-menu-item" onClick={handleSave}><u>S</u>ave</div>
        <div className="win-menu-item" onClick={() => setWordWrap(!wordWrap)}>
          {wordWrap ? '✓ ' : ''}<u>W</u>ord Wrap
        </div>
        <div className="win-menu-item" onClick={() => setShowFindModal(true)}><u>F</u>ind...</div>
      </div>

      {/* Find Modal */}
      {showFindModal && (
        <div
          className="win-outset"
          style={{
            position: 'absolute',
            top: '30px',
            left: '50px',
            width: '280px',
            padding: '10px',
            zIndex: 100,
            background: '#c0c0c0'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px' }}>Find what:</label>
            <input
              type="text"
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              style={{ flex: 1, height: '20px' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button
              className="win-button"
              onClick={() => {
                if (findQuery && content.includes(findQuery)) {
                  alert(`Found "${findQuery}" in document!`);
                } else {
                  alert(`Cannot find "${findQuery}"`);
                }
                setShowFindModal(false);
              }}
            >
              Find Next
            </button>
            <button className="win-button" onClick={() => setShowFindModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsSaved(false);
        }}
        wrap={wordWrap ? 'soft' : 'off'}
        style={{
          flex: 1,
          margin: '2px',
          padding: '8px',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '13px',
          lineHeight: '1.4',
          resize: 'none',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: 'none',
          outline: 'none'
        }}
        placeholder="Type notes here..."
      />

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">
          {currentFile ? currentFile.path : 'Untitled Document'} {!isSaved ? ' (Unsaved)' : ''}
        </div>
        <div className="win-status-pane" style={{ width: '100px' }}>
          {content.length} characters
        </div>
      </div>
    </div>
  );
};
