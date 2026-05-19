import { type FC, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VinylDiscProps {
  size: number;
  finishBackground: string;
  finishTranslucent?: boolean;
  finishColorful?: boolean;
  labelColor: string;
  albumTitle: string;
  artist: string;
  coverImage?: string;
  coverFilter?: string;
  isSpinning: boolean;
  rotation: number;
  tiltX?: number;
  tiltY?: number;
  shadowIntensity?: number;
  showGlint?: boolean;
  noPerspective?: boolean;
  style?: React.CSSProperties;
  onPointerDown?: (e: React.PointerEvent) => void;
}

const VinylDisc: FC<VinylDiscProps> = ({
  size,
  finishBackground,
  finishTranslucent = false,
  finishColorful = false,
  labelColor,
  albumTitle,
  coverImage,
  coverFilter,
  isSpinning,
  rotation,
  tiltX = 0,
  tiltY = 0,
  shadowIntensity = 1,
  showGlint = false,
  noPerspective = false,
  style,
  onPointerDown,
}) => {
  const isTranslucent = finishTranslucent;
  const isColorful = finishColorful;
  const grooveOpacity = isTranslucent ? 0.08 : isColorful ? 0.1 : 0.18;
  const highlightOpacity = isTranslucent ? 0.35 : isColorful ? 0.2 : 0.12;
  const labelSize = size * 0.33;

  const prevFinishRef = useRef(finishBackground);
  const pourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pourState, setPourState] = useState<{ from: string; to: string; active: boolean }>({ from: finishBackground, to: finishBackground, active: false });

  useEffect(() => {
    if (finishBackground !== prevFinishRef.current) {
      const oldFinish = prevFinishRef.current;
      prevFinishRef.current = finishBackground;
      if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
      setPourState({ from: oldFinish, to: finishBackground, active: true });
      pourTimerRef.current = setTimeout(() => {
        setPourState({ from: finishBackground, to: finishBackground, active: false });
      }, 2100);
    }
  }, [finishBackground]);

  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
        perspective: noPerspective ? 'none' : '800px',
        cursor: onPointerDown ? 'grab' : 'default',
        ...style,
      }}
    >
      {/* Drop shadow */}
      <div
        style={{
          position: 'absolute',
          width: size * 0.88,
          height: size * 0.88,
          borderRadius: '50%',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -46%) translate(${tiltY * 0.4}px, ${6 + tiltX * 0.3}px)`,
          background: `radial-gradient(ellipse, rgba(31, 36, 48, ${0.22 * shadowIntensity}) 0%, rgba(31, 36, 48, ${0.08 * shadowIntensity}) 40%, transparent 70%)`,
          filter: `blur(${14 + shadowIntensity * 10}px)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Disc body */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          position: 'relative',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          transformStyle: 'preserve-3d',
          zIndex: 1,
          background: pourState.active ? pourState.from : finishBackground,
          overflow: 'hidden',
        }}
      >
        {pourState.active && (
          <div
            key={pourState.to}
            style={{
              position: 'absolute',
              inset: 0,
              background: pourState.to,
              zIndex: 0,
              animation: 'vinyl-pour-in 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        )}
        {/* Outer edge ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,${highlightOpacity * 0.5}),
              0 0 0 1px rgba(0,0,0,0.1),
              inset 0 2px 0 rgba(255,255,255,${highlightOpacity}),
              inset 0 -2px 0 rgba(0,0,0,0.06)
            `,
            zIndex: 6,
            pointerEvents: 'none',
          }}
        />

        {/* Groove tracks - outer zone */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 2.2px,
              rgba(0,0,0,${grooveOpacity}) 2.4px,
              transparent 2.8px
            )`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Groove tracks - fine inner detail */}
        <div
          style={{
            position: 'absolute',
            inset: `${size * 0.18}px`,
            borderRadius: '50%',
            background: `repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 3.5px,
              rgba(0,0,0,${grooveOpacity * 0.5}) 3.8px,
              transparent 4.2px
            )`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Specular arc highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `linear-gradient(
              135deg,
              rgba(255,255,255,${highlightOpacity * 1.2}) 0%,
              rgba(255,255,255,${highlightOpacity * 0.4}) 15%,
              transparent 35%,
              transparent 65%,
              rgba(255,255,255,${highlightOpacity * 0.2}) 80%,
              rgba(255,255,255,${highlightOpacity * 0.5}) 100%
            )`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Reflective sheen arc */}
        <div
          style={{
            position: 'absolute',
            inset: `${size * 0.06}px`,
            borderRadius: '50%',
            background: `conic-gradient(
              from 120deg,
              transparent 0deg,
              rgba(255,255,255,${highlightOpacity * 0.6}) 30deg,
              transparent 80deg,
              transparent 200deg,
              rgba(255,255,255,${highlightOpacity * 0.3}) 240deg,
              transparent 280deg
            )`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Animated glinting effect */}
        {showGlint && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              zIndex: 4,
              pointerEvents: 'none',
              background: `conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(255,255,255,0.18) 15deg,
                transparent 35deg,
                transparent 180deg,
                rgba(255,255,255,0.1) 200deg,
                transparent 220deg
              )`,
            }}
            animate={isSpinning ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isSpinning ? {
              duration: 6,
              ease: 'linear',
              repeat: Infinity,
            } : { duration: 0.4 }}
          />
        )}

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            width: labelSize,
            height: labelSize,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: coverImage ? 'none' : `linear-gradient(145deg, ${labelColor}, ${labelColor}ee)`,
            boxShadow: `
              inset 0 1px 3px rgba(0,0,0,0.08),
              inset 0 -1px 2px rgba(255,255,255,0.3),
              0 0 0 1px rgba(0,0,0,0.04)
            `,
            zIndex: 5,
            overflow: 'hidden',
          }}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt={albumTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: coverFilter || 'none',
                transition: 'filter 0.4s ease',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.04)',
              pointerEvents: 'none',
            }}
          />
          {/* Spindle hole */}
          <div
            style={{
              position: 'absolute',
              width: Math.max(6, labelSize * 0.1),
              height: Math.max(6, labelSize * 0.1),
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--bg)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
              zIndex: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VinylDisc;
