import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../../services/soundService';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 16;

export const SnakeApp: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 }
  ]);
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 12, y: 8 });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('win98_snake_high') || 0);
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some((p) => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  };

  const restartGame = () => {
    const initSnake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ];
    setSnake(initSnake);
    setDir({ x: 1, y: 0 });
    setFood(spawnFood(initSnake));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const current = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && current.y === 0) setDir({ x: 0, y: -1 });
      else if ((e.key === 'ArrowDown' || e.key === 's') && current.y === 0) setDir({ x: 0, y: 1 });
      else if ((e.key === 'ArrowLeft' || e.key === 'a') && current.x === 0) setDir({ x: -1, y: 0 });
      else if ((e.key === 'ArrowRight' || e.key === 'd') && current.x === 0) setDir({ x: 1, y: 0 });
      else if (e.key === ' ') setIsPaused((p) => !p);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game tick loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const nextX = (head.x + dirRef.current.x + GRID_SIZE) % GRID_SIZE;
        const nextY = (head.y + dirRef.current.y + GRID_SIZE) % GRID_SIZE;
        const newHead = { x: nextX, y: nextY };

        // Tail collision
        if (prev.some((p) => p.x === newHead.x && p.y === newHead.y)) {
          soundService.playError();
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          soundService.playClick();
          const nextScore = score + 10;
          setScore(nextScore);
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('win98_snake_high', String(nextScore));
          }
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, score, highScore]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#c0c0c0',
        padding: '8px',
        userSelect: 'none'
      }}
    >
      {/* Header Info */}
      <div
        className="win-inset-gray"
        style={{
          width: '260px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          marginBottom: '6px',
          fontSize: '11px',
          fontWeight: 'bold'
        }}
      >
        <span>Score: {score}</span>
        <button className="win-button" onClick={restartGame} style={{ minWidth: '50px' }}>
          Reset
        </button>
        <span>High: {highScore}</span>
      </div>

      {/* Snake LCD Screen */}
      <div
        className="win-inset"
        style={{
          width: '256px',
          height: '256px',
          backgroundColor: '#9bbc0f',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 16px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 16px)`,
          border: '2px solid #0f380f',
          boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.4)',
          position: 'relative'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: isSnake ? '#0f380f' : isFood ? '#8bac0f' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px'
              }}
            >
              {isFood ? '●' : ''}
            </div>
          );
        })}

        {isGameOver && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#0f380f',
              color: '#9bbc0f',
              padding: '8px 16px',
              fontWeight: 'bold',
              textAlign: 'center',
              border: '2px solid #9bbc0f'
            }}
          >
            GAME OVER
            <div style={{ fontSize: '10px', marginTop: '4px' }}>Click Reset to Play</div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '11px', color: '#444', marginTop: '8px' }}>
        Controls: Arrow Keys or W/A/S/D | Space to Pause
      </div>
    </div>
  );
};
