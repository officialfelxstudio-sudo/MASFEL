import React, { HTMLAttributes } from 'react';
import { useNeu, NeuShape } from '../contexts/NeuContext';

interface NeuContainerProps extends HTMLAttributes<HTMLDivElement> {
  shape?: NeuShape;
  overrideDistance?: number;
  overrideRadius?: number;
  overrideBlur?: number;
  className?: string;
}

export const NeuContainer: React.FC<NeuContainerProps> = ({ 
  children, 
  shape, 
  overrideDistance, 
  overrideRadius,
  overrideBlur,
  className = '', 
  style,
  ...props 
}) => {
  const { config } = useNeu();
  
  const finalShape = shape || config.shape;
  const d = overrideDistance !== undefined ? overrideDistance : config.distance;
  const r = overrideRadius !== undefined ? overrideRadius : config.radius;
  const b = overrideBlur !== undefined ? overrideBlur : config.blur;
  
  const shadowDark = `var(--neu-shadow-dark)`;
  const shadowLight = `var(--neu-shadow-light)`;
  
  let background = 'var(--bg-color)';
  let boxShadow = '';

  if (finalShape === 'flat') {
    boxShadow = `${d}px ${d}px ${b}px ${shadowDark}, -${d}px -${d}px ${b}px ${shadowLight}`;
  } else if (finalShape === 'pressed') {
    boxShadow = `inset ${d}px ${d}px ${b}px ${shadowDark}, inset -${d}px -${d}px ${b}px ${shadowLight}`;
  } else if (finalShape === 'concave') {
    background = `linear-gradient(145deg, var(--neu-gradient-darker), var(--neu-gradient-lighter))`;
    boxShadow = `${d}px ${d}px ${b}px ${shadowDark}, -${d}px -${d}px ${b}px ${shadowLight}`;
  } else if (finalShape === 'convex') {
    background = `linear-gradient(145deg, var(--neu-gradient-lighter), var(--neu-gradient-darker))`;
    boxShadow = `${d}px ${d}px ${b}px ${shadowDark}, -${d}px -${d}px ${b}px ${shadowLight}`;
  }

  return (
    <div 
      className={className}
      style={{
        background,
        boxShadow,
        borderRadius: `${r}px`,
        transition: 'all 0.3s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
