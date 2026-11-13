import React, { useEffect, useState } from 'react';

export interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface FloatingHeartsContainerProps {
  hearts: FloatingHeart[];
  onRemoveHeart: (id: string) => void;
}

export const FloatingHeartsContainer: React.FC<FloatingHeartsContainerProps> = ({
  hearts,
  onRemoveHeart,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((heart) => (
        <HeartParticle key={heart.id} heart={heart} onComplete={() => onRemoveHeart(heart.id)} />
      ))}
    </div>
  );
};

const HeartParticle: React.FC<{ heart: FloatingHeart; onComplete: () => void }> = ({
  heart,
  onComplete,
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
      onComplete();
    }, 1100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!active) return null;

  return (
    <div
      style={{
        left: heart.x - heart.size / 2,
        top: heart.y - heart.size / 2,
        width: heart.size,
        height: heart.size,
      }}
      className="absolute animate-kawaii-heart select-none"
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[1px_2px_0px_#4A2B3F]">
        <path
          d="M16 28 C16 28, 4 20, 4 11 C4 6, 8 3, 12.5 3 C14.5 3, 15.5 4, 16 5 C16.5 4, 17.5 3, 19.5 3 C24 3, 28 6, 28 11 C28 20, 16 28, 16 28 Z"
          fill={heart.color}
          stroke="#4A2B3F"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
