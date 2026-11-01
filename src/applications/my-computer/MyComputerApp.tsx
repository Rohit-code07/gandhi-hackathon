import React, { useState } from 'react';
import { DEFAULT_DRIVES } from '../../services/virtualFileSystem';
import { useWindowStore } from '../../store/windowStore';

export const MyComputerApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [selectedDrive, setSelectedDrive] = useState<string | null>('C:');
  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [floppyError, setFloppyError] = useState<string | null>(null);

  const handleDriveDoubleClick = (letter: string) => {
    if (letter === 'C:') {
      openWindow('file-explorer', 'Local Disk (C:)', '/icons/hard-drive.svg', undefined, {
        initialPath: 'C:'
      });
    } else if (letter === 'A:') {
      setFloppyError('A:\\ is not accessible. The device is not ready. Please insert a floppy disk.');
    } else if (letter === 'D:') {
      openWindow('file-explorer', 'CD-ROM (D:) - NFS 2 SE', '/icons/cd-drive.svg', undefined, {
        initialPath: 'D:'
      });
    }
  };

  const cDrive = DEFAULT_DRIVES.find((d) => d.letter === 'C:')!;
  const usedPercent = Math.round(((cDrive.totalBytes - cDrive.freeBytes) / cDrive.totalBytes) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item"><u>F</u>ile</div>
        <div className="win-menu-item"><u>E</u>dit</div>
        <div className="win-menu-item"><u>V</u>iew</div>
        <div className="win-menu-item"><u>H</u>elp</div>
      </div>

      {/* Floppy Error Dialog */}
      {floppyError && (
        <div
          className="win-outset"
          style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            width: '320px',
            padding: '12px',
            zIndex: 100,
            background: '#c0c0c0',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <img src="/icons/warning.svg" alt="" style={{ width: '32px', height: '32px' }} />
            <div style={{ fontSize: '11px' }}>{floppyError}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button className="win-button" onClick={() => setFloppyError(null)}>
              Cancel
            </button>
            <button className="win-button" onClick={() => setFloppyError(null)}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Drive Grid */}
      <div
        className="win-inset"
        style={{
          flex: 1,
          margin: '2px',
          padding: '16px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          background: '#ffffff'
        }}
      >
        {DEFAULT_DRIVES.map((d) => {
          const isSelected = selectedDrive === d.letter;
          return (
            <div
              key={d.letter}
              onClick={() => setSelectedDrive(d.letter)}
              onDoubleClick={() => handleDriveDoubleClick(d.letter)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90px',
                padding: '6px 4px',
                cursor: 'pointer',
                border: isSelected ? '1px dotted #000' : '1px solid transparent',
                backgroundColor: isSelected ? '#000080' : 'transparent',
                color: isSelected ? '#ffffff' : '#000000'
              }}
            >
              <img
                src={d.icon}
                alt={d.label}
                style={{ width: '32px', height: '32px', marginBottom: '4px', imageRendering: 'pixelated' }}
              />
              <span style={{ fontSize: '11px', textAlign: 'center', wordBreak: 'break-word' }}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Bar / Drive Details */}
      <div className="win-statusbar">
        <div className="win-status-pane">
          {selectedDrive === 'C:'
            ? `C: Capacity: 4.30 GB | Free: 2.64 GB (${100 - usedPercent}% free)`
            : selectedDrive === 'A:'
            ? '3½ Floppy (A:) | Capacity: 1.44 MB'
            : 'CD-ROM (D:) | Need For Speed II SE'}
        </div>
        <div style={{ width: '120px' }} className="win-status-pane">
          3 object(s)
        </div>
      </div>
    </div>
  );
};
