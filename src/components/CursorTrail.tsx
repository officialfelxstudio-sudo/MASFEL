import { useEffect, useRef } from 'react';
import { isMobile } from '../utils/deviceOptimization';

interface TrailDot {
  x: number;
  y: number;
}

export default function CursorTrail() {
  if (isMobile()) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef<TrailDot[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const TRAIL_LENGTH = 8;
    trailRef.current = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trailRef.current[0].x += (mouseRef.current.x - trailRef.current[0].x) * 0.3;
      trailRef.current[0].y += (mouseRef.current.y - trailRef.current[0].y) * 0.3;

      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trailRef.current[i].x += (trailRef.current[i - 1].x - trailRef.current[i].x) * 0.2;
        trailRef.current[i].y += (trailRef.current[i - 1].y - trailRef.current[i].y) * 0.2;
      }

      const isDark = document.documentElement.style.getPropertyValue('--bg-color') === '#1a1b1e' || 
                     getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim() === '#1a1b1e';

      for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
        const dot = trailRef.current[i];
        const progress = 1 - i / TRAIL_LENGTH;
        const radius = 2 + progress * 10;
        const opacity = progress * 0.25;

        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 3);
        if (isDark) {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
