import { type FC } from 'react';
import type { VinylFinishOption } from '../data/records';

interface VinylFinishSelectorProps {
  finishes: VinylFinishOption[];
  selected: string;
  onSelect: (id: string) => void;
}

const VinylFinishSelector: FC<VinylFinishSelectorProps> = ({ finishes, selected, onSelect }) => {
  return (
    <div style={styles.container}>
      <div style={styles.swatches}>
        {finishes.map((finish) => {
          const isSelected = finish.id === selected;
          return (
            <button
              key={finish.id}
              onClick={() => onSelect(finish.id)}
              style={{
                ...styles.swatch,
                background: finish.background,
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                boxShadow: isSelected
                  ? `0 4px 14px rgba(31, 36, 48, 0.15), 0 0 0 2px var(--surface), 0 0 0 3.5px ${finish.color}`
                  : '0 2px 8px rgba(31, 36, 48, 0.08)',
              }}
              title={finish.label}
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
  swatches: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  swatch: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    flexShrink: 0,
  },
};

export default VinylFinishSelector;
