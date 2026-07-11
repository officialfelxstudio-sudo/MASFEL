import { useRef, useCallback } from 'react';

interface TiltStyle {
  transform: string;
  transition: string;
}

export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
  }, [maxTilt]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
  }, []);

  const style: TiltStyle = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
    transition: 'transform 0.3s ease-out',
  };

  return { ref, onMouseMove, onMouseLeave, style };
}
