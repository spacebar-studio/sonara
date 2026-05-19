import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { records, type Record as RecordType } from '../data/records';
import type { PanelState } from '../hooks/useStore';

interface DesignCard {
  title: string;
  body: string[];
}

const CARDS: DesignCard[] = [
  {
    title: 'Welcome / Immersive Entry',
    body: [
      'The onboarding begins with a minimal cinematic entry into the experience.',
      'Instead of overwhelming users with features or text, the app immediately establishes atmosphere through subtle vinyl rotation, layered shadows, soft lighting, ambient gradients, slow parallax motion, and responsive haptics.',
      'The experience is intentionally spacious and calming — designed to feel more like stepping into a listening room than signing up for a utility app.',
      'Motion is used sparingly and smoothly to establish emotional tone without creating visual fatigue.',
    ],
  },
  {
    title: 'The Vinyl as the Core Interaction Model',
    body: [
      'The vinyl itself becomes the primary interaction surface throughout the experience.',
      'Instead of relying on traditional playback controls alone, users interact directly with the record — rotating it to scrub through songs, tilting it to accelerate playback, lifting and placing records onto the player, flipping between Side A and Side B, and physically pulling records from sleeves.',
      'The motion system focuses on inertia, friction, easing, momentum, and responsive touch feedback.',
      'The goal is to make the interface feel physically believable.',
    ],
  },
  {
    title: 'Custom Vinyl & Album Personalization',
    body: [
      'A core part of the experience is allowing users to personalize both the album sleeve and the vinyl itself.',
      'Users can swap alternate album covers, customize vinyl materials, choose visual finishes, apply themed vinyl styles, and preview reflective surfaces and textures in real time.',
      'Themes include glass, tie-dye, translucent acrylic, marbled textures, holographic finishes, liquid gradients, and glow effects.',
      'The customization flow is intentionally playful and visual. The UI minimizes text and prioritizes direct manipulation. Transitions between vinyl variants use smooth interpolation animations to create a premium, collectible feel.',
    ],
  },
  {
    title: 'Bookshelf / Vinyl Library Experience',
    body: [
      'The vinyl library is designed as a physical bookshelf rather than a traditional music grid.',
      'Users browse records through stacked sleeves, shelf depth, layered shadows, soft perspective shifts, and kinetic scrolling.',
      'When a user selects a record, the sleeve subtly lifts forward, lighting shifts dynamically, the record partially slides out, and the user physically pulls the vinyl free. This interaction reinforces the emotional ritual of choosing music.',
      'Search remains lightweight and minimal — artist, album, keyword. The focus is maintaining immersion while still keeping discovery functional.',
    ],
  },
  {
    title: 'Now Playing Experience',
    body: [
      'The playback experience is intentionally minimal and cinematic.',
      'The screen focuses almost entirely on the spinning vinyl, album artwork, motion feedback, waveform visualization, and ambient lighting. The interface reduces unnecessary controls to maintain emotional focus.',
      'Playback animations subtly adapt to song intensity, interaction speed, and playback state. The vinyl responds dynamically to user gestures with tilt, acceleration, rotational inertia, and easing-based transitions.',
      'The goal is to create a playback experience that feels alive and responsive.',
    ],
  },
  {
    title: 'Tracklist / Music Details',
    body: [
      'Tracklists are revealed contextually instead of competing with the playback experience.',
      'Rather than permanently displaying dense information, users can expand tracklists, slide between album details, reveal liner-note-inspired metadata, and transition into side-based playback views.',
      'The transition system emphasizes continuity — records remain visually anchored, album art scales smoothly, and content layers animate progressively.',
      'This prevents disorientation and keeps the experience cohesive.',
    ],
  },
  {
    title: 'Motion Design Principles',
    body: [
      'Motion throughout the experience follows a clear system: smooth easing curves, responsive gesture handling, intentional timing, lightweight transitions, and realistic physical behavior.',
      'Animations are designed to reinforce hierarchy, communicate state changes, increase immersion, provide tactile feedback, and maintain continuity between screens.',
      'Performance was treated as a design constraint from the beginning. The experience avoids overloaded particle systems, excessive blur layers, unnecessary animation stacking, and lag-heavy rendering behaviors.',
      'The goal was creating motion that feels premium, fluid, and performant.',
    ],
  },
  {
    title: 'Design System / Visual Language',
    body: [
      'The visual system emphasizes soft shadows, layered depth, restrained gradients, realistic material lighting, spacious layouts, rounded geometry, and subtle translucency.',
      'Spacing and padding were intentionally prioritized to avoid visual compression. The interface uses negative space heavily to create calmness, focus, elegance, and readability.',
      'Typography remains minimal and secondary to interaction. The product avoids dense menus and over-explaining UI.',
    ],
  },
  {
    title: 'Reflection / Why This Project Matters',
    body: [
      'This project demonstrates interaction design thinking, motion system design, emotional product design, visual craft, prototyping direction, physical-to-digital translation, restraint in interface density, and performance-aware UX thinking.',
      'The project balances delight with usability. Rather than adding motion everywhere, the experience focuses on meaningful interactions that reinforce the emotional ritual of listening to vinyl.',
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const everythingGlows = records.find(r => r.id === 'cannons-everything-glows')!;
const shadowsAlbum = records.find(r => r.id === 'cannons-shadows')!;


interface DesignPresentationProps {
  isActive: boolean;
  onClose: () => void;
  selectRecord: (record: RecordType) => void;
  extractVinyl: () => void;
  placeOnPlatter: () => void;
  togglePanel: (panel: PanelState) => void;
  swapRecord: () => void;
  deselectRecord: () => void;
  panelState: PanelState;
  setCoverIndex: (i: number) => void;
  setFinish: (f: string) => void;
}

const DesignPresentation: FC<DesignPresentationProps> = ({
  isActive,
  onClose,
  selectRecord,
  extractVinyl,
  placeOnPlatter,
  togglePanel,
  swapRecord,
  deselectRecord,
  panelState,
  setCoverIndex,
  setFinish,
}) => {
  const [step, setStep] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const actionFiredRef = useRef<number>(-1);

  const prevStepRef = useRef(0);

  const buildStateForStep = useCallback((stepIndex: number, onReady: () => void) => {
    const prev = prevStepRef.current;
    prevStepRef.current = stepIndex;

    switch (stepIndex) {
      case 0:
      case 1:
        swapRecord();
        setTimeout(onReady, 600);
        break;
      case 2:
        selectRecord(everythingGlows);
        setTimeout(onReady, 900);
        break;
      case 3:
        selectRecord(everythingGlows);
        setTimeout(() => {
          extractVinyl();
          setTimeout(onReady, 800);
        }, 300);
        break;
      case 4:
        // Coming from step 3 (vinyl extracted) — just place on platter, no re-select
        if (prev === 3) {
          placeOnPlatter();
          setTimeout(onReady, 1300);
        } else {
          selectRecord(everythingGlows);
          setTimeout(() => {
            extractVinyl();
            setTimeout(() => {
              placeOnPlatter();
              setTimeout(onReady, 1300);
            }, 200);
          }, 300);
        }
        break;
      case 5:
        // Show tracklist immediately — skip player settings
        if (prev === 4) {
          togglePanel('trackList');
          setTimeout(onReady, 500);
        } else {
          selectRecord(everythingGlows);
          setTimeout(() => {
            extractVinyl();
            setTimeout(() => {
              placeOnPlatter();
              setTimeout(() => {
                togglePanel('trackList');
                setTimeout(onReady, 500);
              }, 1300);
            }, 200);
          }, 300);
        }
        break;
      case 6:
        selectRecord(shadowsAlbum);
        setTimeout(onReady, 900);
        break;
      case 7:
        if (prev === 6) {
          setCoverIndex(3);
          setTimeout(onReady, 600);
        } else {
          selectRecord(shadowsAlbum);
          setTimeout(() => {
            setCoverIndex(3);
            setTimeout(onReady, 600);
          }, 900);
        }
        break;
      case 8:
        if (prev === 7) {
          extractVinyl();
          setTimeout(onReady, 800);
          setTimeout(() => setFinish('sh-blush-pearl'), 2200);
        } else {
          selectRecord(shadowsAlbum);
          setTimeout(() => {
            extractVinyl();
            setTimeout(onReady, 800);
            setTimeout(() => setFinish('sh-blush-pearl'), 2200);
          }, 900);
        }
        break;
      default:
        onReady();
    }
  }, [swapRecord, selectRecord, extractVinyl, placeOnPlatter, togglePanel, panelState, setCoverIndex, setFinish]);

  useEffect(() => {
    if (!isActive) {
      actionFiredRef.current = -1;
      setStep(0);
      return;
    }
    if (actionFiredRef.current === step) return;
    actionFiredRef.current = step;

    setCardVisible(false);
    buildStateForStep(step, () => setCardVisible(true));
  }, [step, isActive, buildStateForStep]);

  const next = useCallback(() => {
    if (step < CARDS.length - 1) {
      actionFiredRef.current = -1;
      setStep(step + 1);
    } else {
      deselectRecord();
      onClose();
    }
  }, [step, deselectRecord, onClose]);

  const prev = useCallback(() => {
    if (step <= 0) return;
    actionFiredRef.current = -1;
    setStep(step - 1);
  }, [step]);

  const handleClose = useCallback(() => {
    deselectRecord();
    onClose();
  }, [deselectRecord, onClose]);

  if (!isActive) return null;

  const current = CARDS[step];
  const isFirst = step === 0;
  const isLast = step === CARDS.length - 1;

  return (
    <motion.div style={s.wrapper} layout transition={{ layout: { duration: 0.45, ease } }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          style={s.cardAndDots}
          layout
          initial={{ opacity: 0, x: -20, scale: 0.97, filter: 'blur(10px)' }}
          animate={{ opacity: cardVisible ? 1 : 0, x: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 20, scale: 0.97, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease, layout: { duration: 0.45, ease } }}
        >
          <div style={s.card}>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={s.cardInner}>
                <div style={s.topRow}>
                  <motion.div
                    style={s.stepLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    {step + 1} of {CARDS.length}
                  </motion.div>
                  <motion.button
                    style={s.closeBtn}
                    onClick={handleClose}
                    whileHover={{ scale: 1.1, background: 'rgba(0,0,0,0.06)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <motion.h3
                  style={s.title}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1, duration: 0.4, ease }}
                >
                  {current.title}
                </motion.h3>

                {current.body.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    style={s.body}
                    initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease }}
                  >
                    {paragraph}
                  </motion.p>
                ))}

                <motion.div
                  style={s.nav}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  {!isFirst && (
                    <motion.button
                      style={s.navBtnSecondary}
                      onClick={prev}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
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
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(74, 108, 247, 0.3)' }}
                    whileTap={{ scale: 0.97 }}
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
          </div>

          {/* Progress dots */}
          <div style={s.dots}>
            {CARDS.map((_, i) => (
              <div
                key={i}
                style={{
                  ...s.dot,
                  background: i === step ? 'var(--text-primary)' : i < step ? 'rgba(142,165,255,0.5)' : 'var(--border-subtle)',
                  transform: i === step ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const s: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'fixed',
    left: '48px',
    top: 0,
    bottom: 0,
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    pointerEvents: 'none',
    paddingBottom: '200px',
  },
  cardAndDots: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    pointerEvents: 'auto',
  },
  card: {
    width: '440px',
  },
  cardInner: {
    position: 'relative',
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '20px',
    padding: '28px 28px 24px',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.10), 0 8px 24px rgba(0, 0, 0, 0.05)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  stepLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(142, 165, 255, 1)',
  },
  closeBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    transition: 'background 0.15s ease',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#1F2430',
    lineHeight: 1.2,
    margin: 0,
  },
  body: {
    fontSize: '13px',
    lineHeight: 1.7,
    color: '#5A6478',
    margin: '10px 0 0 0',
  },
  nav: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  navBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
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
    padding: '9px 14px',
    borderRadius: '12px',
    background: '#F0F2F7',
    color: '#5A6478',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  dots: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  },
};

export default DesignPresentation;
