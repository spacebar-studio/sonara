import { useEffect, useRef } from 'react';

export function usePlayback(
  isPlaying: boolean,
  duration: number,
  progress: number,
  setProgress: (p: number) => void,
  onTrackEnd?: () => void
) {
  const progressRef = useRef(progress);
  const durationRef = useRef(duration);
  const onTrackEndRef = useRef(onTrackEnd);
  const setProgressRef = useRef(setProgress);

  progressRef.current = progress;
  durationRef.current = duration;
  onTrackEndRef.current = onTrackEnd;
  setProgressRef.current = setProgress;

  useEffect(() => {
    if (!isPlaying || durationRef.current <= 0) return;

    let rafId: number;
    let lastTime = 0;

    const tick = (timestamp: number) => {
      if (!lastTime) { lastTime = timestamp; }
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const increment = delta / durationRef.current;
      const next = progressRef.current + increment;

      if (next >= 1) {
        setProgressRef.current(0);
        onTrackEndRef.current?.();
      } else {
        setProgressRef.current(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function generateWaveform(seed: number, bars: number = 48): number[] {
  const data: number[] = [];
  let x = seed;
  for (let i = 0; i < bars; i++) {
    x = ((x * 1103515245 + 12345) & 0x7fffffff) >>> 0;
    const normalized = (x % 100) / 100;
    const bell = Math.sin((i / bars) * Math.PI);
    data.push(0.15 + normalized * 0.85 * (0.3 + bell * 0.7));
  }
  return data;
}
