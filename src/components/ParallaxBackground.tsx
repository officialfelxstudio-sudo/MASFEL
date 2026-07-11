import React, { useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
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
  const yBg = useTransform(smoothProgress, [0, 1], ['0%', mobile ? '10%' : '20%']);
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
      
      {/* Colorful Nebula Clouds */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        {/* Purple nebula - top left */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [config.isDark ? 0.18 : 0.12, config.isDark ? 0.28 : 0.18, config.isDark ? 0.18 : 0.12]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(120, 40, 200, 0.35) 0%, rgba(80, 20, 160, 0.1) 40%, transparent 70%)' }}
        />
        {/* Blue nebula - bottom right */}
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1],
            opacity: [config.isDark ? 0.15 : 0.1, config.isDark ? 0.25 : 0.15, config.isDark ? 0.15 : 0.1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] rounded-full blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(40, 100, 230, 0.3) 0%, rgba(20, 60, 180, 0.08) 45%, transparent 70%)' }}
        />
        {/* Pink nebula - center */}
        <motion.div
          animate={{ 
            scale: [1, 1.25, 1],
            opacity: [config.isDark ? 0.12 : 0.08, config.isDark ? 0.2 : 0.12, config.isDark ? 0.12 : 0.08]
          }}
          transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[25%] w-[55vw] h-[55vw] rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(200, 50, 150, 0.25) 0%, rgba(150, 30, 120, 0.06) 50%, transparent 75%)' }}
        />
        {/* Teal nebula - top right */}
        {!mobile && (
          <motion.div
            animate={{ 
              rotate: [180, 540],
              scale: [1, 1.4, 1],
              opacity: [config.isDark ? 0.1 : 0.07, config.isDark ? 0.18 : 0.1, config.isDark ? 0.1 : 0.07]
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-15%] w-[50vw] h-[50vw] rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(30, 180, 180, 0.25) 0%, rgba(20, 130, 140, 0.06) 45%, transparent 70%)' }}
          />
        )}
        {/* Deep indigo nebula - bottom left */}
        {!mobile && (
          <motion.div
            animate={{ 
              rotate: [90, 450],
              scale: [1, 1.35, 1],
              opacity: [config.isDark ? 0.12 : 0.08, config.isDark ? 0.22 : 0.12, config.isDark ? 0.12 : 0.08]
            }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-5%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[95px]"
            style={{ background: 'radial-gradient(circle, rgba(60, 20, 140, 0.3) 0%, rgba(40, 10, 100, 0.08) 40%, transparent 70%)' }}
          />
        )}
      </motion.div>

      {/* Layered Stars */}
      {renderStars(starsLayer1, yStarsSlow)}
      {renderStars(starsLayer2, yStarsMid)}
      {renderStars(starsLayer3, yStarsFast)}
      
    </div>
  );
}
