import { type FC } from 'react';
import { motion } from 'framer-motion';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTrackList: () => void;
  onSettings: () => void;
  trackListOpen: boolean;
  settingsOpen: boolean;
}

const PlaybackControls: FC<PlaybackControlsProps> = ({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
  onTrackList,
  onSettings,
  trackListOpen,
  settingsOpen,
}) => {
  return (
    <div style={styles.controls}>
      <motion.button
        onClick={onSettings}
        style={{
          ...styles.smallBtn,
          background: settingsOpen ? 'var(--bg-alt)' : 'var(--surface)',
        }}
        whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </motion.button>

      <div style={styles.mainControls}>
        <motion.button
          onClick={onPrev}
          style={styles.navBtn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onToggle}
          style={styles.playBtn}
          whileHover={{ scale: 1.08, boxShadow: '0 10px 28px rgba(31, 36, 48, 0.14), 0 4px 8px rgba(31, 36, 48, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)' }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        <motion.button
          onClick={onNext}
          style={styles.navBtn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
          </svg>
        </motion.button>
      </div>

      <motion.button
        onClick={onTrackList}
        style={{
          ...styles.smallBtn,
          background: trackListOpen ? 'var(--bg-alt)' : 'var(--surface)',
        }}
        whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </motion.button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  mainControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  playBtn: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'var(--surface)',
    boxShadow: `
      0 6px 20px rgba(31, 36, 48, 0.10),
      0 2px 6px rgba(31, 36, 48, 0.06),
      inset 0 1px 0 rgba(255,255,255,0.9)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
  },
  navBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  },
  smallBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  },
};

export default PlaybackControls;
