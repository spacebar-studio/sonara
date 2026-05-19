import { type FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.01em',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 50,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hasActiveRecord: boolean;
  onSwap: () => void;
  onStartTour: () => void;
  onStartPresentation: () => void;
  onDownload: () => void;
}

const TopBar: FC<TopBarProps> = ({ searchQuery, onSearchChange, onSwap, onStartTour, onStartPresentation, onDownload }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={styles.header}>
      <motion.div
        style={styles.brand}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <span style={styles.logo}>sonara</span>
      </motion.div>

      <motion.div
        style={{
          ...styles.searchWrapper,
          boxShadow: searchFocused
            ? '0 4px 16px rgba(142, 165, 255, 0.12), 0 0 0 2px rgba(142, 165, 255, 0.2)'
            : 'var(--shadow-sm)',
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: '#A1ACBC', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="search records"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={styles.searchInput}
        />
      </motion.div>

      <div style={styles.rightActions}>
        {/* Download button */}
        <motion.button
          onClick={onDownload}
          style={{ ...styles.iconBtn, display: 'none' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          title="Download tour screenshots"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </motion.button>

        {/* Onboarding tour button */}
        <Tooltip label="Start Tour">
          <motion.button
            onClick={onStartTour}
            style={styles.iconBtn}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </motion.button>
        </Tooltip>

        {/* Design presentation button */}
        <Tooltip label="Interface Guide">
          <motion.button
            onClick={onStartPresentation}
            style={styles.iconBtn}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
          </motion.button>
        </Tooltip>

        <Tooltip label="Reset Experience">
          <motion.button
            onClick={onSwap}
            style={styles.iconBtn}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-md)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </motion.button>
        </Tooltip>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 48px',
    position: 'relative',
    zIndex: 20,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#8B8FE8',
  },
  searchWrapper: {
    position: 'absolute',
    left: 'calc(50% - 160px)',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-pill)',
    padding: '10px 20px',
    width: '320px',
    transition: 'box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
  },
  searchInput: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    width: '100%',
    fontWeight: 400,
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--text-secondary)',
    flexShrink: 0,
    cursor: 'pointer',
  },
};

export default TopBar;
