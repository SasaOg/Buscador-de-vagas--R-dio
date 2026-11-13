import React from 'react';

export type CrewMood = 'happy' | 'sad';

interface MascotProps {
  mood?: CrewMood;
  size?: number;
  className?: string;
}

/**
 * 1. RADINHO VINTAGE (Para Vagas Salvas 💖)
 * Radinho portátil retrô com alça, antena, visor com coração e bochechas cor-de-rosa.
 */
export const RadinhoMascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 72,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[2px_2px_0px_#4A2B3F]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antena */}
        {mood === 'happy' ? (
          <>
            <line x1="28" y1="32" x2="16" y2="12" stroke="#4A2B3F" strokeWidth="3" strokeLinecap="round" />
            <circle cx="15" cy="11" r="4.5" fill="#FF6FA5" stroke="#4A2B3F" strokeWidth="2" />
            <path d="M10 8 Q15 3 20 8" stroke="#FFE9A8" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Antena caidinha / murcha */}
            <path d="M28 32 Q20 28 14 36" stroke="#4A2B3F" strokeWidth="3" strokeLinecap="round" />
            <circle cx="13" cy="37" r="4" fill="#FFA6C9" stroke="#4A2B3F" strokeWidth="2" />
          </>
        )}

        {/* Alça superior */}
        <path
          d="M36 32 C36 20, 64 20, 64 32"
          stroke="#4A2B3F"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Corpo do Rádio - Rosa Pastel com cantos bem arredondados */}
        <rect
          x="12"
          y="32"
          width="76"
          height="54"
          rx="14"
          fill="#FFD6E7"
          stroke="#4A2B3F"
          strokeWidth="3.5"
        />

        {/* Visor Superior com Coração 💖 */}
        <rect
          x="20"
          y="40"
          width="34"
          height="14"
          rx="5"
          fill="#FFFDF7"
          stroke="#4A2B3F"
          strokeWidth="2"
        />
        {/* Coração no visor */}
        <path
          d="M26 47 C26 44, 30 43, 31 46 C32 43, 36 44, 36 47 C36 50, 31 52, 31 52 C31 52, 26 50, 26 47 Z"
          fill={mood === 'happy' ? '#FF6FA5' : '#C5A6BC'}
        />
        <line x1="39" y1="44" x2="49" y2="44" stroke="#4A2B3F" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="39" y1="48" x2="47" y2="48" stroke="#4A2B3F" strokeWidth="1.5" strokeLinecap="round" />

        {/* Botão sintonizador rotativo */}
        <circle cx="68" cy="47" r="6" fill="#FFE9A8" stroke="#4A2B3F" strokeWidth="2.5" />
        <circle cx="80" cy="47" r="4" fill="#9ED8FF" stroke="#4A2B3F" strokeWidth="2" />

        {/* Alto-falante / Rosto do Radinho */}
        <circle cx="34" cy="67" r="13" fill="#FFFDF7" stroke="#4A2B3F" strokeWidth="2.5" />

        {/* Rostinho dentro do alto-falante */}
        {mood === 'happy' ? (
          <>
            {/* Olhinhos felizes */}
            <path d="M27 66 Q29 63 31 66" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
            <path d="M37 66 Q39 63 41 66" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
            {/* Sorriso */}
            <path d="M31 71 Q34 75 37 71" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" fill="#FF6FA5" />
            {/* Bochechas */}
            <circle cx="26" cy="69" r="1.5" fill="#FF6FA5" />
            <circle cx="42" cy="69" r="1.5" fill="#FF6FA5" />
          </>
        ) : (
          <>
            {/* Olhinhos tristes com lágrimas */}
            <circle cx="29" cy="66" r="2" fill="#4A2B3F" />
            <circle cx="39" cy="66" r="2" fill="#4A2B3F" />
            {/* Boquinha triste caidinha */}
            <path d="M31 73 Q34 70 37 73" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
            {/* Lagriminha azulzinha fofa */}
            <ellipse cx="26" cy="71" rx="1.5" ry="2.5" fill="#9ED8FF" />
          </>
        )}

        {/* Grades sonoras do lado direito */}
        <line x1="58" y1="62" x2="78" y2="62" stroke="#4A2B3F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="68" x2="78" y2="68" stroke="#4A2B3F" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="74" x2="74" y2="74" stroke="#4A2B3F" strokeWidth="2.5" strokeLinecap="round" />

        {/* Pezinhos de apoio */}
        <rect x="22" y="85" width="10" height="4" rx="2" fill="#4A2B3F" />
        <rect x="68" y="85" width="10" height="4" rx="2" fill="#4A2B3F" />
      </svg>
    </div>
  );
};

/**
 * 2. CASSETE CARTEIRA (Para Candidaturas Enviadas ⭐)
 * Fita cassete amarela e azul com selinho postal, rodinhas de fita e estrela dourada.
 */
export const CasseteMascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 72,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[2px_2px_0px_#4A2B3F]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Asinhas de carta ou estrelinhas quando feliz */}
        {mood === 'happy' && (
          <>
            <path
              d="M10 40 C6 35, 6 25, 14 30 C10 32, 10 38, 14 44 Z"
              fill="#FFFDF7"
              stroke="#4A2B3F"
              strokeWidth="2"
            />
            <path
              d="M90 40 C94 35, 94 25, 86 30 C90 32, 90 38, 86 44 Z"
              fill="#FFFDF7"
              stroke="#4A2B3F"
              strokeWidth="2"
            />
            {/* Estrelinha dourada acima da fita */}
            <path
              d="M50 14 L52 19 L57 20 L53 24 L54 29 L50 26 L46 29 L47 24 L43 20 L48 19 Z"
              fill="#FFE9A8"
              stroke="#4A2B3F"
              strokeWidth="2"
            />
          </>
        )}

        {/* Corpo da Fita Cassete - Amarelo Manteiga Pastel */}
        <rect
          x="14"
          y="28"
          width="72"
          height="50"
          rx="8"
          fill="#FFE9A8"
          stroke="#4A2B3F"
          strokeWidth="3.5"
        />

        {/* Rótulo central branco */}
        <rect
          x="20"
          y="35"
          width="60"
          height="32"
          rx="5"
          fill="#FFFDF7"
          stroke="#4A2B3F"
          strokeWidth="2.5"
        />

        {/* Faixa azul no rótulo */}
        <path d="M21 42 H79" stroke="#9ED8FF" strokeWidth="4" />

        {/* Rodinha da esquerda */}
        <circle cx="34" cy="51" r="7" fill="#FFFDF7" stroke="#4A2B3F" strokeWidth="2.5" />
        <circle cx="34" cy="51" r="3" fill="#4A2B3F" />

        {/* Rodinha da direita */}
        <circle cx="66" cy="51" r="7" fill="#FFFDF7" stroke="#4A2B3F" strokeWidth="2.5" />
        <circle cx="66" cy="51" r="3" fill="#4A2B3F" />

        {/* Janelinha central com o rostinho da fita */}
        <rect
          x="43"
          y="44"
          width="14"
          height="14"
          rx="3"
          fill="#FFD6E7"
          stroke="#4A2B3F"
          strokeWidth="2"
        />

        {mood === 'happy' ? (
          <>
            {/* Olhos de estrela ou piscadela fofa */}
            <circle cx="47" cy="49" r="1.5" fill="#4A2B3F" />
            <circle cx="53" cy="49" r="1.5" fill="#4A2B3F" />
            {/* Boquinha sorrindo */}
            <path d="M48 53 Q50 56 52 53" stroke="#4A2B3F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bochechinhas */}
            <circle cx="45" cy="51" r="1" fill="#FF6FA5" />
            <circle cx="55" cy="51" r="1" fill="#FF6FA5" />
          </>
        ) : (
          <>
            {/* Olhinhos tristonhos */}
            <circle cx="47" cy="50" r="1.5" fill="#4A2B3F" />
            <circle cx="53" cy="50" r="1.5" fill="#4A2B3F" />
            {/* Boquinha triste */}
            <path d="M48 55 Q50 52 52 55" stroke="#4A2B3F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Lágrima */}
            <ellipse cx="44" cy="53" rx="1" ry="1.5" fill="#9ED8FF" />
          </>
        )}

        {/* Fita enrolada conectando os orifícios */}
        <line x1="41" y1="51" x2="43" y2="51" stroke="#4A2B3F" strokeWidth="1.5" />
        <line x1="57" y1="51" x2="59" y2="51" stroke="#4A2B3F" strokeWidth="1.5" />

        {/* Base trapezoidal inferior típica de fita K7 */}
        <path
          d="M26 77 L34 71 H66 L74 77 Z"
          fill="#FFFDF7"
          stroke="#4A2B3F"
          strokeWidth="2"
        />
        <circle cx="38" cy="74" r="1.5" fill="#4A2B3F" />
        <circle cx="62" cy="74" r="1.5" fill="#4A2B3F" />
      </svg>
    </div>
  );
};

/**
 * 3. MESA DJ ARCO-ÍRIS (Para Entrevistas & Testes 🌈)
 * Console de áudio kawaii com faders em arco-íris, leds cintilantes e expressão radiante de entrar no ar!
 */
export const MesaDJMascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 72,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[2px_2px_0px_#4A2B3F]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arco-íris mágico saindo da mesa quando feliz */}
        {mood === 'happy' && (
          <>
            <path
              d="M26 22 C26 12, 74 12, 74 22"
              stroke="#FF6FA5"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M31 24 C31 16, 69 16, 69 24"
              stroke="#FFE9A8"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M36 26 C36 20, 64 20, 64 26"
              stroke="#9ED8FF"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Estrelinhas de brilho no topo do arco-íris */}
            <circle cx="50" cy="8" r="2" fill="#FFE9A8" />
          </>
        )}

        {/* Chassi da Mesa de Som - Azul Céu Pastel */}
        <rect
          x="12"
          y="28"
          width="76"
          height="54"
          rx="12"
          fill="#9ED8FF"
          stroke="#4A2B3F"
          strokeWidth="3.5"
        />

        {/* Painel Frontal Creme */}
        <rect
          x="18"
          y="35"
          width="64"
          height="40"
          rx="8"
          fill="#FFFDF7"
          stroke="#4A2B3F"
          strokeWidth="2.5"
        />

        {/* Seção Esquerda: 3 Faders de Volume coloridos */}
        {/* Fader 1 (Rosa) */}
        <line x1="26" y1="42" x2="26" y2="67" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="23"
          y={mood === 'happy' ? 46 : 60}
          width="6"
          height="5"
          rx="1.5"
          fill="#FF6FA5"
          stroke="#4A2B3F"
          strokeWidth="1.5"
        />

        {/* Fader 2 (Amarelo) */}
        <line x1="34" y1="42" x2="34" y2="67" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="31"
          y={mood === 'happy' ? 44 : 62}
          width="6"
          height="5"
          rx="1.5"
          fill="#FFE9A8"
          stroke="#4A2B3F"
          strokeWidth="1.5"
        />

        {/* Fader 3 (Verde) */}
        <line x1="42" y1="42" x2="42" y2="67" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="39"
          y={mood === 'happy' ? 48 : 58}
          width="6"
          height="5"
          rx="1.5"
          fill="#C8EC8A"
          stroke="#4A2B3F"
          strokeWidth="1.5"
        />

        {/* Seção Direita: Rostinho e VU Meter de Leds */}
        {/* VU Leds */}
        <circle cx="56" cy="42" r="2" fill={mood === 'happy' ? '#C8EC8A' : '#C5A6BC'} />
        <circle cx="63" cy="42" r="2" fill={mood === 'happy' ? '#FFE9A8' : '#C5A6BC'} />
        <circle cx="70" cy="42" r="2" fill={mood === 'happy' ? '#FF6FA5' : '#C5A6BC'} />

        {/* Rostinho Kawaii da Mesa */}
        {mood === 'happy' ? (
          <>
            {/* Olhos animados com estrelinha */}
            <path d="M54 53 Q57 49 60 53" stroke="#4A2B3F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M66 53 Q69 49 72 53" stroke="#4A2B3F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sorriso aberto */}
            <path
              d="M58 59 Q63 65 68 59 Z"
              fill="#FF6FA5"
              stroke="#4A2B3F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Bochechas coradas */}
            <circle cx="52" cy="56" r="2" fill="#FF6FA5" opacity="0.8" />
            <circle cx="74" cy="56" r="2" fill="#FF6FA5" opacity="0.8" />
          </>
        ) : (
          <>
            {/* Olhos tristes */}
            <circle cx="57" cy="52" r="2.5" fill="#4A2B3F" />
            <circle cx="69" cy="52" r="2.5" fill="#4A2B3F" />
            {/* Boquinha triste caidinha */}
            <path d="M60 61 Q63 57 66 61" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
            {/* Lágrima */}
            <ellipse cx="53" cy="56" rx="1.5" ry="2" fill="#9ED8FF" />
          </>
        )}

        {/* Knobs inferiores giratórios */}
        <circle cx="58" cy="68" r="3" fill="#FFE9A8" stroke="#4A2B3F" strokeWidth="1.5" />
        <circle cx="68" cy="68" r="3" fill="#FFD6E7" stroke="#4A2B3F" strokeWidth="1.5" />

        {/* Pés de borracha */}
        <rect x="22" y="81" width="10" height="4" rx="2" fill="#4A2B3F" />
        <rect x="68" y="81" width="10" height="4" rx="2" fill="#4A2B3F" />
      </svg>
    </div>
  );
};

/**
 * 4. MICZINHO TRISTE / VAZIO (Para a biblioteca vazia)
 */
export const MiczinhoSad: React.FC<MascotProps> = ({ size = 80, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-[2px_3px_0px_#4A2B3F]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arco de Fone - Levemente caidinho */}
        <path
          d="M24 64 C24 34, 96 34, 96 64"
          stroke="#FF6FA5"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M24 64 C24 34, 96 34, 96 64"
          stroke="#4A2B3F"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Base de apoio */}
        <ellipse cx="60" cy="110" rx="22" ry="6" fill="#FFE9A8" stroke="#4A2B3F" strokeWidth="3" />
        <path d="M60 88 L60 108" stroke="#4A2B3F" strokeWidth="6" strokeLinecap="round" />
        <path d="M52 86 Q60 92 68 86" stroke="#4A2B3F" strokeWidth="4" strokeLinecap="round" />

        {/* Corpo do Microfone */}
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

        {/* Topo Azul com Grade */}
        <path
          d="M37 50 C37 32, 83 32, 83 50 Z"
          fill="#9ED8FF"
          stroke="#4A2B3F"
          strokeWidth="3"
        />
        <line x1="45" y1="38" x2="75" y2="38" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="44" x2="78" y2="44" stroke="#4A2B3F" strokeWidth="2" strokeLinecap="round" />

        {/* Bochechas rosinhas */}
        <circle cx="44" cy="68" r="4.5" fill="#FFD6E7" stroke="#4A2B3F" strokeWidth="1" />
        <circle cx="76" cy="68" r="4.5" fill="#FFD6E7" stroke="#4A2B3F" strokeWidth="1" />

        {/* Olhinhos tristes caidinhos (🥺) */}
        <circle cx="49" cy="61" r="4.5" fill="#4A2B3F" />
        <circle cx="71" cy="61" r="4.5" fill="#4A2B3F" />
        <circle cx="47" cy="59" r="1.8" fill="#FFFFFF" />
        <circle cx="69" cy="59" r="1.8" fill="#FFFFFF" />

        {/* Boquinha dengosa tristonha */}
        <path
          d="M56 72 Q60 67 64 72"
          stroke="#4A2B3F"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gotinha de lágrima fofa */}
        <ellipse cx="43" cy="65" rx="2" ry="3" fill="#9ED8FF" stroke="#4A2B3F" strokeWidth="1" />

        {/* Almofadas de Fone caidinhas */}
        <rect
          x="18"
          y="52"
          width="14"
          height="26"
          rx="7"
          fill="#FFE9A8"
          stroke="#4A2B3F"
          strokeWidth="3.5"
        />
        <rect
          x="88"
          y="52"
          width="14"
          height="26"
          rx="7"
          fill="#FFE9A8"
          stroke="#4A2B3F"
          strokeWidth="3.5"
        />
      </svg>
    </div>
  );
};
