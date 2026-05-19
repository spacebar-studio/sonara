import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { records, type Record as RecordType } from '../data/records';
import type { AppState } from '../hooks/useStore';

interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  position: string;
  arrow?: 'down' | 'left' | 'right' | 'up';
  action?: string;
  delay?: number;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Sonara',
    body: 'A digital vinyl experience that bridges the tactile warmth of analog music with the precision of modern interface design. Built as a showcase of motion design, interaction patterns, and emotional UI — the kind of craft that makes products feel alive.',
    position: 'center',
  },
  {
    id: 'shelf',
    title: 'The Shelf',
    body: 'Every album is a doorway. Hover states lift records gently, hinting at interactivity without demanding it. Each album carries its release year, unique cover variants, and a curated set of vinyl finishes. Select one to begin.',
    position: 'above-shelf',
    arrow: 'down',
    action: 'resetToIdle',
  },
  {
    id: 'record',
    title: 'The Record',
    body: 'Selecting an album pulls it into focus with a staggered entrance — sleeve, metadata, and action buttons arrive in sequence with blur-aware transitions. The vinyl peeks from behind the sleeve, hinting at what\'s inside. Every transition uses an ease-out-quint curve for a cinematic, intentional feel.',
    position: 'beside-sleeve-left',
    arrow: 'right',
    action: 'selectRecord',
    delay: 900,
  },
  {
    id: 'covers',
    title: 'Cover Styles',
    body: 'Each album has five unique cover variants — filters like Noir, Warm Tone, and album-specific treatments shift the visual identity of the artwork. For real album covers, CSS filters apply live over the photograph. For generative covers, distinct gradient and pattern combinations create unique identities. No variant is shared between albums.',
    position: 'below-cover-card',
    arrow: 'up',
  },
  {
    id: 'extract',
    title: 'The Vinyl',
    body: 'Pulling the vinyl from its sleeve triggers a choreographed moment — the disc emerges with a 3D tilt animation, light glint, and depth shadow. The disc catches light as it gently rotates in perspective, built with CSS keyframe animations layered over radial groove textures and specular highlights.',
    position: 'beside-vinyl-left',
    arrow: 'right',
    action: 'extractVinyl',
    delay: 800,
  },
  {
    id: 'finishes',
    title: 'Vinyl Finishes',
    body: 'Five album-specific finishes for every record — designed to match each album\'s color palette and mood. Translucent glass, marble swirls, smoke, and opaque classics. Each finish is a layered CSS gradient with tuned groove opacity and specular behavior. No finish appears on more than one album.',
    position: 'below-finish-card',
    arrow: 'up',
  },
  {
    id: 'artifacts',
    title: 'Artifacts & Keepsakes',
    body: 'For albums with real memorabilia — like the hand-signed card from Cannons\' Everything Glows — the keepsake system surfaces these as tangible, clickable objects alongside the vinyl. Only authentic artifacts are shown. Click to enlarge and examine each piece in a focused lightbox view.',
    position: 'below-keepsake',
    arrow: 'up',
  },
  {
    id: 'platter',
    title: 'The Platter',
    body: 'Place the vinyl and the turntable materializes with a scale-and-blur entrance. The tonearm rests to the side, waiting. Every element — the platter texture, the power LED, the counterweight — is crafted to evoke the physicality of real hardware. The transition from sleeve to turntable uses AnimatePresence for seamless handoffs.',
    position: 'beside-platter-left',
    arrow: 'right',
    action: 'placeOnPlatter',
    delay: 1300,
  },
  {
    id: 'playback',
    title: 'Playback & Settings',
    body: 'Drag the tonearm onto the vinyl to start playback — it drops with an ease-out curve, then tracks linearly across the grooves. Scrub by grabbing the disc itself: it tilts in 3D following your pointer direction. The waveform is seeded from each track\'s ID, giving every song a unique visual fingerprint. Player settings let you fine-tune RPM, condition, tracking, and anti-skate.',
    position: 'below-settings-card',
    arrow: 'up',
    action: 'startPlayback',
    delay: 700,
  },
  {
    id: 'conclusion',
    title: 'Crafted with Care',
    body: 'Every interaction in Sonara follows three principles: clarity through motion — blur-aware transitions guide attention and create depth; tactile feedback — 3D tilts, spring physics, and depth shadows make interactions feel physical; and emotional resonance — the small details that make digital feel warm. This is what thoughtful product design looks like in practice.',
    position: 'center',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const showcaseRecord = records.find(r => r.id === 'cannons-everything-glows') || records[0];

interface OnboardingOverlayProps {
  isActive: boolean;
  onClose: () => void;
  captureMode?: boolean;
  selectRecord: (record: RecordType) => void;
  extractVinyl: () => void;
  placeOnPlatter: () => void;
  startPlayback: () => void;
  pausePlayback: () => void;
  swapRecord: () => void;
  appState: AppState;
  step: number;
  onStepChange: (step: number) => void;
}

const OnboardingOverlay: FC<OnboardingOverlayProps> = ({
  isActive,
  onClose,
  captureMode = false,
  selectRecord,
  extractVinyl,
  placeOnPlatter,
  startPlayback,
  swapRecord,
  step,
  onStepChange,
}) => {
  const [cardVisible, setCardVisible] = useState(true);
  const actionFiredRef = useRef<number>(-1);

  const applyStepState = useCallback((stepIndex: number) => {
    const target = STEPS[stepIndex];
    if (!target?.action) return;

    switch (target.action) {
      case 'resetToIdle':
        swapRecord();
        break;
      case 'selectRecord':
        selectRecord(showcaseRecord);
        break;
      case 'extractVinyl':
        extractVinyl();
        break;
      case 'placeOnPlatter':
        placeOnPlatter();
        break;
      case 'startPlayback':
        startPlayback();
        break;
    }
  }, [swapRecord, selectRecord, extractVinyl, placeOnPlatter, startPlayback]);

  const buildStateForStep = useCallback((stepIndex: number, onReady: () => void) => {
    const id = STEPS[stepIndex].id;

    if (id === 'welcome' || id === 'shelf') {
      swapRecord();
      setTimeout(onReady, 600);
      return;
    }

    selectRecord(showcaseRecord);

    if (id === 'record' || id === 'covers') {
      setTimeout(onReady, 900);
      return;
    }

    setTimeout(() => {
      extractVinyl();
      if (id === 'extract' || id === 'finishes' || id === 'artifacts') {
        setTimeout(onReady, 800);
        return;
      }

      setTimeout(() => {
        placeOnPlatter();
        if (id === 'platter') {
          setTimeout(onReady, 1300);
          return;
        }

        setTimeout(() => {
          startPlayback();
          setTimeout(onReady, 700);
        }, 900);
      }, 200);
    }, 300);
  }, [swapRecord, selectRecord, extractVinyl, placeOnPlatter, startPlayback]);

  useEffect(() => {
    if (!isActive) {
      actionFiredRef.current = -1;
      return;
    }
    if (actionFiredRef.current === step) return;

    const current = STEPS[step];
    actionFiredRef.current = step;

    if (!current?.action) {
      setCardVisible(true);
      return;
    }

    setCardVisible(false);
    applyStepState(step);

    const timer = setTimeout(() => setCardVisible(true), current.delay || 600);
    return () => clearTimeout(timer);
  }, [step, isActive, applyStepState]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) onStepChange(step + 1);
    else {
      swapRecord();
      onClose();
    }
  }, [step, onStepChange, onClose, swapRecord]);

  const prev = useCallback(() => {
    if (step <= 0) return;
    const prevStep = step - 1;
    actionFiredRef.current = prevStep;
    setCardVisible(false);
    buildStateForStep(prevStep, () => setCardVisible(true));
    onStepChange(prevStep);
  }, [step, onStepChange, buildStateForStep]);

  const handleClose = useCallback(() => {
    swapRecord();
    onClose();
  }, [swapRecord, onClose]);

  if (!isActive) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const getCardPosition = (pos: string): React.CSSProperties => {
    switch (pos) {
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'above-shelf':
        return { bottom: '240px', left: '50%', transform: 'translateX(-50%)' };
      case 'beside-sleeve-left':
        return { top: '32%', right: '58%', transform: 'translateY(-50%)' };
      case 'below-cover-card':
        return { top: '46%', right: '6%' };
      case 'beside-vinyl-left':
        return { top: '34%', right: '56%', transform: 'translateY(-50%)' };
      case 'below-finish-card':
        return { top: '66%', left: '40%', transform: 'translateX(-50%)' };
      case 'below-keepsake':
        return { top: '48%', left: '58%', transform: 'translateX(-50%)' };
      case 'beside-platter-left':
        return { top: '40%', right: '62%', transform: 'translateY(-50%)' };
      case 'below-settings-card':
        return { top: '42%', right: '6%' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const getArrowStyle = (direction: 'up' | 'down' | 'left' | 'right'): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '16px',
      height: '16px',
      background: '#FFFFFF',
      zIndex: -1,
    };
    const b = '1px solid rgba(0, 0, 0, 0.06)';
    switch (direction) {
      case 'down':
        return { ...base, bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
          borderRight: b, borderBottom: b };
      case 'up':
        return { ...base, top: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
          borderTop: b, borderLeft: b };
      case 'right':
        return { ...base, right: '-8px', top: '50%', transform: 'translateY(-50%) rotate(45deg)',
          borderTop: b, borderRight: b };
      case 'left':
        return { ...base, left: '-8px', top: '50%', transform: 'translateY(-50%) rotate(45deg)',
          borderBottom: b, borderLeft: b };
    }
  };

  const arrowEl = current.arrow ? <div style={getArrowStyle(current.arrow)} /> : null;

  const animDuration = captureMode ? 0 : undefined;

  return (
    <motion.div
      style={s.overlay}
      initial={captureMode ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animDuration ?? 0.4, ease }}
    >
      {/* Progress bar */}
      <div style={s.progressTrack}>
        <motion.div
          style={s.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animDuration ?? 0.4, ease }}
        />
      </div>

      <motion.button
        style={s.skipBtn}
        onClick={handleClose}
        whileHover={captureMode ? undefined : { scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        whileTap={captureMode ? undefined : { scale: 0.95 }}
      >
        skip tour
      </motion.button>

      {/* Floating card */}
      <AnimatePresence mode="wait">
        {cardVisible && (
          <motion.div
            key={step}
            style={{
              ...s.card,
              position: 'absolute' as const,
              ...getCardPosition(current.position),
            }}
            initial={captureMode ? false : { opacity: 0, y: 24, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={captureMode ? undefined : { opacity: 0, y: -12, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: animDuration ?? 0.5, ease }}
          >
            <motion.div
              animate={captureMode ? undefined : { y: [0, -5, 0] }}
              transition={captureMode ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={s.cardInner}>
                {arrowEl}

                <motion.div
                  style={s.stepLabel}
                  initial={captureMode ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: captureMode ? 0 : 0.2, duration: animDuration ?? 0.3 }}
                >
                  {isFirst ? 'introduction' : isLast ? 'conclusion' : `step ${step} of ${STEPS.length - 2}`}
                </motion.div>

                <motion.h3
                  style={s.title}
                  initial={captureMode ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: captureMode ? 0 : 0.15, duration: animDuration ?? 0.4, ease }}
                >
                  {current.title}
                </motion.h3>

                <motion.p
                  style={s.body}
                  initial={captureMode ? false : { opacity: 0, y: 6, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: captureMode ? 0 : 0.25, duration: animDuration ?? 0.4, ease }}
                >
                  {current.body}
                </motion.p>

                <motion.div
                  style={s.nav}
                  initial={captureMode ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: captureMode ? 0 : 0.35, duration: animDuration ?? 0.3 }}
                >
                  {!isFirst && (
                    <motion.button
                      style={s.navBtnSecondary}
                      onClick={prev}
                      whileHover={captureMode ? undefined : { scale: 1.03 }}
                      whileTap={captureMode ? undefined : { scale: 0.97 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      back
                    </motion.button>
                  )}
                  <motion.button
                    style={s.navBtnPrimary}
                    onClick={next}
                    whileHover={captureMode ? undefined : { scale: 1.03, boxShadow: '0 8px 24px rgba(74, 108, 247, 0.3)' }}
                    whileTap={captureMode ? undefined : { scale: 0.97 }}
                  >
                    {isLast ? 'finish' : 'next'}
                    {!isLast && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step dots */}
      <div style={s.dots}>
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...s.dot,
              background: i === step ? 'rgba(255,255,255,0.9)' : i < step ? 'rgba(142,165,255,0.5)' : 'rgba(255,255,255,0.2)',
            }}
            animate={{ scale: i === step ? 1.4 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={() => {
              if (i === step) return;
              if (i < step) {
                actionFiredRef.current = i;
                setCardVisible(false);
                buildStateForStep(i, () => setCardVisible(true));
                onStepChange(i);
              } else {
                onStepChange(i);
              }
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export const ONBOARDING_STEP_COUNT = STEPS.length;

const s: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 18, 25, 0.55)',
    backdropFilter: 'blur(6px)',
    zIndex: 50,
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'rgba(255,255,255,0.06)',
    zIndex: 52,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, rgba(142, 165, 255, 0.7), rgba(197, 168, 255, 0.7))',
    borderRadius: '0 2px 2px 0',
  },
  skipBtn: {
    position: 'absolute',
    bottom: '24px',
    right: '48px',
    padding: '8px 20px',
    borderRadius: '20px',
    background: '#FFFFFF',
    color: '#1F2430',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 52,
    border: 'none',
  },
  card: {
    maxWidth: '420px',
    width: '100%',
    zIndex: 53,
    pointerEvents: 'auto' as const,
  },
  cardInner: {
    position: 'relative' as const,
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)',
  },
  stepLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(142, 165, 255, 1)',
    marginBottom: '12px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#1F2430',
    lineHeight: 1.2,
    margin: 0,
  },
  body: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#5A6478',
    margin: '12px 0 0 0',
  },
  nav: {
    display: 'flex',
    gap: '10px',
    marginTop: '24px',
    justifyContent: 'flex-end',
  },
  navBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: '12px',
    background: '#4A6CF7',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  navBtnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '12px',
    background: '#F0F2F7',
    color: '#5A6478',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dots: {
    position: 'absolute',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    zIndex: 52,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
};

export default OnboardingOverlay;
