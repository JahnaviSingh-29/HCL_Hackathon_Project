import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchBar } from '../components/ui/SearchBar';
import { HotelCard } from '../components/ui/HotelCard';
import { getFeaturedHotels } from '../data/indianHotels';

const DESTINATIONS = [
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80' },
  { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&q=80' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80' },
  { name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80' },
];

export const HomePage: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/hotels/featured')
      .then(res => setFeaturedHotels(res.data))
      .catch(() => {
        // Fallback: use built-in data
        setFeaturedHotels(getFeaturedHotels());
      });
  }, []);

  const handleSearch = (location: string) => {
    navigate(`/search?loc=${encodeURIComponent(location)}`);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section style={{
        position: 'relative', padding: '5rem 1rem 8rem 1rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(ellipse at top, rgba(59,130,246,0.25) 0%, transparent 65%)', zIndex: -1
        }} />
        <div style={{ fontSize: '0.85rem', background: 'rgba(255,165,0,0.15)', color: '#FFA500', padding: '0.3rem 1rem', borderRadius: '999px', marginBottom: '1.5rem', border: '1px solid rgba(255,165,0,0.3)' }}>
          🇮🇳 India's Premier Hotel Booking Platform
        </div>
        <h1 className="text-5xl mb-4 leading-tight" style={{ maxWidth: '800px', margin: '0 auto 1rem auto' }}>
          Discover Incredible India,<br />
          <span className="text-primary">one stay at a time.</span>
        </h1>
        <p className="text-xl text-secondary mb-10" style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          From the palaces of Rajasthan to the backwaters of Kerala — find your perfect Indian escape.
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Popular Destinations */}
      <section className="container mb-16">
        <h2 className="text-3xl mb-2">Popular Destinations</h2>
        <p className="text-secondary mb-8">Click any destination to explore hotels.</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
          {DESTINATIONS.map(dest => (
            <div
              key={dest.name}
              onClick={() => handleSearch(dest.name)}
              style={{
                borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative',
                height: '140px', cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${dest.name}/400/280`; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white', fontWeight: 700, fontSize: '1.05rem'
              }}>📍 {dest.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="container mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl mb-2">Featured Hotels</h2>
            <p className="text-secondary">Top-rated stays handpicked across India.</p>
          </div>
          <button
            className="text-primary font-medium"
            style={{ transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onClick={() => navigate('/search')}
          >View All →</button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {featuredHotels.map(hotel => <HotelCard key={hotel.id} {...hotel} />)}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mb-16" id="promotions">
        <div className="glass-panel" style={{
          padding: '3rem', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '2rem',
          backgroundImage: 'linear-gradient(135deg, rgba(255,153,0,0.1), rgba(19,136,8,0.1))'
        }}>
          <div>
            <h2 className="text-3xl mb-2">🇮🇳 Explore India Special</h2>
            <p className="text-secondary text-lg mb-4">
              Use code <strong className="text-primary">INDIA10</strong> for 10% off · <strong className="text-primary">SUMMER20</strong> for 20% off premium properties!
            </p>
          </div>
          <button
            style={{ padding: '0.85rem 2rem', borderRadius: '999px', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '1rem' }}
            onClick={() => navigate('/search')}
          >Explore Now →</button>
        </div>
      </section>
    </div>
  );
};
