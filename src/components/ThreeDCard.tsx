import { useState, useRef, MouseEvent, ReactNode } from 'react';

interface ThreeDCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // Max degrees of tilt
  scale?: number; // Scale on hover
  id?: string;
  key?: string | number;
}

export default function ThreeDCard({
  children,
  className = '',
  maxTilt = 15,
  scale = 1.03,
  id
}: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    // Mouse coordinates relative to card element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Relative mouse position from -0.5 to +0.5
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    // Calculate rotation angles (tilt values)
    const calculatedRotateX = -yc * maxTilt;
    const calculatedRotateY = xc * maxTilt;

    setRotateX(calculatedRotateX);
    setRotateY(calculatedRotateY);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  const styles = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.5s ease',
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={styles}
      className={`preserve-3d transition-shadow duration-300 relative overflow-hidden ${
        isHovered ? 'shadow-2xl ring-1 ring-black/5 dark:ring-white/10' : 'shadow-md'
      } ${className}`}
    >
      <div className="preserve-3d w-full h-full relative z-10">
        {children}
      </div>

      {/* Futuristic Glass/Glossy Glare Effect Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay dark:mix-blend-screen"
        style={{
          opacity: isHovered ? 0.65 : 0,
          background: `
            radial-gradient(
              circle 240px at ${glareX}% ${glareY}%, 
              rgba(255, 255, 255, 0.55) 0%, 
              rgba(255, 255, 255, 0.25) 20%, 
              rgba(168, 85, 247, 0.15) 40%, 
              rgba(59, 130, 246, 0.08) 60%, 
              rgba(255, 255, 255, 0) 80%
            )
          `
        }}
      />
      
      {/* Dynamic diagonal razor-sharp specular highlights */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-color-dodge"
        style={{
          opacity: isHovered ? 0.5 : 0,
          background: `
            linear-gradient(
              ${115 + (rotateY * 2)}deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0) ${Math.max(0, 30 - rotateX)}%,
              rgba(255, 255, 255, 0.35) ${Math.max(10, 50 - rotateX * 1.5)}%,
              rgba(255, 255, 255, 0.65) ${50 - rotateX * 1.5 + 2}%,
              rgba(255, 255, 255, 0.35) ${Math.min(90, 50 - rotateX * 1.5 + 4)}%,
              rgba(255, 255, 255, 0) ${Math.min(100, 70 - rotateX)}%,
              rgba(255, 255, 255, 0) 100%
            )
          `
        }}
      />

      {/* Surface ambient reflection */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20"
        style={{
          opacity: isHovered ? 0.08 : 0,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)'
        }}
      />
    </div>
  );
}
