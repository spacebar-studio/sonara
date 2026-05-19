import { type FC } from 'react';
import type { CoverVariant } from '../data/records';

interface CoverVariantSelectorProps {
  variants: CoverVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const CoverVariantSelector: FC<CoverVariantSelectorProps> = ({
  variants,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.variants}>
        {variants.map((variant, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(i)}
              style={{
                ...styles.variant,
                background: variant.gradient,
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 4px 14px rgba(31, 36, 48, 0.15), 0 0 0 2px var(--surface), 0 0 0 3.5px ${variant.accentColor}`
                  : '0 2px 8px rgba(31, 36, 48, 0.08)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-tertiary)',
  },
  variants: {
    display: 'flex',
    gap: '10px',
  },
  variant: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    flexShrink: 0,
  },
};

export default CoverVariantSelector;
