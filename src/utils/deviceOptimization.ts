// Device optimization utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  // Check device memory if available
  const memory = (navigator as any).deviceMemory;
  return memory ? memory <= 4 : false;
};

export const shouldReduceAnimations = () => {
  if (typeof window === 'undefined') return false;
  return isMobile() || isLowEndDevice() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getOptimizedStarCount = () => {
  if (isMobile()) {
    return {
      layer1: 50,  // Reduced from 200
      layer2: 30,  // Reduced from 100
      layer3: 10,  // Reduced from 50
    };
  }
  return {
    layer1: 200,
    layer2: 100,
    layer3: 50,
  };
};

export const getOptimizedAnimationConfig = () => {
  const shouldReduce = shouldReduceAnimations();
  return {
    disableAnimations: shouldReduce,
    reducedMotion: shouldReduce ? 'reduce' : 'auto',
    stiffness: shouldReduce ? 50 : 15,
    damping: shouldReduce ? 50 : 10,
  };
};
