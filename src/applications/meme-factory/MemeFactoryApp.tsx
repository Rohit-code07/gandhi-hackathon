import React, { useState, useRef, useEffect } from 'react';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useStoryStore } from '../../store/storyStore';
import { StoredPhoto, photoStorageService } from '../../services/photoStorageService';

interface MemeItem {
  id: string;
  title: string;
  caption: string;
  svgPath: string;
}

interface MemeFactoryProps {
  customPhotoUrl?: string;
  customPhotoName?: string;
}

const MEME_GALLERY: MemeItem[] = [
  { id: 'meme-ie-loading', title: 'WHEN YOU OPEN INTERNET EXPLORER', caption: 'See you in 3-5 business days.', svgPath: '/memes/meme-ie-loading.svg' },
  { id: 'meme-bsod-fail', title: 'WHEN WINDOWS 98 CRASHES', caption: 'Congratulations. You achieved nothing.', svgPath: '/memes/meme-bsod-fail.svg' },
  { id: 'meme-dad-bill', title: 'WHEN DAD SEES THE TELEPHONE BILL', caption: 'MISSION FAILED. Run for your life.', svgPath: '/memes/meme-dad-bill.svg' },
  { id: 'meme-secret-folder', title: 'WHEN YOU OPEN C:/SECRET', caption: 'Brother, what have you done?!', svgPath: '/memes/meme-secret-folder.svg' },
  { id: 'meme-ram-out', title: 'RUNNING 2 APPS ON 64MB RAM', caption: 'Computer: *Makes Boeing 747 noises*', svgPath: '/memes/meme-ram-out.svg' },
  { id: 'meme-1159-pm', title: 'STUDENT SUBMITTING AT 11:59 PM', caption: 'Dial-up modem disconnected. Goodbye degree.', svgPath: '/memes/meme-1159-pm.svg' },
  { id: 'meme-download-exe', title: 'DOWNLOADING TOTALLY_SAFE_GAME.EXE', caption: 'Congrats! You unlocked 45 toolbars.', svgPath: '/memes/meme-download-exe.svg' },
  { id: 'meme-antivirus-everything', title: 'ANTIVIRUS DETECTING EVERYTHING', caption: 'Threat found: mouse_pointer.cur', svgPath: '/memes/meme-antivirus-everything.svg' },
  { id: 'meme-icq-waiting', title: 'WAITING FOR CRUSH TO REPLY ON ICQ', caption: 'After waiting 4 hours on dial-up: "k."', svgPath: '/memes/meme-icq-waiting.svg' },
  { id: 'meme-restart-fix', title: 'HOW TO FIX ANY PC IN 1998', caption: 'Hit monitor. 100% effective.', svgPath: '/memes/meme-restart-fix.svg' },
  { id: 'meme-clippy-help', title: 'CLIPPY DETECTING YOUR CONFIDENCE', caption: 'Would you like some unwanted advice?', svgPath: '/memes/meme-clippy-help.svg' },
  { id: 'meme-27-years-later', title: 'THE ABANDONED PC IN 2026', caption: 'Some memories never crash.', svgPath: '/memes/meme-27-years-later.svg' }
];

export const MemeFactoryApp: React.FC<MemeFactoryProps> = ({ customPhotoUrl, customPhotoName }) => {
  const { createFile } = useFilesystemStore();
  const { unlockDiscovery } = useStoryStore();

  const [activeTab, setActiveTab] = useState<'gallery' | 'generator'>(customPhotoUrl ? 'generator' : 'gallery');
  const [selectedMeme, setSelectedMeme] = useState<MemeItem>(MEME_GALLERY[0]);
  const [userPhotos, setUserPhotos] = useState<StoredPhoto[]>([]);

  // Generator state
  const [topText, setTopText] = useState<string>('WHEN YOU BOOT UP AN ABANDONED PC');
  const [bottomText, setBottomText] = useState<string>('AND WIN 1ST PRIZE AT IIT BHILAI');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(26);
  const [templateId, setTemplateId] = useState<string>(
    customPhotoUrl ? 'custom-passed-photo' : MEME_GALLERY[0].id
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    photoStorageService.getAllPhotos().then((photos) => {
      setUserPhotos(photos);
    });
  }, []);

  // Render canvas when generator params change
  useEffect(() => {
    if (activeTab !== 'generator') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let imgSrc = '';
    if (templateId === 'custom-passed-photo' && customPhotoUrl) {
      imgSrc = customPhotoUrl;
    } else if (templateId.startsWith('photo-')) {
      const p = userPhotos.find((photo) => photo.id === templateId);
      if (p) imgSrc = photoStorageService.getObjectUrl(p);
    } else {
      const curr = MEME_GALLERY.find((m) => m.id === templateId) || MEME_GALLERY[0];
      imgSrc = curr.svgPath;
    }

    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgSrc;

    img.onload = () => {
      // Draw image scaled to fit canvas with letterboxing if needed
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );

      // Render meme text with black stroke & bold impact style
      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
      ctx.textAlign = 'center';

      if (topText.trim()) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 40);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 40);
      }

      if (bottomText.trim()) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      }
    };
  }, [activeTab, topText, bottomText, textColor, fontSize, templateId, userPhotos, customPhotoUrl]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'retro_meme_1998.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    unlockDiscovery('meme-generator');
  };

  const handleSaveToMyPictures = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const name = prompt('Save meme as in C:/My Pictures:', 'hacker_meme.bmp');
    if (name) {
      await createFile('C:/My Pictures', name, dataUrl);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await photoStorageService.savePhoto(blob, name, 'C:/My Pictures');
        }
      }, 'image/png');
      unlockDiscovery('meme-generator');
      alert(`Meme successfully saved to C:/My Pictures/${name}!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Tab Header */}
      <div style={{ display: 'flex', gap: '3px', padding: '4px 6px 0 6px', background: '#c0c0c0', borderBottom: '1px solid #808080' }}>
        <button
          className={`win-button ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
          style={{ fontWeight: activeTab === 'gallery' ? 'bold' : 'normal' }}
        >
          🖼️ 1998 Meme Archives (12)
        </button>
        <button
          className={`win-button ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
          style={{ fontWeight: activeTab === 'generator' ? 'bold' : 'normal' }}
        >
          🎨 Custom Meme Generator
        </button>
      </div>

      {/* TAB 1: Gallery */}
      {activeTab === 'gallery' && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '4px', gap: '4px' }}>
          {/* Thumbnails Grid on Left */}
          <div
            className="win-inset"
            style={{
              width: '42%',
              background: '#ffffff',
              padding: '6px',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}
          >
            {MEME_GALLERY.map((meme) => {
              const isSelected = selectedMeme.id === meme.id;
              return (
                <div
                  key={meme.id}
                  onClick={() => setSelectedMeme(meme)}
                  style={{
                    border: isSelected ? '2px solid #000080' : '1px solid #dfdfdf',
                    padding: '3px',
                    cursor: 'pointer',
                    background: isSelected ? '#e0f0ff' : '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={meme.svgPath}
                    alt={meme.title}
                    style={{ width: '100%', height: '85px', objectFit: 'contain' }}
                  />
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                  >
                    {meme.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Large Meme Preview on Right */}
          <div
            className="win-inset"
            style={{
              flex: 1,
              background: '#222222',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              overflow: 'auto'
            }}
          >
            <img
              src={selectedMeme.svgPath}
              alt={selectedMeme.title}
              style={{
                maxWidth: '100%',
                maxHeight: '320px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                border: '2px solid #fff'
              }}
            />
            <div style={{ color: '#ffffff', marginTop: '12px', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#ffdd00' }}>
                {selectedMeme.title}
              </div>
              <div style={{ fontSize: '11px', color: '#ccc', fontStyle: 'italic', marginTop: '4px' }}>
                "{selectedMeme.caption}"
              </div>
              <button
                className="win-button"
                onClick={() => {
                  setTemplateId(selectedMeme.id);
                  setActiveTab('generator');
                }}
                style={{ marginTop: '8px', color: '#000' }}
              >
                Remix This Meme in Generator &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Meme Generator */}
      {activeTab === 'generator' && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '4px', gap: '6px' }}>
          {/* Controls Column */}
          <div
            className="win-outset"
            style={{
              width: '260px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '11px'
            }}
          >
            <div>
              <label><b>Choose Template:</b></label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                style={{ width: '100%', marginTop: '3px' }}
              >
                {customPhotoUrl && (
                  <option value="custom-passed-photo">
                    ⭐ Selected Photo ({customPhotoName || 'Custom'})
                  </option>
                )}
                <optgroup label="Uploaded / Personal Photos">
                  {userPhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      📷 {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Classic 1998 Memes">
                  {MEME_GALLERY.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label><b>Top Caption:</b></label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                style={{ width: '100%', marginTop: '3px' }}
              />
            </div>

            <div>
              <label><b>Bottom Caption:</b></label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                style={{ width: '100%', marginTop: '3px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label>Text Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '100%', height: '24px', cursor: 'pointer' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Font Size ({fontSize}px):</label>
                <input
                  type="range"
                  min="16"
                  max="36"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #808080', margin: '6px 0' }} />

            <button className="win-button" onClick={handleDownloadPNG} style={{ fontWeight: 'bold' }}>
              💾 Download as PNG
            </button>
            <button className="win-button" onClick={handleSaveToMyPictures}>
              📁 Save to C:/My Pictures
            </button>
          </div>

          {/* Canvas Preview Column */}
          <div
            className="win-inset"
            style={{
              flex: 1,
              background: '#333333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              overflow: 'auto'
            }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{
                boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                border: '2px solid #fff'
              }}
            />
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">Meme Factory 1998 - 12 Retro Templates Available</div>
        <div className="win-status-pane" style={{ width: '110px' }}>PNG Export Ready</div>
      </div>
    </div>
  );
};
