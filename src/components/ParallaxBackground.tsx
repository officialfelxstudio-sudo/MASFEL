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
      
      {/* Dynamic Nebula Clouds */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full blur-[100px]"
          style={{ background: `radial-gradient(circle, rgba(${themeColor}, ${config.isDark ? 0.03 : 0.05}) 0%, transparent 60%)` }}
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[80px]"
          style={{ background: `radial-gradient(circle, rgba(${themeColor}, ${config.isDark ? 0.04 : 0.06}) 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[30%] w-[50vw] h-[50vw] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, rgba(${themeColor}, ${config.isDark ? 0.02 : 0.04}) 0%, transparent 80%)` }}
        />
      </motion.div>

      {/* Layered Stars */}
      {renderStars(starsLayer1, yStarsSlow)}
      {renderStars(starsLayer2, yStarsMid)}
      {renderStars(starsLayer3, yStarsFast)}
      
    </div>
  );
}
