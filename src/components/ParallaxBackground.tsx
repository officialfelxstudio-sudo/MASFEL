import React, { useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { useNeu } from '../contexts/NeuContext';
import { isMobile, getOptimizedStarCount } from '../utils/deviceOptimization';

export default function ParallaxBackground() {
  const { config } = useNeu();
  const { scrollYProgress } = useScroll();
  const mobile = isMobile();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: mobile ? 50 : 15,
    damping: mobile ? 50 : 10,
    restDelta: 0.001
  });

  // Layered parallax movements - reduce on mobile
  const yStarsSlow = useTransform(smoothProgress, [0, 1], ['0%', mobile ? '-5%' : '-10%']);
  const yStarsMid = useTransform(smoothProgress, [0, 1], ['0%', mobile ? '-15%' : '-30%']);
  const yStarsFast = useTransform(smoothProgress, [0, 1], ['0%', mobile ? '-30%' : '-60%']);

  // Generate stars - optimize for mobile
  const starCounts = getOptimizedStarCount();
  const { starsLayer1, starsLayer2, starsLayer3 } = useMemo(() => {
    const generateStars = (count: number, sizeMin: number, sizeMax: number) => 
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 150 - 25,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleDelay: Math.random() * 5,
        twinkleDuration: Math.random() * 4 + 2,
        isBright: Math.random() > 0.8
      }));
    
    return {
      starsLayer1: generateStars(starCounts.layer1, 0.5, 1.5),
      starsLayer2: generateStars(starCounts.layer2, 1, 2.5),
      starsLayer3: generateStars(starCounts.layer3, 2, 4),
    };
  }, [starCounts.layer1, starCounts.layer2, starCounts.layer3]);

  const themeColor = config.isDark ? '255, 255, 255' : '0, 0, 0';

  // Mouse parallax orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const orb1X = useSpring(mouseX, { stiffness: 15, damping: 20 });
  const orb1Y = useSpring(mouseY, { stiffness: 15, damping: 20 });
  const orb2X = useSpring(mouseX, { stiffness: 10, damping: 25 });
  const orb2Y = useSpring(mouseY, { stiffness: 10, damping: 25 });
  const orb3X = useSpring(mouseX, { stiffness: 20, damping: 15 });
  const orb3Y = useSpring(mouseY, { stiffness: 20, damping: 15 });

  useEffect(() => {
    if (mobile) return;
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x * 30);
      mouseY.set(y * 30);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [mobile, mouseX, mouseY]);

  const renderStars = (stars: any[], yTransform: any) => (
    <motion.div className="absolute inset-0 z-0" style={{ y: yTransform }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: `rgba(${themeColor}, 1)`,
            opacity: star.opacity,
            boxShadow: star.isBright && config.isDark ? `0 0 ${star.size * 3}px rgba(255,255,255,0.9)` : 'none'
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity * (star.isBright ? 1.5 : 1), star.opacity * 0.3],
            scale: star.isBright ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: star.twinkleDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.twinkleDelay
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[var(--bg-color)] transition-colors duration-500">
      
      {/* Layered Stars */}
      {renderStars(starsLayer1, yStarsSlow)}
      {renderStars(starsLayer2, yStarsMid)}
      {renderStars(starsLayer3, yStarsFast)}

      {/* Mouse Parallax Orbs */}
      {!mobile && (
        <>
          <motion.div
            className="absolute rounded-full blur-[80px]"
            style={{
              x: orb1X,
              y: orb1Y,
              top: '20%',
              left: '30%',
              width: 200,
              height: 200,
              background: `radial-gradient(circle, rgba(100, 120, 255, ${config.isDark ? 0.08 : 0.05}) 0%, transparent 70%)`,
            }}
          />
          <motion.div
            className="absolute rounded-full blur-[60px]"
            style={{
              x: orb2X,
              y: orb2Y,
              top: '60%',
              left: '60%',
              width: 150,
              height: 150,
              background: `radial-gradient(circle, rgba(180, 100, 220, ${config.isDark ? 0.06 : 0.04}) 0%, transparent 70%)`,
            }}
          />
          <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{
              x: orb3X,
              y: orb3Y,
              top: '40%',
              left: '15%',
              width: 180,
              height: 180,
              background: `radial-gradient(circle, rgba(100, 200, 220, ${config.isDark ? 0.05 : 0.03}) 0%, transparent 70%)`,
            }}
          />
        </>
      )}
      
    </div>
  );
}
