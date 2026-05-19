import { type FC, useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Record } from '../data/records';
import AlbumArt from './AlbumArt';

interface BookshelfProps {
  records: Record[];
  selectedRecord: Record | null;
  onSelect: (record: Record) => void;
  isReceded: boolean;
  recordCustomizations: { [id: string]: { coverIndex: number; finish: string } };
}

const Bookshelf: FC<BookshelfProps> = ({ records, selectedRecord, onSelect, isReceded, recordCustomizations }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState, records]);

  const maskParts = [
    canScrollLeft ? 'transparent 0%, black 80px' : 'black 0%',
    'black 50%',
    canScrollRight ? 'black calc(100% - 80px), transparent 100%' : 'black 100%',
  ];
  const maskValue = `linear-gradient(to right, ${maskParts.join(', ')})`;

  return (
    <motion.div
      style={styles.shelf}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={styles.shelfLabel}>on the shelf</div>
      <div style={{ ...styles.shelfTrackOuter, maskImage: maskValue, WebkitMaskImage: maskValue }}>
        <div ref={trackRef} onScroll={updateScrollState} style={styles.shelfTrack}>
        <AnimatePresence>
          {records.map((record, i) => {
            const isSelected = selectedRecord?.id === record.id;
            const isHovered = hoveredId === record.id;
            return (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.95, filter: 'blur(6px)' }}
                animate={{
                  opacity: 1,
                  y: isHovered && !isSelected ? -8 : 0,
                  scale: isHovered && !isSelected ? 1.04 : 1,
                  filter: 'blur(0px)',
                }}
                exit={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(6px)' }}
                transition={{
                  opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 },
                  filter: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 },
                  y: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
                  scale: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
                  layout: { duration: 0.3 },
                }}
                onMouseEnter={() => setHoveredId(record.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => !isSelected && onSelect(record)}
                style={{
                  ...styles.recordSlot,
                  cursor: isSelected ? 'default' : 'pointer',
                  zIndex: isHovered ? 2 : 1,
                }}
              >
                <div
                  style={{
                    ...styles.recordInner,
                    boxShadow: isSelected
                      ? '0 0 0 3px rgba(74, 108, 247, 0.5), 0 4px 20px rgba(74, 108, 247, 0.15)'
                      : isHovered
                        ? '0 16px 40px rgba(31, 36, 48, 0.14), 0 6px 12px rgba(31, 36, 48, 0.06)'
                        : '0 4px 16px rgba(31, 36, 48, 0.06), 0 1px 4px rgba(31, 36, 48, 0.04)',
                  }}
                >
                  <AlbumArt
                    variant={record.coverVariants[recordCustomizations[record.id]?.coverIndex ?? 0]}
                    size={120}
                    albumTitle={record.album}
                    artist={record.artist}
                    coverImage={record.coverImage}
                    isLimitedEdition={record.isLimitedEdition}
                    limitedEditionLabel={record.limitedEditionLabel}
                  />
                </div>
                <div style={styles.recordMeta}>
                  <div style={styles.recordTitle}>{record.album}</div>
                  <div style={styles.recordArtist}>{record.artist}</div>
                  <div style={styles.recordYear}>{record.year}</div>
                  <div style={{
                    ...styles.selectedBadge,
                    opacity: isSelected ? 1 : 0,
                  }}>selected</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      </div>
      <div style={styles.shelfPlank} />
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  shelf: {
    padding: '0 48px',
    position: 'relative',
    zIndex: 5,
    flexShrink: 0,
    overflow: 'visible',
    marginTop: '50px',
  },
  shelfLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
    marginBottom: '16px',
    paddingLeft: '4px',
  },
  shelfTrackOuter: {
    transition: 'mask-image 0.3s ease, -webkit-mask-image 0.3s ease',
  },
  shelfTrack: {
    display: 'flex',
    gap: '24px',
    overflowX: 'auto',
    overflowY: 'visible',
    paddingBottom: '20px',
    paddingTop: '12px',
    scrollbarWidth: 'none' as const,
  },
  recordSlot: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    position: 'relative',
  },
  recordInner: {
    borderRadius: '14px',
    overflow: 'hidden',
    transition: 'box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
  },
  recordMeta: {
    textAlign: 'center',
    maxWidth: '120px',
  },
  recordTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  recordArtist: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    marginTop: '1px',
  },
  recordYear: {
    fontSize: '10px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    opacity: 0.6,
    fontFamily: 'var(--font-display)',
    marginTop: '1px',
  },
  selectedBadge: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#4A6CF7',
    marginTop: '4px',
  },
  shelfPlank: {
    height: '2px',
    borderRadius: '0 0 8px 8px',
    background: 'linear-gradient(180deg, var(--border-subtle) 0%, transparent 100%)',
  },
};

export default Bookshelf;
