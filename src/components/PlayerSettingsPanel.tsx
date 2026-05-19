import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerSettingsPanelProps {
  isOpen: boolean;
  rpm: 33 | 45 | 78;
  condition: 'mint' | 'warm' | 'worn';
  tracking: number;
  antiSkate: number;
  onRpmChange: (rpm: 33 | 45 | 78) => void;
  onConditionChange: (condition: 'mint' | 'warm' | 'worn') => void;
  onTrackingChange: (value: number) => void;
  onAntiSkateChange: (value: number) => void;
  onClose: () => void;
  inline?: boolean;
}

const SettingsContent: FC<Omit<PlayerSettingsPanelProps, 'isOpen' | 'inline'>> = ({
  rpm,
  condition,
  tracking,
  antiSkate,
  onRpmChange,
  onConditionChange,
  onTrackingChange,
  onAntiSkateChange,
}) => (
  <div style={styles.content}>
    <div style={styles.controlGroup}>
      <div style={styles.label}>rpm</div>
      <div style={styles.segmented}>
        {([33, 45, 78] as const).map((r) => (
          <button
            key={r}
            onClick={() => onRpmChange(r)}
            style={{
              ...styles.segmentedBtn,
              background: rpm === r ? 'var(--surface)' : 'transparent',
              boxShadow: rpm === r ? 'var(--shadow-sm)' : 'none',
              color: rpm === r ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontWeight: rpm === r ? 600 : 400,
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>

    <div style={styles.controlGroup}>
      <div style={styles.label}>condition</div>
      <div style={styles.segmented}>
        {(['mint', 'warm', 'worn'] as const).map((c) => (
          <button
            key={c}
            onClick={() => onConditionChange(c)}
            style={{
              ...styles.segmentedBtn,
              background: condition === c ? 'var(--surface)' : 'transparent',
              boxShadow: condition === c ? 'var(--shadow-sm)' : 'none',
              color: condition === c ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontWeight: condition === c ? 600 : 400,
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>

    <div style={styles.controlGroup}>
      <div style={styles.labelRow}>
        <span style={styles.label}>tracking</span>
        <span style={styles.value}>{tracking}%</span>
      </div>
      <div style={styles.sliderTrack}>
        <input
          type="range"
          min="0"
          max="100"
          value={tracking}
          onChange={(e) => onTrackingChange(Number(e.target.value))}
          style={styles.slider}
        />
        <div style={{ ...styles.sliderFill, width: `${tracking}%` }} />
      </div>
    </div>

    <div style={styles.controlGroup}>
      <div style={styles.labelRow}>
        <span style={styles.label}>anti-skate</span>
        <span style={styles.value}>{antiSkate}%</span>
      </div>
      <div style={styles.sliderTrack}>
        <input
          type="range"
          min="0"
          max="100"
          value={antiSkate}
          onChange={(e) => onAntiSkateChange(Number(e.target.value))}
          style={styles.slider}
        />
        <div style={{ ...styles.sliderFill, width: `${antiSkate}%` }} />
      </div>
    </div>
  </div>
);

const PlayerSettingsPanel: FC<PlayerSettingsPanelProps> = (props) => {
  const { isOpen, inline, onClose, ...settingsProps } = props;

  if (inline) {
    return <SettingsContent {...settingsProps} onClose={onClose} />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={styles.panel}
        >
          <div style={styles.header}>
            <div style={styles.title}>tuning</div>
            <button onClick={onClose} style={styles.closeBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SettingsContent {...settingsProps} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    padding: '24px',
    width: '260px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontVariantNumeric: 'tabular-nums',
  },
  segmented: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg)',
    borderRadius: 'var(--radius-pill)',
    padding: '3px',
  },
  segmentedBtn: {
    flex: 1,
    padding: '7px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: 'pointer',
  },
  sliderTrack: {
    position: 'relative',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--bg)',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    zIndex: 2,
    margin: 0,
  },
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: '3px',
    background: 'var(--accent-periwinkle)',
    transition: 'width 0.1s ease',
    pointerEvents: 'none',
  },
};

export default PlayerSettingsPanel;
