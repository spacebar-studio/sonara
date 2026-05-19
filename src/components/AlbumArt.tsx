import { type FC, useMemo, useState } from 'react';
import type { CoverVariant } from '../data/records';

interface AlbumArtProps {
  variant: CoverVariant;
  size: number;
  albumTitle: string;
  artist: string;
  coverImage?: string;
  isLimitedEdition?: boolean;
  limitedEditionLabel?: string;
  showGloss?: boolean;
}

const AlbumArt: FC<AlbumArtProps> = ({
  variant,
  size,
  albumTitle,
  artist,
  coverImage,
  isLimitedEdition,
  limitedEditionLabel,
  showGloss = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = !!coverImage;

  const patternSvg = useMemo(() => {
    if (hasImage) return null;
    switch (variant.pattern) {
      case 'radial':
        return (
          <>
            <circle cx="50%" cy="40%" r="30%" fill="rgba(255,255,255,0.12)" />
            <circle cx="35%" cy="55%" r="18%" fill="rgba(255,255,255,0.08)" />
            <circle cx="68%" cy="65%" r="22%" fill="rgba(255,255,255,0.06)" />
          </>
        );
      case 'waves':
        return (
          <>
            <path d={`M0,${size * 0.5} Q${size * 0.25},${size * 0.35} ${size * 0.5},${size * 0.5} T${size},${size * 0.5}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <path d={`M0,${size * 0.6} Q${size * 0.25},${size * 0.45} ${size * 0.5},${size * 0.6} T${size},${size * 0.6}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <path d={`M0,${size * 0.7} Q${size * 0.25},${size * 0.55} ${size * 0.5},${size * 0.7} T${size},${size * 0.7}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          </>
        );
      case 'lines':
        return Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="0" y1={size * 0.2 + i * size * 0.08} x2={size} y2={size * 0.15 + i * size * 0.09} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ));
      case 'dots':
        return Array.from({ length: 20 }).map((_, i) => {
          const x = (((i * 7 + 3) * 137) % size);
          const y = (((i * 11 + 7) * 89) % size);
          return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="rgba(255,255,255,0.1)" />;
        });
      case 'grid':
        return Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <line x1={size * 0.2 + i * size * 0.15} y1={size * 0.2} x2={size * 0.2 + i * size * 0.15} y2={size * 0.8} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1={size * 0.2} y1={size * 0.2 + i * size * 0.15} x2={size * 0.8} y2={size * 0.2 + i * size * 0.15} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </g>
        ));
      case 'sunburst':
        return Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={size / 2}
              y1={size / 2}
              x2={size / 2 + Math.cos(angle) * size * 0.45}
              y2={size / 2 + Math.sin(angle) * size * 0.45}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        });
      case 'none':
        return null;
      default:
        return (
          <circle cx="50%" cy="50%" r="25%" fill="rgba(255,255,255,0.06)" />
        );
    }
  }, [variant.pattern, size, hasImage]);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-md)',
        background: hasImage ? '#1a1a1a' : variant.gradient,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {hasImage && (
        <img
          src={coverImage}
          alt={`${albumTitle} by ${artist}`}
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease, filter 0.4s ease',
            display: 'block',
            filter: variant.filter || 'none',
          }}
        />
      )}

      {!hasImage && patternSvg && (
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {patternSvg}
        </svg>
      )}

      {/* Diagonal glint sweep */}
      {showGloss && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '120%',
              height: '200%',
              top: '-50%',
              left: '-10%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.03) 65%, transparent 100%)',
              animation: 'vinyl-glint 5s ease-in-out 2s infinite backwards',
            }}
          />
        </div>
      )}

      {/* Subtle permanent sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            135deg,
            rgba(255,255,255,0.15) 0%,
            transparent 40%,
            transparent 60%,
            rgba(255,255,255,0.05) 100%
          )`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Limited edition badge */}
      {isLimitedEdition && size >= 100 && (
        <div
          style={{
            position: 'absolute',
            top: size * 0.05,
            right: size * 0.05,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-pill)',
            padding: `${Math.max(3, size * 0.02)}px ${Math.max(6, size * 0.04)}px`,
            zIndex: 3,
          }}
        >
          <svg width={Math.max(10, size * 0.06)} height={Math.max(10, size * 0.06)} viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7L8 1z" fill="#F0C060" stroke="#D4A030" strokeWidth="0.5" />
          </svg>
          {size >= 180 && limitedEditionLabel && (
            <span style={{ fontSize: Math.max(8, size * 0.04), fontWeight: 600, color: '#F0C060', letterSpacing: '0.03em' }}>
              {limitedEditionLabel}
            </span>
          )}
        </div>
      )}

      {/* Title overlay - only for generative covers */}
      {!hasImage && (
        <div
          style={{
            position: 'absolute',
            bottom: size * 0.08,
            left: size * 0.08,
            right: size * 0.08,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: Math.max(12, size * 0.07),
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            {albumTitle}
          </div>
          <div
            style={{
              fontSize: Math.max(9, size * 0.045),
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              marginTop: 2,
              textShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          >
            {artist}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumArt;
