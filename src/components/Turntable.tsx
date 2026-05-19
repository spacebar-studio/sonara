import { type FC, useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TurntableProps {
  hasRecord: boolean;
  isPlaying: boolean;
  tonearmOnGroove: boolean;
  tonearmPosition: number;
  onTonearmDrop?: () => void;
  onTonearmLift?: () => void;
  children?: React.ReactNode;
}

const REST_ANGLE = -90;
const PLAY_START = -68;
const PLAY_END = -58;
const PLAY_RANGE = PLAY_END - PLAY_START;
const DRAG_MIN = -95;
const DRAG_MAX = -40;
const GROOVE_THRESHOLD = -72;

const Turntable: FC<TurntableProps> = ({
  hasRecord,
  isPlaying,
  tonearmOnGroove,
  tonearmPosition,
  onTonearmDrop,
  onTonearmLift,
  children,
}) => {
  const tonearmAngle = tonearmOnGroove
    ? PLAY_START + tonearmPosition * PLAY_RANGE
    : REST_ANGLE;

  const pivotRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragAngle = useRef<number | null>(null);
  const dragStartAngle = useRef(0);
  const dragBaseAngle = useRef(0);
  const tonearmRef = useRef<HTMLDivElement>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tonearmOnGrooveRef = useRef(tonearmOnGroove);
  tonearmOnGrooveRef.current = tonearmOnGroove;
  const onTonearmDropRef = useRef(onTonearmDrop);
  onTonearmDropRef.current = onTonearmDrop;
  const onTonearmLiftRef = useRef(onTonearmLift);
  onTonearmLiftRef.current = onTonearmLift;
  const tonearmAngleRef = useRef(tonearmAngle);
  tonearmAngleRef.current = tonearmAngle;
  const tonearmPositionRef = useRef(tonearmPosition);
  tonearmPositionRef.current = tonearmPosition;

  const [armTransition, setArmTransition] = useState(
    'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
  );

  useEffect(() => {
    if (tonearmOnGroove) {
      setArmTransition('transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)');
      const timer = setTimeout(() => {
        setArmTransition('transform 0.4s linear');
      }, 750);
      return () => clearTimeout(timer);
    } else {
      setArmTransition('transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)');
    }
  }, [tonearmOnGroove]);

  const updateArmVisual = useCallback(() => {
    if (tonearmRef.current && dragAngle.current !== null) {
      tonearmRef.current.style.transition = 'none';
      tonearmRef.current.style.transform = `rotate(${dragAngle.current}deg)`;
    }
  }, []);

  const handleTonearmDown = useCallback(
    (e: React.PointerEvent) => {
      if (!hasRecord) return;
      e.preventDefault();
      e.stopPropagation();

      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }

      isDragging.current = true;

      const pivot = pivotRef.current;
      if (pivot) {
        const rect = pivot.getBoundingClientRect();
        const pivotX = rect.left + rect.width / 2;
        const pivotY = rect.top + rect.height / 2;
        dragStartAngle.current = Math.atan2(
          e.clientY - pivotY,
          e.clientX - pivotX,
        );
        dragBaseAngle.current = tonearmAngleRef.current;
      }

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [hasRecord],
  );

  const handleTonearmMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !pivotRef.current) return;
      const rect = pivotRef.current.getBoundingClientRect();
      const pivotX = rect.left + rect.width / 2;
      const pivotY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(
        e.clientY - pivotY,
        e.clientX - pivotX,
      );
      const delta =
        (currentAngle - dragStartAngle.current) * (180 / Math.PI);
      dragAngle.current = Math.max(
        DRAG_MIN,
        Math.min(DRAG_MAX, dragBaseAngle.current + delta),
      );
      updateArmVisual();
    },
    [updateArmVisual],
  );

  const handleTonearmUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (dragAngle.current !== null) {
      const onGroove = dragAngle.current > GROOVE_THRESHOLD;
      const targetAngle = onGroove
        ? PLAY_START + tonearmPositionRef.current * PLAY_RANGE
        : REST_ANGLE;

      if (tonearmRef.current) {
        tonearmRef.current.style.transition =
          'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        tonearmRef.current.style.transform = `rotate(${targetAngle}deg)`;
      }

      if (onGroove && !tonearmOnGrooveRef.current) {
        onTonearmDropRef.current?.();
      } else if (!onGroove && tonearmOnGrooveRef.current) {
        onTonearmLiftRef.current?.();
      }

      clearTimeoutRef.current = setTimeout(() => {
        if (tonearmRef.current && !isDragging.current) {
          tonearmRef.current.style.transition = '';
          tonearmRef.current.style.transform = '';
        }
        clearTimeoutRef.current = null;
      }, 600);
    }
    dragAngle.current = null;
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.outerShadow} />

      <motion.div
        style={styles.body}
        initial={false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        <div style={styles.bodyHighlight} />

        <div style={styles.platterWell}>
          <div style={styles.platter}>
            <div style={styles.platterMat}>
              <div style={styles.platterMatGrooves} />
            </div>

            <div style={styles.recordMount}>{children}</div>
          </div>
        </div>

        {/* Tonearm assembly */}
        <div style={styles.tonearmMount} ref={pivotRef}>
          <div style={styles.pivotBase}>
            <div style={styles.pivotDot} />
          </div>

          <div
            ref={tonearmRef}
            style={{
              ...styles.tonearmGroup,
              transform: `rotate(${tonearmAngle}deg)`,
              transition: armTransition,
            }}
            onPointerDown={handleTonearmDown}
            onPointerMove={handleTonearmMove}
            onPointerUp={handleTonearmUp}
            onPointerCancel={handleTonearmUp}
          >
            <div style={styles.armHitArea} />
            <div style={styles.armTube} />
            <div style={styles.armShaft} />
            <div style={styles.headshell}>
              <div style={styles.cartridge} />
              <div style={styles.stylus} />
            </div>
            <div style={styles.counterweight} />
          </div>

          <div style={styles.armRest}>
            <div style={styles.armRestClip} />
          </div>
        </div>

        {/* Power indicator */}
        <div style={styles.powerIndicator}>
          <motion.div
            style={{
              ...styles.powerDot,
              background: isPlaying ? '#4ADE80' : hasRecord ? '#EF4444' : 'var(--border-subtle)',
              boxShadow: isPlaying
                ? '0 0 6px rgba(74, 222, 128, 0.5)'
                : hasRecord
                  ? '0 0 6px rgba(239, 68, 68, 0.4)'
                  : 'none',
            }}
            animate={
              isPlaying ? { opacity: [1, 0.6, 1] } : { opacity: 1 }
            }
            transition={
              isPlaying
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : {}
            }
          />
        </div>

        <div style={styles.brandLabel}>sonara</div>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerShadow: {
    position: 'absolute',
    width: '370px',
    height: '340px',
    borderRadius: '28px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -48%)',
    background:
      'radial-gradient(ellipse, rgba(31, 36, 48, 0.08) 0%, transparent 70%)',
    filter: 'blur(20px)',
    zIndex: 0,
  },
  body: {
    width: '400px',
    height: '370px',
    borderRadius: '28px',
    background:
      'linear-gradient(160deg, #FFFFFF 0%, #F8F9FC 50%, #F2F4F8 100%)',
    boxShadow: `
      0 24px 64px rgba(31, 36, 48, 0.10),
      0 8px 24px rgba(31, 36, 48, 0.05),
      0 2px 8px rgba(31, 36, 48, 0.04),
      inset 0 1px 0 rgba(255,255,255,1),
      inset 0 -1px 0 rgba(31, 36, 48, 0.03)
    `,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bodyHighlight: {
    position: 'absolute',
    top: '1px',
    left: '8px',
    right: '8px',
    height: '40%',
    borderRadius: '28px 28px 50% 50%',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  platterWell: {
    width: '316px',
    height: '316px',
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #EAEDF2 0%, #F0F2F6 100%)',
    boxShadow: `
      inset 0 2px 8px rgba(31, 36, 48, 0.06),
      inset 0 1px 2px rgba(31, 36, 48, 0.04),
      0 1px 0 rgba(255,255,255,0.6)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  platter: {
    width: '304px',
    height: '304px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #F4F6FA 0%, #EAEDF2 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platterMat: {
    width: '290px',
    height: '290px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #ECEEF4 0%, #E4E7EE 100%)',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 1px 3px rgba(31, 36, 48, 0.04)',
  },
  platterMatGrooves: {
    position: 'absolute',
    inset: '8px',
    borderRadius: '50%',
    background: `repeating-radial-gradient(
      circle at center,
      transparent 0px,
      transparent 12px,
      rgba(31, 36, 48, 0.025) 12.5px,
      transparent 13px
    )`,
  },
  recordMount: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 11,
  },

  /* ── Tonearm ── */
  tonearmMount: {
    position: 'absolute',
    top: '46px',
    right: '14px',
    zIndex: 15,
  },
  pivotBase: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #E0E4EC, #C8CCD4)',
    boxShadow: `
      0 2px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.5),
      inset 0 -1px 0 rgba(0,0,0,0.05)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 3,
  },
  pivotDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#B0B4BC',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
  },
  tonearmGroup: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    transformOrigin: '0 0',
    zIndex: 1,
    cursor: 'grab',
    touchAction: 'none',
  },

  armHitArea: {
    position: 'absolute',
    top: '-16px',
    left: '-200px',
    width: '230px',
    height: '32px',
    cursor: 'grab',
    background: 'transparent',
    zIndex: 10,
  },

  armTube: {
    position: 'absolute',
    top: '-2.5px',
    left: '-30px',
    width: '30px',
    height: '5px',
    borderRadius: '2.5px 0 0 2.5px',
    background: 'linear-gradient(180deg, #D4D8E0 0%, #C0C4CC 100%)',
    boxShadow:
      '0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4)',
    pointerEvents: 'none',
  },

  armShaft: {
    position: 'absolute',
    top: '-1.5px',
    left: '-175px',
    width: '145px',
    height: '3px',
    borderRadius: '1.5px',
    background:
      'linear-gradient(90deg, #B0B4BC 0%, #C8CCD4 40%, #C0C4CC 100%)',
    boxShadow:
      '0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)',
    pointerEvents: 'none',
  },

  headshell: {
    position: 'absolute',
    top: '-6px',
    left: '-200px',
    width: '28px',
    height: '12px',
    borderRadius: '6px 2px 2px 6px',
    background: 'linear-gradient(180deg, #B4B8C0, #9CA0A8)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    pointerEvents: 'none',
  },
  cartridge: {
    position: 'absolute',
    bottom: '-3px',
    left: '3px',
    width: '10px',
    height: '7px',
    background: 'linear-gradient(180deg, #888E96, #6E747C)',
    borderRadius: '1px 1px 2px 2px',
  },
  stylus: {
    position: 'absolute',
    bottom: '-6px',
    left: '6px',
    width: '1.5px',
    height: '5px',
    background: 'linear-gradient(180deg, #606870, #404850)',
    borderRadius: '0 0 1px 1px',
  },

  counterweight: {
    position: 'absolute',
    top: '-5px',
    left: '8px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #D0D4DC, #A8ACB4)',
    boxShadow:
      '0 2px 5px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.35)',
    pointerEvents: 'none',
  },

  armRest: {
    position: 'absolute',
    top: '190px',
    left: '2px',
    width: '14px',
    height: '6px',
    borderRadius: '3px',
    background: 'linear-gradient(180deg, #E0E4EC, #D0D4DC)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
    zIndex: 0,
  },
  armRestClip: {
    position: 'absolute',
    top: '-3px',
    left: '2px',
    width: '6px',
    height: '12px',
    borderRadius: '3px',
    border: '1px solid #C0C4CC',
    borderTop: 'none',
  },

  powerIndicator: {
    position: 'absolute',
    bottom: '28px',
    left: '34px',
  },
  powerDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
  brandLabel: {
    position: 'absolute',
    bottom: '26px',
    right: '34px',
    fontSize: '9px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'var(--text-tertiary)',
    opacity: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export default Turntable;
