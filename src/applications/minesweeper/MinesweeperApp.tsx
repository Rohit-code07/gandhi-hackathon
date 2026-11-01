import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export const MinesweeperApp: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [minesLeft, setMinesLeft] = useState<number>(MINES);
  const [timer, setTimer] = useState<number>(0);
  const [isFaceScared, setIsFaceScared] = useState<boolean>(false);

  // Initialize Game
  const initGame = () => {
    let newGrid: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      let row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbor mine numbers
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(MINES);
    setTimer(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver || gameWon) return;
    const interval = setInterval(() => {
      setTimer((prev) => Math.min(999, prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon) return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    soundService.playClick();

    if (cell.isMine) {
      // Hit mine -> Game Over
      soundService.playError();
      setGameOver(true);
      // Reveal all mines
      setGrid((prev) =>
        prev.map((row) =>
          row.map((item) => (item.isMine ? { ...item, isRevealed: true } : item))
        )
      );
      return;
    }

    // Flood fill revealing blank cells
    const nextGrid = grid.map((row) => row.map((item) => ({ ...item })));
    const queue: [number, number][] = [[r, c]];
    nextGrid[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const currCell = nextGrid[currR][currC];

      if (currCell.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (
              nr >= 0 &&
              nr < ROWS &&
              nc >= 0 &&
              nc < COLS &&
              !nextGrid[nr][nc].isRevealed &&
              !nextGrid[nr][nc].isFlagged &&
              !nextGrid[nr][nc].isMine
            ) {
              nextGrid[nr][nc].isRevealed = true;
              if (nextGrid[nr][nc].neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    setGrid(nextGrid);

    // Check Win
    let unrevealedSafe = 0;
    for (let row of nextGrid) {
      for (let item of row) {
        if (!item.isMine && !item.isRevealed) unrevealedSafe++;
      }
    }
    if (unrevealedSafe === 0) {
      setGameWon(true);
      soundService.playDing();
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon) return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    soundService.playClick();
    const nextGrid = grid.map((row) => row.map((item) => ({ ...item })));
    nextGrid[r][c].isFlagged = !cell.isFlagged;
    setGrid(nextGrid);
    setMinesLeft((prev) => (cell.isFlagged ? prev + 1 : prev - 1));
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return '#0000ff';
      case 2: return '#008000';
      case 3: return '#ff0000';
      case 4: return '#000080';
      case 5: return '#800000';
      case 6: return '#008080';
      case 7: return '#000000';
      default: return '#808080';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#c0c0c0',
        padding: '8px',
        userSelect: 'none',
        height: '100%'
      }}
    >
      {/* Top Header Panel (Mines counter, smiley, timer) */}
      <div
        className="win-inset-gray"
        style={{
          width: '240px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          marginBottom: '8px'
        }}
      >
        {/* Mine counter */}
        <div
          style={{
            background: '#000000',
            color: '#ff0000',
            fontFamily: "'Courier New', monospace",
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '2px 4px'
          }}
        >
          {String(Math.max(0, minesLeft)).padStart(3, '0')}
        </div>

        {/* Smiley Reset Button */}
        <button
          className="win-button"
          onClick={initGame}
          style={{ minWidth: '30px', height: '30px', fontSize: '16px', padding: 0 }}
        >
          {gameWon ? '😎' : gameOver ? '😵' : isFaceScared ? '😮' : '🙂'}
        </button>

        {/* Timer */}
        <div
          style={{
            background: '#000000',
            color: '#ff0000',
            fontFamily: "'Courier New', monospace",
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '2px 4px'
          }}
        >
          {String(timer).padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div
        className="win-inset-gray"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 24px)`,
          gridTemplateRows: `repeat(${ROWS}, 24px)`,
          gap: '1px',
          padding: '2px',
          background: '#808080'
        }}
        onMouseDown={() => setIsFaceScared(true)}
        onMouseUp={() => setIsFaceScared(false)}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                className={cell.isRevealed ? 'win-inset' : 'win-outset'}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  backgroundColor: cell.isRevealed ? (cell.isMine ? '#ff4444' : '#c0c0c0') : '#c0c0c0',
                  color: getNumberColor(cell.neighborMines),
                  cursor: cell.isRevealed ? 'default' : 'pointer'
                }}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    '💣'
                  ) : cell.neighborMines > 0 ? (
                    cell.neighborMines
                  ) : (
                    ''
                  )
                ) : cell.isFlagged ? (
                  '🚩'
                ) : (
                  ''
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: '8px', fontSize: '11px', color: '#444' }}>
        Left-click to reveal. Right-click to flag.
      </div>
    </div>
  );
};
