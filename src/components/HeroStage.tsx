import { type FC, useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Record as RecordType, Track } from '../data/records';
import type { AppState, PanelState } from '../hooks/useStore';
import AlbumArt from './AlbumArt';
import VinylDisc from './VinylDisc';
import Turntable from './Turntable';
import WaveformProgress from './WaveformProgress';
import PlaybackControls from './PlaybackControls';
import CoverVariantSelector from './CoverVariantSelector';
import VinylFinishSelector from './VinylFinishSelector';
import TrackListDrawer from './TrackListDrawer';
import PlayerSettingsPanel from './PlayerSettingsPanel';

interface HeroStageProps {
  appState: AppState;
  panelState: PanelState;
  record: RecordType | null;
  coverIndex: number;
  finish: string;
  activeSide: 'A' | 'B';
  activeTrack: Track | null;
  activeTrackIndex: number;
  progress: number;
  rpm: 33 | 45 | 78;
  condition: 'mint' | 'warm' | 'worn';
  tracking: number;
  antiSkate: number;
  onExtract: () => void;
  onPlace: () => void;
  onTogglePlayback: () => void;
  onStartScrub: () => void;
  onEndScrub: () => void;
  onSetProgress: (p: number) => void;
  onCoverChange: (i: number) => void;
  onFinishChange: (f: string) => void;
  onSideChange: (s: 'A' | 'B') => void;
  onTrackSelect: (track: Track, index: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onTogglePanel: (panel: PanelState) => void;
  onRpmChange: (r: 33 | 45 | 78) => void;
  onConditionChange: (c: 'mint' | 'warm' | 'worn') => void;
  onTrackingChange: (t: number) => void;
  onAntiSkateChange: (a: number) => void;
}

function shiftHue(hex: string, degrees: number): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  h = ((h * 360 + degrees) % 360) / 360;
  const s2 = Math.min(1, s * 1.2);
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s2) : l + s2 - l * s2;
  const p = 2 * l - q;
  const ro = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const go = Math.round(hue2rgb(p, q, h) * 255);
  const bo = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${ro.toString(16).padStart(2, '0')}${go.toString(16).padStart(2, '0')}${bo.toString(16).padStart(2, '0')}`;
}

const VINYL_SIZE = 270;

const ease = [0.22, 1, 0.36, 1] as const;

const HeroStage: FC<HeroStageProps> = ({
  appState,
  panelState,
  record,
  coverIndex,
  finish,
  activeSide,
  activeTrack,
  progress,
  rpm,
  condition,
  tracking,
  antiSkate,
  onExtract,
  onPlace,
  onTogglePlayback,
  onStartScrub,
  onEndScrub,
  onSetProgress,
  onCoverChange,
  onFinishChange,
  onSideChange,
  onTrackSelect,
  onNextTrack,
  onPrevTrack,
  onTogglePanel,
  onRpmChange,
  onConditionChange,
  onTrackingChange,
  onAntiSkateChange,
}) => {
  const [rotation, setRotation] = useState(0);
  const [scrubTiltX, setScrubTiltX] = useState(0);
  const [scrubTiltY, setScrubTiltY] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const prevAppStateRef = useRef<AppState>(appState);
  useEffect(() => {
    prevAppStateRef.current = appState;
  }, [appState]);
  const [btnReady, setBtnReady] = useState(false);
  const [btnText, setBtnText] = useState('pull vinyl out');
  useEffect(() => {
    setBtnReady(false);
    const textTimer = setTimeout(() => {
      setBtnText(appState === 'vinylExtracted' ? 'place on platter' : 'pull vinyl out');
    }, 450);
    const t = setTimeout(() => setBtnReady(true), 550);
    return () => { clearTimeout(t); clearTimeout(textTimer); };
  }, [appState, record?.id]);
  const scrubStartX = useRef(0);
  const scrubStartProgress = useRef(0);
  const isScrubbing = useRef(false);
  const spinRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const scrubCenterRef = useRef({ x: 0, y: 0 });
  const scrubLastAngle = useRef(0);

  const isPlaying = appState === 'playing';
  const isOnPlatter =
    isPlaying ||
    appState === 'paused' ||
    appState === 'scrubbing';
  const showSleeve = [
    'focusedRecord',
    'customizing',
    'vinylExtracted',
  ].includes(appState);
  const showTurntable =
    isOnPlatter || appState === 'placing';
  const showVinylFinish = appState === 'vinylExtracted';
  const showCoverCustomization = [
    'focusedRecord',
    'customizing',
  ].includes(appState);
  const tonearmOnGroove =
    isPlaying || appState === 'scrubbing';

  const onSetProgressRef = useRef(onSetProgress);
  const onStartScrubRef = useRef(onStartScrub);
  const onEndScrubRef = useRef(onEndScrub);
  const progressRef = useRef(progress);
  const isOnPlatterRef = useRef(isOnPlatter);
  onSetProgressRef.current = onSetProgress;
  onStartScrubRef.current = onStartScrub;
  onEndScrubRef.current = onEndScrub;
  progressRef.current = progress;
  isOnPlatterRef.current = isOnPlatter;

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = 0;
      return;
    }

    const rpmSpeed =
      rpm === 33 ? 0.55 : rpm === 45 ? 0.75 : 1.3;

    const spin = (timestamp: number) => {
      if (!lastFrameRef.current)
        lastFrameRef.current = timestamp;
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      setRotation(
        (prev) => (prev + delta * rpmSpeed * 0.06) % 360,
      );
      spinRef.current = requestAnimationFrame(spin);
    };

    spinRef.current = requestAnimationFrame(spin);
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, [isPlaying, rpm]);

  const handleScrubDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isOnPlatterRef.current) return;
      e.preventDefault();
      isScrubbing.current = true;
      scrubStartX.current = e.clientX;
      scrubStartProgress.current = progressRef.current;

      const rect = (
        e.currentTarget as HTMLElement
      ).getBoundingClientRect();
      scrubCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      scrubLastAngle.current = Math.atan2(
        e.clientY - scrubCenterRef.current.y,
        e.clientX - scrubCenterRef.current.x,
      );

      onStartScrubRef.current();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handleScrubMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isScrubbing.current) return;

      const currentAngle = Math.atan2(
        e.clientY - scrubCenterRef.current.y,
        e.clientX - scrubCenterRef.current.x,
      );
      let deltaAngle =
        currentAngle - scrubLastAngle.current;
      if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
      if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
      scrubLastAngle.current = currentAngle;

      const sensitivity = 0.08;
      const newProgress = Math.max(
        0,
        Math.min(
          1,
          progressRef.current + deltaAngle * sensitivity,
        ),
      );
      onSetProgressRef.current(newProgress);
      progressRef.current = newProgress;

      setRotation(
        (prev) => prev + deltaAngle * (180 / Math.PI),
      );

      const deltaX =
        e.clientX - scrubCenterRef.current.x;
      const deltaY =
        e.clientY - scrubCenterRef.current.y;
      const dist = Math.sqrt(
        deltaX * deltaX + deltaY * deltaY,
      );
      const maxTilt = 15;
      const tiltFactor = Math.min(1, dist / 150);
      setScrubTiltY(
        (deltaX / (dist || 1)) * maxTilt * tiltFactor,
      );
      setScrubTiltX(
        (-deltaY / (dist || 1)) *
          maxTilt *
          tiltFactor *
          0.5,
      );
    },
    [],
  );

  const handleScrubUp = useCallback(() => {
    if (!isScrubbing.current) return;
    isScrubbing.current = false;
    setScrubTiltX(0);
    setScrubTiltY(0);
    onEndScrubRef.current();
  }, []);

  if (!record) {
    return (
      <div style={styles.emptyStage}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease }}
        >
          <Turntable
            hasRecord={false}
            isPlaying={false}
            tonearmOnGroove={false}
            tonearmPosition={0}
          >
            <div />
          </Turntable>
        </motion.div>
        <motion.div
          style={styles.emptyHint}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          <span style={styles.emptyText}>
            select a record to begin
          </span>
        </motion.div>
      </div>
    );
  }

  const currentVariant = record.coverVariants[coverIndex];
  const trackDuration = activeTrack?.duration || 200;
  const hasInserts =
    record.bonusInserts && record.bonusInserts.length > 0;
  const currentFinish = record.vinylFinishes.find(f => f.id === finish) || record.vinylFinishes[0];
  const finishBg = currentFinish?.background || 'radial-gradient(circle, #181C24 0%, #05070A 100%)';
  const finishTranslucent = currentFinish?.isTranslucent || false;
  const finishColorful = currentFinish?.isColorful || false;

  return (
    <div style={styles.stage}>
      <div style={styles.mainArea}>
        {/* Left: Sleeve / Turntable */}
        <div style={styles.playerArea}>
          <AnimatePresence mode="wait">
            {showSleeve && (
              <motion.div
                key={`sleeve-${record.id}`}
                initial={{
                  opacity: 0,
                  y: 30,
                  filter: 'blur(10px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  filter: 'blur(10px)',
                  y: -8,
                }}
                transition={{ duration: 0.5, ease }}
                style={styles.sleeveArea}
              >
                {/* Left column: album cover + metadata */}
                <div style={styles.sleeveLeftCol}>
                  <div style={styles.sleeve}>
                    <AlbumArt
                      variant={currentVariant}
                      size={260}
                      albumTitle={record.album}
                      artist={record.artist}
                      coverImage={record.coverImage}
                      isLimitedEdition={
                        record.isLimitedEdition
                      }
                      limitedEditionLabel={
                        record.limitedEditionLabel
                      }
                      showGloss={showSleeve}
                    />
                    <div style={styles.sleeveShadow} />
                  </div>

                  <motion.div
                    style={styles.metadata}
                    initial={{
                      opacity: 0,
                      y: 10,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.15,
                      ease,
                    }}
                  >
                    <h2 style={styles.albumTitle}>
                      {record.album}
                    </h2>
                    <p style={styles.artist}>
                      {record.artist}
                    </p>
                    <div style={styles.yearRow}>
                      <span style={styles.year}>
                        {record.year}
                      </span>
                      {record.isLimitedEdition && (
                        <span style={styles.limitedBadge}>
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7L8 1z"
                              fill="#F0C060"
                            />
                          </svg>
                          {record.limitedEditionLabel}
                        </span>
                      )}
                    </div>
                    <div style={styles.actions}>
                        {(appState === 'focusedRecord' || appState === 'vinylExtracted') && (
                          <motion.button
                            onClick={appState === 'focusedRecord' ? onExtract : onPlace}
                            style={{
                              ...styles.actionBtn,
                              opacity: btnReady ? 1 : 0,
                              filter: btnReady ? 'none' : 'blur(6px)',
                              transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s cubic-bezier(0.22,1,0.36,1)',
                            }}
                            whileHover={{
                              scale: 1.03,
                              boxShadow: 'var(--shadow-button-hover)',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {btnText}
                          </motion.button>
                        )}
                    </div>
                  </motion.div>
                </div>

                {/* Vinyl disc — single element that peeks behind album then slides out */}
                <motion.div
                  style={{
                    position: 'absolute' as const,
                    top: '-5px',
                    left: 0,
                    zIndex: -1,
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                  }}
                  animate={{
                    x: appState === 'vinylExtracted' ? 308 : 40,
                    clipPath: appState === 'vinylExtracted'
                      ? 'inset(-200px -200px -200px -200px)'
                      : 'inset(5px 0px 5px 0px)',
                  }}
                  transition={{ duration: 0.7, ease }}
                >
                  <div style={styles.extractedVinylOuter}>
                    <div style={styles.extractedVinyl3d}>
                      <div
                        style={{
                          ...styles.extractedVinylTilt,
                          animation: appState === 'vinylExtracted'
                            ? 'vinyl-tilt 6s ease-in-out infinite, vinyl-glow 4s ease-in-out infinite'
                            : 'none',
                        }}
                      >
                        <VinylDisc
                          size={VINYL_SIZE}
                          finishBackground={finishBg}
                          finishTranslucent={finishTranslucent}
                          finishColorful={finishColorful}
                          labelColor={record.labelColor}
                          albumTitle={record.album}
                          artist={record.artist}
                          coverImage={record.coverImage}
                          coverFilter={currentVariant.filter}
                          isSpinning={false}
                          rotation={appState === 'vinylExtracted' ? 0 : 12}
                          shadowIntensity={appState === 'vinylExtracted' ? 1.2 : 0.5}
                          noPerspective
                        />
                        <div style={styles.vinylGlintOverlay}>
                          <div style={styles.vinylGlintBar} />
                        </div>
                      </div>
                    </div>
                    {appState === 'vinylExtracted' && hasInserts && (
                      <div style={styles.keepsakesSide}>
                        {record.bonusInserts!.map(
                          (insert, idx) => (
                            <motion.div
                              key={insert.id}
                              style={styles.insertCard}
                              initial={{
                                opacity: 0,
                                scale: 0.9,
                                filter: 'blur(4px)',
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                y: [0, -6, 0],
                                filter: 'blur(0px)',
                              }}
                              transition={{
                                delay: 0.7 + idx * 0.08,
                                duration: 0.35,
                                ease,
                                y: {
                                  duration: 3 + idx * 0.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: 1.0 + idx * 0.3,
                                },
                              }}
                              whileHover={{
                                scale: 1.08,
                                boxShadow: '0 8px 20px rgba(31, 36, 48, 0.1)',
                              }}
                              onClick={() => setLightboxImage(insert.image)}
                              title={insert.description}
                            >
                              <img
                                src={insert.image}
                                alt={insert.label}
                                style={styles.insertImage}
                              />
                              <div style={styles.insertLabel}>
                                {insert.label}
                              </div>
                            </motion.div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {appState === 'vinylExtracted' && (
                      <motion.div
                        key="finish-card-inline"
                        style={{ ...styles.finishCard, marginTop: '32px' }}
                        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.4, delay: 0.5, ease }}
                      >
                        <div style={styles.cardLabel}>
                          vinyl finish
                        </div>
                        <VinylFinishSelector
                          finishes={record.vinylFinishes}
                          selected={finish}
                          onSelect={onFinishChange}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {showTurntable && (
              <motion.div
                key="turntable"
                initial={{
                  opacity: 0,
                  scale: 0.93,
                  filter: 'blur(14px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  filter: 'blur(12px)',
                }}
                transition={{ duration: 0.6, ease }}
              >
                <Turntable
                  hasRecord={true}
                  isPlaying={isPlaying}
                  tonearmOnGroove={tonearmOnGroove}
                  tonearmPosition={progress}
                  onTonearmDrop={onTogglePlayback}
                  onTonearmLift={onTogglePlayback}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    onPointerMove={handleScrubMove}
                    onPointerUp={handleScrubUp}
                    onPointerCancel={handleScrubUp}
                  >
                    <VinylDisc
                      size={VINYL_SIZE}
                      finishBackground={finishBg}
                      finishTranslucent={finishTranslucent}
                      finishColorful={finishColorful}
                      labelColor={record.labelColor}
                      albumTitle={record.album}
                      artist={record.artist}
                      coverImage={record.coverImage}
                      coverFilter={currentVariant.filter}
                      isSpinning={isPlaying}
                      rotation={rotation}
                      tiltX={scrubTiltX}
                      tiltY={scrubTiltY}
                      shadowIntensity={
                        appState === 'scrubbing' ? 1.5 : 1
                      }
                      onPointerDown={handleScrubDown}
                      showGlint={isOnPlatter}
                    />
                  </div>
                </Turntable>

                {/* Now playing info — staggered entrance */}
                <motion.div
                  style={styles.nowPlaying}
                  initial={{
                    opacity: 0,
                    y: 20,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    delay: 0.35,
                    duration: 0.5,
                    ease,
                  }}
                >
                  <div style={styles.nowPlayingInfo}>
                    <motion.div
                      style={styles.nowPlayingLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.3,
                      }}
                    >
                      now playing
                    </motion.div>
                    <motion.div
                      style={styles.nowPlayingTitle}
                      initial={{
                        opacity: 0,
                        y: 6,
                        filter: 'blur(4px)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        delay: 0.45,
                        duration: 0.4,
                        ease,
                      }}
                    >
                      {activeTrack?.title ||
                        record.tracks[0].title}
                    </motion.div>
                    <motion.div
                      style={styles.nowPlayingArtist}
                      initial={{
                        opacity: 0,
                        y: 4,
                        filter: 'blur(3px)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 0.35,
                        ease,
                      }}
                    >
                      {record.artist}
                    </motion.div>
                  </div>

                  <motion.div
                    style={{ width: '100%' }}
                    initial={{
                      opacity: 0,
                      scaleX: 0.6,
                      filter: 'blur(4px)',
                    }}
                    animate={{
                      opacity: 1,
                      scaleX: 1,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      delay: 0.55,
                      duration: 0.45,
                      ease,
                    }}
                  >
                    <WaveformProgress
                      progress={progress}
                      duration={trackDuration}
                      accentColor={record.accentColor}
                      gradientColors={[record.accentColor, shiftHue(record.accentColor, 60)]}
                      trackId={
                        activeTrack?.id ||
                        record.tracks[0].id
                      }
                      onSeek={onSetProgress}
                    />
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      delay: 0.6,
                      duration: 0.4,
                      ease,
                    }}
                  >
                    <PlaybackControls
                      isPlaying={isPlaying}
                      onToggle={onTogglePlayback}
                      onPrev={onPrevTrack}
                      onNext={onNextTrack}
                      onTrackList={() =>
                        onTogglePanel('trackList')
                      }
                      onSettings={() =>
                        onTogglePanel('settings')
                      }
                      trackListOpen={
                        panelState === 'trackList'
                      }
                      settingsOpen={
                        panelState === 'settings'
                      }
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side panel — content swaps in place */}
        <div style={styles.sidePanel}>
          <AnimatePresence mode="wait">
            {showCoverCustomization &&
              record.coverVariants.length > 1 && (
                <motion.div
                  key={`cover-card-${record.id}`}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)',
                    transition: {
                      duration: 0.5,
                      ease,
                      delay: ['playing', 'paused', 'placing', 'scrubbing'].includes(prevAppStateRef.current) ? 1.1 : 0.45,
                    },
                  }}
                  exit={{ opacity: 0, filter: 'blur(6px)',
                    transition: { duration: 0.5, ease },
                  }}
                  style={styles.customizeCard}
                >
                  <div style={styles.cardLabel}>
                    cover style
                  </div>
                  <CoverVariantSelector
                    variants={record.coverVariants}
                    selectedIndex={coverIndex}
                    onSelect={onCoverChange}
                  />
                </motion.div>
              )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isOnPlatter && panelState === 'trackList' ? (
              <motion.div
                key="tracklist-inline"
                initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -4, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease }}
                style={{ marginLeft: '50px', marginTop: '-195px' }}
              >
                <TrackListDrawer
                  isOpen={true}
                  tracks={record.tracks}
                  activeSide={activeSide}
                  activeTrack={activeTrack}
                  onSideChange={onSideChange}
                  onTrackSelect={onTrackSelect}
                  onClose={() => onTogglePanel('trackList')}
                />
              </motion.div>
            ) : isOnPlatter ? (
                <motion.div
                  key="settings-inline"
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -4, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease }}
                  style={styles.settingsCard}
                >
                  <div style={styles.cardLabel}>
                    player settings
                  </div>
                  <PlayerSettingsPanel
                    isOpen={true}
                    rpm={rpm}
                    condition={condition}
                    tracking={tracking}
                    antiSkate={antiSkate}
                    onRpmChange={onRpmChange}
                    onConditionChange={onConditionChange}
                    onTrackingChange={onTrackingChange}
                    onAntiSkateChange={onAntiSkateChange}
                    onClose={() =>
                      onTogglePanel('settings')
                    }
                    inline
                  />
                </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox overlay for artifact images */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            style={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              src={lightboxImage}
              alt="Artifact"
              style={styles.lightboxImage}
              initial={{ scale: 0.85, filter: 'blur(12px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.9, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  stage: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 48px',
    paddingTop: '70px',
    position: 'relative',
    zIndex: 10,
    minHeight: 0,
  },
  mainArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    maxWidth: '1160px',
    width: '100%',
    paddingLeft: '100px',
  },
  playerArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    position: 'relative',
  },
  emptyStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
    flex: 1,
    justifyContent: 'center',
    padding: '0 48px',
  },
  emptyHint: {
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  sleeveArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  sleeveLeftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    width: '260px',
    flexShrink: 0,
  },
  sleeve: {
    position: 'relative',
    width: '260px',
    height: '260px',
    borderRadius: 'var(--radius-md)',
    overflow: 'visible',
    boxShadow: 'var(--shadow-xl)',
  },
  sleeveShadow: {
    position: 'absolute',
    bottom: '-8px',
    left: '8px',
    right: '8px',
    height: '16px',
    borderRadius: '50%',
    background: 'rgba(31, 36, 48, 0.06)',
    filter: 'blur(8px)',
  },
  vinylPeek: {
    position: 'absolute',
    top: '10px',
    right: '-20px',
    zIndex: -1,
  },
  extractedVinylOuter: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifySelf: 'center',
  },
  extractedVinyl3d: {
    perspective: '1200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extractedVinylTilt: {
    transformStyle: 'preserve-3d' as const,
    animation:
      'vinyl-tilt 6s ease-in-out infinite, vinyl-glow 4s ease-in-out infinite',
    borderRadius: '50%',
    position: 'relative',
  },
  vinylGlintOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    zIndex: 10,
    pointerEvents: 'none',
  },
  vinylGlintBar: {
    position: 'absolute',
    width: '120%',
    height: '200%',
    top: '-50%',
    left: '-10%',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.04) 65%, transparent 100%)',
    animation: 'vinyl-glint 4s ease-in-out 1s infinite backwards',
  },
  finishCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '20px 14px 20px 20px',
    justifySelf: 'center',
    marginTop: '8px',
  },
  keepsakesSide: {
    position: 'absolute',
    left: 'calc(100% + 32px)',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  },
  insertCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 6px 8px',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    minWidth: '64px',
    transition:
      'box-shadow 0.2s ease, transform 0.2s ease',
  },
  insertImage: {
    width: '56px',
    height: '56px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
  },
  insertLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: '64px',
  },
  lightboxOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    cursor: 'pointer',
  },
  lightboxImage: {
    maxWidth: '80vw',
    maxHeight: '80vh',
    borderRadius: '12px',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
    objectFit: 'contain' as const,
  },
  metadata: {
    textAlign: 'center',
    justifySelf: 'center',
  },
  albumTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  artist: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  yearRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '2px',
  },
  year: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
  },
  limitedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#D4A030',
    letterSpacing: '0.02em',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  actionBtn: {
    padding: '10px 24px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-button)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '0.01em',
    cursor: 'pointer',
    transition:
      'all 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
  },
  nowPlaying: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '380px',
    alignItems: 'center',
    paddingTop: '16px',
  },
  nowPlayingInfo: {
    textAlign: 'center',
  },
  nowPlayingLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
    marginBottom: '6px',
  },
  nowPlayingTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: 'var(--text-primary)',
  },
  nowPlayingArtist: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  sidePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexShrink: 0,
    width: '300px',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  vinylPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  customizeCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '20px 14px 20px 20px',
    marginTop: '-125px',
    width: 'fit-content',
    marginLeft: '50px',
  },
  settingsCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '20px 20px 20px 20px',
    width: 'fit-content',
    marginLeft: '50px',
    marginTop: '-190px',
  },
  cardLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
    marginBottom: '12px',
  },
};

export default HeroStage;
