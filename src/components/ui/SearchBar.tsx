import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface SearchBarProps {
  showDatePickers?: boolean;
  initialLocation?: string;
  onSearch?: (location: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ showDatePickers = false, initialLocation = '', onSearch }) => {
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(location);
    } else {
      window.location.href = `/search?loc=${encodeURIComponent(location)}`;
    }
  };

  return (
    <form className="glass-panel" onSubmit={handleSearch} style={{
      padding: '0.5rem',
      borderRadius: '999px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      alignItems: 'center',
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <div className="search-input-group" style={{ flex: '1 1 200px' }}>
        <MapPin size={20} className="text-primary" />
        <div className="flex flex-col w-full">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider" style={{ marginLeft: '4px' }}>Destination</label>
          <input
            type="text"
            placeholder="Search by city or country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" style={{
        padding: '1rem 1.5rem',
        borderRadius: '999px',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <Search size={20} />
        <span style={{ fontWeight: 600 }}>Search</span>
      </Button>

      <style>{`
        .search-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          transition: background-color 0.2s;
        }
        .search-input-group:hover { background-color: rgba(255,255,255,0.05); }
        .search-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary);
          padding: 4px;
          width: 100%;
        }
        .search-input::placeholder { color: var(--text-muted); font-weight: 400; }
        @media (max-width: 600px) {
          form.glass-panel { flex-direction: column; border-radius: var(--radius-xl); padding: 1rem; }
          .search-input-group { width: 100%; border-radius: var(--radius-md); }
          button[type="submit"] { width: 100%; border-radius: var(--radius-md) !important; justify-content: center; }
        }
      `}</style>
    </form>
  );
};
