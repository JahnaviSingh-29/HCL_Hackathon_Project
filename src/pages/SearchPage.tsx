import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { HotelCard } from '../components/ui/HotelCard';
import { SearchBar } from '../components/ui/SearchBar';
import { searchHotels } from '../data/indianHotels';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const locationParam = searchParams.get('loc') || '';

  const applySort = (data: any[]) => {
    const d = [...data];
    if (sortOrder === 'price_asc') return d.sort((a, b) => a.price - b.price);
    if (sortOrder === 'price_desc') return d.sort((a, b) => b.price - a.price);
    if (sortOrder === 'rating') return d.sort((a, b) => b.rating - a.rating);
    return d;
  };

  const fetchHotels = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (locationParam) params.location = locationParam;
    if (maxPrice) params.maxPrice = String(maxPrice);
    if (minRating) params.minRating = String(minRating);

    axios.get('http://localhost:5000/api/hotels', { params, timeout: 3000 })
      .then(res => {
        setResults(applySort(res.data));
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local data
        const fallback = searchHotels(locationParam, maxPrice, minRating);
        setResults(applySort(fallback));
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationParam, maxPrice, minRating, sortOrder]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleFilter = (mp: string, mr: string) => {
    setMaxPrice(mp ? Number(mp) : undefined);
    setMinRating(mr ? Number(mr) : undefined);
  };

  return (
    <div className="pt-20 container mb-16">
      <div className="my-8">
        <SearchBar
          onSearch={(loc) => navigate(`/search?loc=${encodeURIComponent(loc)}`)}
          initialLocation={locationParam}
        />
      </div>

      <div className="flex justify-between items-center mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="text-2xl font-bold">
          {loading ? (
            <span style={{ opacity: 0.5 }}>Searching...</span>
          ) : (
            <>
              <span className="text-primary">{results.length}</span> hotels found
              {locationParam && <span className="text-secondary text-lg" style={{ fontWeight: 400 }}> in "{locationParam}"</span>}
            </>
          )}
        </h1>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="glass-panel"
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', outline: 'none', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card-solid)', borderRadius: 'var(--radius-md)' }}
        >
          <option value="recommended">⭐ Recommended</option>
          <option value="price_asc">💰 Price: Low → High</option>
          <option value="price_desc">💎 Price: High → Low</option>
          <option value="rating">🏆 Highest Rated</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '2rem' }} id="search-layout">
        <div className="hidden-mobile">
          <FilterSidebar onFilter={handleFilter} />
        </div>

        <div>
          {loading ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="glass-panel" style={{ height: 340, borderRadius: 'var(--radius-xl)', opacity: 0.3, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h2 className="text-2xl font-bold mb-2">No hotels found</h2>
              <p className="text-secondary mb-6">Try "Delhi", "Goa", "Jaipur", "Kerala", "Udaipur" or "Agra"</p>
              <button
                onClick={() => navigate('/search')}
                style={{ padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '999px', cursor: 'pointer', border: 'none', fontWeight: 700 }}
              >Show All Hotels</button>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {results.map(hotel => <HotelCard key={hotel.id} {...hotel} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.5; } }
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          #search-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
