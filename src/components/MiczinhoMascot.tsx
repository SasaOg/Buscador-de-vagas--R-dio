import React from 'react';

export type MascotMood = 'happy' | 'searching' | 'empty' | 'saved';

interface MiczinhoMascotProps {
  mood?: MascotMood;
  className?: string;
  size?: number;
  showCaption?: boolean;
}

export const MiczinhoMascot: React.FC<MiczinhoMascotProps> = ({
  mood = 'happy',
  className = '',
  size = 96,
  showCaption = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center transition-transform ${
          mood === 'searching'
            ? 'animate-bounce'
            : mood === 'saved'
            ? 'scale-110'
            : 'hover:scale-105'
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[2px_3px_0px_#4A2B3F]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Headphone Arch - Solid Pink with Plum Contour (no rainbow stripes) */}
          <path
            d="M22 60 C22 28, 98 28, 98 60"
            stroke="#FF6FA5"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M22 60 C22 28, 98 28, 98 60"
            stroke="#4A2B3F"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sound waves when searching */}
          {mood === 'searching' && (
            <>
              <path
                d="M10 50 C6 56, 6 64, 10 70"
                stroke="#FF6FA5"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d="M110 50 C114 56, 114 64, 110 70"
                stroke="#FF6FA5"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </>
          )}

          {/* Stand Base - Butter-Yellow with Plum Contour */}
          <ellipse cx="60" cy="110" rx="22" ry="6" fill="#FFE9A8" stroke="#4A2B3F" strokeWidth="3" />
          <path d="M60 88 L60 108" stroke="#4A2B3F" strokeWidth="6" strokeLinecap="round" />
          <path d="M52 86 Q60 92 68 86" stroke="#4A2B3F" strokeWidth="4" strokeLinecap="round" />

          {/* Microphone Body Capsule - Cream Head */}
          <rect
            x="36"
            y="28"
            width="48"
            height="60"
            rx="24"
            fill="#FFFDF7"
            stroke="#4A2B3F"
            strokeWidth="3.5"
          />

          {/* Top Section - Light Blue Band with Grill Lines */}
          <path
            d="M37 50 C37 32, 83 32, 83 50 Z"
            fill="#9ED8FF"
            stroke="#4A2B3F"
            strokeWidth="3"
          />
          {/* Grill Lines */}
          <line x1="45" y1="38" x2="75" y2="38" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="44" x2="78" y2="44" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="32" x2="60" y2="50" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />

          {/* Blushing Cheeks - Pink */}
          <circle cx="44" cy="68" r="4.5" fill="#FF6FA5" opacity="0.8" />
          <circle cx="76" cy="68" r="4.5" fill="#FF6FA5" opacity="0.8" />

          {/* Mascot Eyes depending on mood */}
          {mood === 'happy' && (
            <>
              {/* Happy curved eyes ^^ */}
              <path
                d="M45 61 Q49 56 53 61"
                stroke="#4A2B3F"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M67 61 Q71 56 75 61"
                stroke="#4A2B3F"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Smiling mouth */}
              <path
                d="M56 68 Q60 74 64 68"
                stroke="#4A2B3F"
                strokeWidth="3"
                strokeLinecap="round"
                fill="#FF6FA5"
              />
            </>
          )}

          {mood === 'searching' && (
            <>
              {/* Alert wide eyes with white sparkles */}
              <circle cx="49" cy="60" r="5" fill="#4A2B3F" />
              <circle cx="71" cy="60" r="5" fill="#4A2B3F" />
              <circle cx="47.5" cy="58.5" r="1.8" fill="#FFFFFF" />
              <circle cx="69.5" cy="58.5" r="1.8" fill="#FFFFFF" />
              <ellipse cx="60" cy="71" rx="3.5" ry="4" fill="#FF6FA5" stroke="#4A2B3F" strokeWidth="2" />
            </>
          )}

          {mood === 'empty' && (
            <>
              <circle cx="49" cy="61" r="4" fill="#4A2B3F" />
              <circle cx="71" cy="61" r="4" fill="#4A2B3F" />
              <circle cx="47.5" cy="59.5" r="1.5" fill="#FFFFFF" />
              <circle cx="69.5" cy="59.5" r="1.5" fill="#FFFFFF" />
              <path
                d="M57 70 Q60 67 63 70"
                stroke="#4A2B3F"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {mood === 'saved' && (
            <>
              {/* Star eyes */}
              <path
                d="M49 55 L51 59 L55 60 L52 63 L53 67 L49 65 L45 67 L46 63 L43 60 L47 59 Z"
                fill="#FFE9A8"
                stroke="#4A2B3F"
                strokeWidth="2"
              />
              <path
                d="M71 55 L73 59 L77 60 L74 63 L75 67 L71 65 L67 67 L68 63 L65 60 L69 59 Z"
                fill="#FFE9A8"
                stroke="#4A2B3F"
                strokeWidth="2"
              />
              <path
                d="M55 68 Q60 76 65 68 Z"
                fill="#F2394F"
                stroke="#4A2B3F"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* Headphone Ear Cushions - Butter-Yellow with Pink Dot */}
          <rect
            x="18"
            y="48"
            width="14"
            height="26"
            rx="7"
            fill="#FFE9A8"
            stroke="#4A2B3F"
            strokeWidth="3.5"
          />
          <circle cx="25" cy="61" r="3" fill="#FF6FA5" />

          <rect
            x="88"
            y="48"
            width="14"
            height="26"
            rx="7"
            fill="#FFE9A8"
            stroke="#4A2B3F"
            strokeWidth="3.5"
          />
          <circle cx="95" cy="61" r="3" fill="#FF6FA5" />
        </svg>
      </div>

      {showCaption && (
        <span className="mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6E7] dark:bg-[#3B2338] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F] dark:border-[#FFA6C9]">
          Miczinho
        </span>
      )}
    </div>
  );
};
