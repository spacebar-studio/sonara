import { type FC } from 'react';
import type { Track } from '../data/records';
import { formatTime } from '../hooks/usePlayback';

interface TrackListDrawerProps {
  isOpen: boolean;
  tracks: Track[];
  activeSide: 'A' | 'B';
  activeTrack: Track | null;
  onSideChange: (side: 'A' | 'B') => void;
  onTrackSelect: (track: Track, index: number) => void;
  onClose: () => void;
}

const TrackListDrawer: FC<TrackListDrawerProps> = ({
  isOpen,
  tracks,
  activeSide,
  activeTrack,
  onSideChange,
  onTrackSelect,
  onClose,
}) => {
  const sideTracks = tracks.filter((t) => t.side === activeSide);

  if (!isOpen) return null;

  return (
        <div
          style={styles.drawer}
        >
          <div style={styles.header}>
            <div style={styles.title}>track list</div>
            <button onClick={onClose} style={styles.closeBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Side tabs */}
          <div style={styles.sideTabs}>
            {(['A', 'B'] as const).map((side) => (
              <button
                key={side}
                onClick={() => onSideChange(side)}
                style={{
                  ...styles.sideTab,
                  background: activeSide === side ? 'var(--surface)' : 'transparent',
                  boxShadow: activeSide === side ? 'var(--shadow-sm)' : 'none',
                  color: activeSide === side ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                side {side.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Track rows */}
          <div style={styles.tracks}>
            {sideTracks.map((track, i) => {
              const isActive = activeTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => onTrackSelect(track, i)}
                  style={{
                    ...styles.trackRow,
                    background: isActive ? 'var(--bg-alt)' : 'transparent',
                  }}
                >
                  <div style={styles.trackLeft}>
                    <span style={{
                      ...styles.trackNumber,
                      color: isActive ? 'var(--accent-periwinkle)' : 'var(--text-tertiary)',
                    }}>
                      {isActive ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        String(i + 1).padStart(2, '0')
                      )}
                    </span>
                    <span style={{
                      ...styles.trackTitle,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                    }}>
                      {track.title}
                    </span>
                  </div>
                  <span style={styles.trackDuration}>{formatTime(track.duration)}</span>
                </button>
              );
            })}
          </div>
        </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  drawer: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    padding: '24px',
    width: '280px',
    maxHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
  },
  closeBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-tertiary)',
    transition: 'background 0.15s ease',
  },
  sideTabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg)',
    borderRadius: 'var(--radius-pill)',
    padding: '3px',
  },
  sideTab: {
    flex: 1,
    padding: '6px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: 'pointer',
  },
  tracks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflowY: 'auto',
  },
  trackRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    width: '100%',
    textAlign: 'left' as const,
  },
  trackLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  trackNumber: {
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'var(--font-display)',
    minWidth: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: '14px',
    lineHeight: 1.3,
  },
  trackDuration: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-display)',
    fontVariantNumeric: 'tabular-nums',
  },
};

export default TrackListDrawer;
