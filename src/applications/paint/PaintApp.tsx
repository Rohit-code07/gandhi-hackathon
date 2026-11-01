import React, { useRef, useState, useEffect } from 'react';
import { useFilesystemStore } from '../../store/filesystemStore';
import { VirtualFile } from '../../types/filesystem';

interface PaintProps {
  initialFile?: VirtualFile;
}

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

export const PaintApp: React.FC<PaintProps> = ({ initialFile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { createFile } = useFilesystemStore();

  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill'>('pencil');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(2);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (activeTool === 'fill') {
      // Basic canvas fill
      ctx.fillStyle = selectedColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
      } else if (activeTool === 'circle') {
        const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveToFilesystem = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const name = prompt('Save artwork name to C:/My Pictures:', 'my_artwork.bmp');
    if (name) {
      await createFile('C:/My Pictures', name, dataUrl);
      alert(`Artwork successfully saved as C:/My Pictures/${name}!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={handleClear}><u>C</u>lear</div>
        <div className="win-menu-item" onClick={handleSaveToFilesystem}><u>S</u>ave to My Pictures</div>
      </div>

      {/* Main Canvas + Tools Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '3px' }}>
        {/* Tool Box on the Left */}
        <div
          className="win-outset"
          style={{
            width: '64px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            padding: '3px',
            marginRight: '4px'
          }}
        >
          <button
            className={`win-button ${activeTool === 'pencil' ? 'active' : ''}`}
            onClick={() => setActiveTool('pencil')}
            title="Pencil"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            ✏️ Pen
          </button>
          <button
            className={`win-button ${activeTool === 'eraser' ? 'active' : ''}`}
            onClick={() => setActiveTool('eraser')}
            title="Eraser"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            🧹 Erase
          </button>
          <button
            className={`win-button ${activeTool === 'fill' ? 'active' : ''}`}
            onClick={() => setActiveTool('fill')}
            title="Fill"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            🪣 Fill
          </button>
          <button
            className={`win-button ${activeTool === 'line' ? 'active' : ''}`}
            onClick={() => setActiveTool('line')}
            title="Line"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            📏 Line
          </button>
          <button
            className={`win-button ${activeTool === 'rect' ? 'active' : ''}`}
            onClick={() => setActiveTool('rect')}
            title="Rectangle"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            ⬜ Rect
          </button>
          <button
            className={`win-button ${activeTool === 'circle' ? 'active' : ''}`}
            onClick={() => setActiveTool('circle')}
            title="Circle"
            style={{ minWidth: 'auto', padding: '3px' }}
          >
            ⭕ Circle
          </button>

          <div style={{ borderTop: '1px solid #808080', margin: '4px 0' }} />

          {/* Brush sizes */}
          <div style={{ fontSize: '10px', textAlign: 'center' }}>Size</div>
          {[1, 3, 6, 12].map((sz) => (
            <button
              key={sz}
              className={`win-button ${brushSize === sz ? 'active' : ''}`}
              onClick={() => setBrushSize(sz)}
              style={{ minWidth: 'auto', padding: '1px', fontSize: '10px' }}
            >
              {sz}px
            </button>
          ))}
        </div>

        {/* Canvas viewport */}
        <div
          className="win-inset"
          style={{
            flex: 1,
            overflow: 'auto',
            background: '#808080',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.5)',
              cursor: activeTool === 'eraser' ? 'cell' : 'crosshair'
            }}
          />
        </div>
      </div>

      {/* Color Palette at Bottom */}
      <div
        className="win-outset"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '4px',
          margin: '2px'
        }}
      >
        {/* Selected Color Box */}
        <div
          className="win-inset"
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: selectedColor,
            marginRight: '6px'
          }}
        />

        {/* 16 Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 16px)', gap: '2px' }}>
          {PALETTE.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: color,
                border: '1px solid #000',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
