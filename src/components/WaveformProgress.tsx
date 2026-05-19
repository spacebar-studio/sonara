import { type FC, useMemo, useRef, useCallback } from 'react';
import { generateWaveform, formatTime } from '../hooks/usePlayback';

interface WaveformProgressProps {
  progress: number;
  duration: number;
  accentColor: string;
  gradientColors?: [string, string];
  trackId: string;
  onSeek?: (progress: number) => void;
}

const WaveformProgress: FC<WaveformProgressProps> = ({
  progress,
  duration,
  accentColor,
  gradientColors,
  trackId,
  onSeek,
}) => {
  const bars = 48;
  const waveformRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getProgressFromEvent = useCallback((e: React.PointerEvent | PointerEvent) => {
    const el = waveformRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!onSeek) return;
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onSeek(getProgressFromEvent(e));
  }, [onSeek, getProgressFromEvent]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !onSeek) return;
    onSeek(getProgressFromEvent(e));
  }, [onSeek, getProgressFromEvent]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);
  const waveform = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < trackId.length; i++) {
      seed = ((seed << 5) - seed + trackId.charCodeAt(i)) | 0;
    }
    return generateWaveform(Math.abs(seed), bars);
  }, [trackId]);

  const currentTime = Math.floor(progress * duration);

  const fillPercent = progress * 100;

  return (
    <div style={styles.container}>
      <span style={styles.time}>{formatTime(currentTime)}</span>
      <div
        ref={waveformRef}
        style={{ ...styles.waveform, cursor: onSeek ? 'pointer' : 'default' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div style={styles.barsLayer}>
          {waveform.map((height, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: '1px',
                height: `${height * 100}%`,
                borderRadius: '2px',
                background: 'var(--border-subtle)',
              }}
            />
          ))}
        </div>
        <div
          style={{
            ...styles.barsLayer,
            clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
            transition: 'clip-path 0.3s linear',
          }}
        >
          {waveform.map((height, i) => {
            const pct = (i / (waveform.length - 1)) * 100;
            const bg = gradientColors
              ? `linear-gradient(90deg, ${gradientColors[0]} ${pct - 20}%, ${gradientColors[1]} ${pct + 20}%)`
              : accentColor;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: '1px',
                  height: `${height * 100}%`,
                  borderRadius: '2px',
                  background: bg,
                }}
              />
            );
          })}
        </div>
      </div>
      <span style={styles.time}>{formatTime(duration)}</span>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  time: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    fontVariantNumeric: 'tabular-nums',
    minWidth: '32px',
    fontFamily: 'var(--font-display)',
  },
  waveform: {
    position: 'relative',
    height: '32px',
    flex: 1,
    overflow: 'hidden',
  },
  barsLayer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
};

export default WaveformProgress;
