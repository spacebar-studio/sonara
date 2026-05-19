import { type FC } from 'react';
import type { InsertType } from '../data/records';

interface InsertIllustrationProps {
  type: InsertType;
  size?: number;
}

const SignatureCard: FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Card base */}
    <rect x="4" y="6" width="32" height="28" rx="3" fill="#FBF8F2" />
    <rect x="4" y="6" width="32" height="28" rx="3" stroke="#E8E0D4" strokeWidth="0.75" />
    {/* Gold foil border accent */}
    <rect x="7" y="9" width="26" height="22" rx="1.5" stroke="#E8D5A0" strokeWidth="0.5" strokeDasharray="1 1.5" />
    {/* Star emblem */}
    <path d="M20 13l1.5 3 3.3.5-2.4 2.3.6 3.2L20 20.5 17 22l.6-3.2-2.4-2.3 3.3-.5L20 13z" fill="#F0C060" fillOpacity="0.7" />
    {/* Signature scrawl */}
    <path d="M12 27c2-1.5 3.5-0.5 5-1.5s1.5 1 3.5 0 2.5-1 4 0 2-0.5 3.5-0.5" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.7" />
    {/* Subtle texture */}
    <rect x="4" y="6" width="32" height="28" rx="3" fill="url(#cardTexture)" opacity="0.03" />
    <defs>
      <pattern id="cardTexture" patternUnits="userSpaceOnUse" width="4" height="4">
        <circle cx="1" cy="1" r="0.5" fill="#000" />
      </pattern>
    </defs>
  </svg>
);

const LyricBook: FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Back page */}
    <rect x="9" y="5" width="24" height="31" rx="2" fill="#F0EDE6" stroke="#DDD8CC" strokeWidth="0.5" />
    {/* Spine shadow */}
    <rect x="8" y="6" width="2" height="29" rx="1" fill="#E8E2D6" />
    {/* Front cover */}
    <rect x="7" y="4" width="24" height="31" rx="2" fill="#FAF7F0" stroke="#E0DAD0" strokeWidth="0.75" />
    {/* Title area */}
    <rect x="12" y="10" width="14" height="1" rx="0.5" fill="#C8C0B4" opacity="0.6" />
    <rect x="14" y="13" width="10" height="0.8" rx="0.4" fill="#D8D0C4" opacity="0.5" />
    {/* Musical note icon */}
    <circle cx="19" cy="22" r="4" fill="none" stroke="#C8B890" strokeWidth="0.6" />
    <path d="M17.5 21.5V18l4-1v4" stroke="#C8B890" strokeWidth="0.7" strokeLinecap="round" />
    <circle cx="17.5" cy="21.5" r="1.2" fill="#C8B890" opacity="0.5" />
    <circle cx="21.5" cy="21" r="1.2" fill="#C8B890" opacity="0.5" />
    {/* Page edges */}
    <line x1="31" y1="8" x2="31" y2="33" stroke="#E0DAD0" strokeWidth="0.3" />
    <line x1="31.5" y1="9" x2="31.5" y2="32" stroke="#E8E4DC" strokeWidth="0.3" />
  </svg>
);

const Photo: FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Polaroid body - slightly rotated */}
    <g transform="rotate(-3 20 20)">
      {/* White frame */}
      <rect x="6" y="4" width="28" height="33" rx="1.5" fill="#FEFEFE" />
      <rect x="6" y="4" width="28" height="33" rx="1.5" stroke="#E8E4DC" strokeWidth="0.5" />
      {/* Photo area */}
      <rect x="9" y="7" width="22" height="20" rx="0.5" fill="#E2E8F0" />
      {/* Scene: abstract landscape / concert vibe */}
      <rect x="9" y="7" width="22" height="20" rx="0.5" fill="url(#photoGrad)" />
      {/* Silhouette shapes suggesting a concert/crowd */}
      <ellipse cx="14" cy="25" rx="3" ry="4" fill="#2D3748" opacity="0.4" />
      <ellipse cx="20" cy="24" rx="3.5" ry="5" fill="#2D3748" opacity="0.35" />
      <ellipse cx="26" cy="25" rx="3" ry="4" fill="#2D3748" opacity="0.4" />
      {/* Light beams */}
      <path d="M15 7L20 18" stroke="#FBD38D" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <path d="M25 7L22 16" stroke="#E9D8FD" strokeWidth="1" opacity="0.25" strokeLinecap="round" />
      {/* Bottom white strip with date */}
      <rect x="14" y="30" width="12" height="1" rx="0.5" fill="#D0CCC4" opacity="0.4" />
    </g>
    <defs>
      <linearGradient id="photoGrad" x1="9" y1="7" x2="31" y2="27">
        <stop offset="0%" stopColor="#667EEA" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#764BA2" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#2D3748" stopOpacity="0.4" />
      </linearGradient>
    </defs>
  </svg>
);

const Note: FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Paper - slightly folded corner */}
    <path d="M8 5h20l4 4v26a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2z" fill="#FFF9F0" stroke="#E8E0D4" strokeWidth="0.75" />
    {/* Folded corner */}
    <path d="M28 5v4h4" fill="#F0EBE0" stroke="#E0D8CC" strokeWidth="0.5" />
    <path d="M28 5l4 4" stroke="#E0D8CC" strokeWidth="0.5" />
    {/* Handwritten lines */}
    <path d="M11 13c1-0.3 2.5 0.2 4-0.1s2 0.3 3.5 0 2.5 0.2 4 0" stroke="#B8A88C" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
    <path d="M11 17c1.5 0.2 3-0.3 5 0.1s2.5-0.2 3.5 0.1 2 0.2 3.5-0.1" stroke="#B8A88C" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
    <path d="M11 21c2 0.1 3.5-0.2 5 0s2-0.1 3 0.2" stroke="#B8A88C" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
    <path d="M11 25c1.5-0.2 3 0.3 4.5 0.1s1.5-0.3 3 0 2.5 0.2 4-0.1" stroke="#B8A88C" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
    {/* Heart doodle */}
    <path d="M16 30c0-1 1-2 2-2s2 1 2 2c0 1.5-2 3-2 3s-2-1.5-2-3z" fill="#E8A0BF" fillOpacity="0.4" stroke="#D4879E" strokeWidth="0.4" />
  </svg>
);

const Poster: FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Poster sheet - slightly curved edges to suggest a real poster */}
    <rect x="5" y="3" width="30" height="34" rx="1" fill="url(#posterBg)" />
    <rect x="5" y="3" width="30" height="34" rx="1" stroke="#D0C8BC" strokeWidth="0.5" />
    {/* Abstract tour poster design */}
    {/* Top text block */}
    <rect x="10" y="7" width="20" height="2" rx="1" fill="#FFF" opacity="0.7" />
    <rect x="14" y="11" width="12" height="1" rx="0.5" fill="#FFF" opacity="0.4" />
    {/* Central graphic — abstract vinyl/circle motif */}
    <circle cx="20" cy="22" r="7" fill="none" stroke="#FFF" strokeWidth="0.8" opacity="0.6" />
    <circle cx="20" cy="22" r="4" fill="none" stroke="#FFF" strokeWidth="0.5" opacity="0.4" />
    <circle cx="20" cy="22" r="1.5" fill="#FFF" opacity="0.5" />
    {/* Radiating lines */}
    <line x1="20" y1="15" x2="20" y2="12" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
    <line x1="25" y1="17" x2="27" y2="15" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
    <line x1="27" y1="22" x2="30" y2="22" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
    <line x1="15" y1="17" x2="13" y2="15" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
    <line x1="13" y1="22" x2="10" y2="22" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
    {/* Bottom date/venue */}
    <rect x="12" y="32" width="16" height="1" rx="0.5" fill="#FFF" opacity="0.35" />
    <defs>
      <linearGradient id="posterBg" x1="5" y1="3" x2="35" y2="37">
        <stop offset="0%" stopColor="#4A5568" />
        <stop offset="50%" stopColor="#2D3748" />
        <stop offset="100%" stopColor="#1A202C" />
      </linearGradient>
    </defs>
  </svg>
);

const illustrations: Record<InsertType, FC<{ size: number }>> = {
  'signature-card': SignatureCard,
  'lyric-book': LyricBook,
  'photo': Photo,
  'note': Note,
  'poster': Poster,
};

const InsertIllustration: FC<InsertIllustrationProps> = ({ type, size = 36 }) => {
  const Illustration = illustrations[type];
  if (!Illustration) return null;
  return <Illustration size={size} />;
};

export default InsertIllustration;
