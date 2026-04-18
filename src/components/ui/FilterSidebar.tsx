import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilter?: (maxPrice: string, minRating: string) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilter }) => {
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);

  const apply = () => {
    if (onFilter) onFilter(String(priceRange), minRating > 0 ? String(minRating) : '');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '6rem' }}>
      <h2 className="text-xl font-bold mb-6">Filter Results</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Max Price / night</h3>
        <div className="flex justify-between text-sm text-secondary mb-2">
          <span>₹0</span>
          <span className="text-primary font-bold">₹{priceRange.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="5000"
          max="100000"
          step="5000"
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {[0, 4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid var(--border-light)',
                background: minRating === r ? 'var(--primary)' : 'transparent',
                color: minRating === r ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {r === 0 ? 'Any' : `${r}+★`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="flex flex-col gap-2">
          {['Free WiFi', 'Breakfast', 'Pool', 'Spa', 'Pet Friendly'].map(filter => (
            <label key={filter} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
              <span className="text-secondary">{filter}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={apply}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'var(--primary)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          cursor: 'pointer',
          border: 'none',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Apply Filters
      </button>
    </div>
  );
};
