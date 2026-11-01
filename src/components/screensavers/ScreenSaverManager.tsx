import React, { useState, useEffect, useRef } from 'react';
import { useSettingsStore, ScreenSaverId } from '../../store/settingsStore';

export const ScreenSaverManager: React.FC = () => {
  const { screensaver, screensaverTimeout } = useSettingsStore();
  const [isActive, setIsActive] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<any>(null);

  // Inactivity detection
  useEffect(() => {
    if (screensaver === 'none') {
      setIsActive(false);
      return;
    }

    const resetTimer = () => {
      if (isActive) {
        setIsActive(false);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, screensaverTimeout * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [screensaver, screensaverTimeout, isActive]);

  // Screen saver canvas animations
  useEffect(() => {
    if (!isActive || screensaver === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId: number;

    // 1. STARFIELD
    if (screensaver === 'starfield') {
      const stars: { x: number; y: number; z: number }[] = Array.from({ length: 300 }, () => ({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width
      }));

      const render = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let star of stars) {
          star.z -= 4;
          if (star.z <= 0) {
            star.z = canvas.width;
            star.x = (Math.random() - 0.5) * canvas.width * 2;
            star.y = (Math.random() - 0.5) * canvas.height * 2;
          }

          const k = 250 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            const size = Math.max(1, (1 - star.z / canvas.width) * 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(px, py, size, size);
          }
        }
        animId = requestAnimationFrame(render);
      };
      render();
    }

    // 2. MATRIX RAIN
    else if (screensaver === 'matrix') {
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = Array.from({ length: columns }, () => 1);
      const characters = '0123456789ABCDEF$#@%&*+-=<>~';

      const render = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animId = requestAnimationFrame(render);
      };
      render();
    }

    // 3. BOUNCING DVD / LOGO
    else if (screensaver === 'dvd') {
      let x = 100;
      let y = 100;
      let dx = 3;
      let dy = 2.5;
      const boxW = 120;
      const boxH = 60;
      let color = '#ff0000';
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

      const render = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        x += dx;
        y += dy;

        if (x <= 0 || x + boxW >= canvas.width) {
          dx = -dx;
          color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (y <= 0 || y + boxH >= canvas.height) {
          dy = -dy;
          color = colors[Math.floor(Math.random() * colors.length)];
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, boxW, boxH);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WIN 98', x + boxW / 2, y + boxH / 2 + 5);

        animId = requestAnimationFrame(render);
      };
      render();
    }

    // 4. FLYING WINDOWS OR PIPES DEFAULT
    else {
      // Flying Windows logos
      const logos: { x: number; y: number; z: number; speed: number }[] = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 1
      }));

      const img = new Image();
      img.src = '/icons/win98.svg';

      const render = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let logo of logos) {
          logo.x += logo.speed * logo.z;
          if (logo.x > canvas.width + 60) {
            logo.x = -60;
            logo.y = Math.random() * canvas.height;
          }
          const size = 32 * logo.z;
          ctx.drawImage(img, logo.x, logo.y, size, size);
        }

        animId = requestAnimationFrame(render);
      };
      render();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, screensaver]);

  if (!isActive || screensaver === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999998,
        cursor: 'none'
      }}
      onClick={() => setIsActive(false)}
    />
  );
};
