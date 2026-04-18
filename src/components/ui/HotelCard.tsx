import React from 'react';
import { MapPin, Star, Wifi, Coffee, Wind } from 'lucide-react';
import { Button } from './Button';

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  featured?: boolean;
}

export const HotelCard: React.FC<HotelCardProps> = ({ 
  id, name, location, price, rating, reviews, image, featured 
}) => {
  return (
    <div className="glass-panel hotel-card" style={{ 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}>
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={image} 
          alt={name} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://picsum.photos/seed/${encodeURIComponent(name)}/800/520`;
          }}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            backgroundColor: 'var(--bg-card-solid)'
          }} 
          className="hotel-img"
        />
        {featured && (
          <div style={{ 
            position: 'absolute', 
            top: '1rem', 
            left: '1rem', 
            backgroundColor: 'var(--primary)', 
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-md)'
          }}>
            Featured
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <Star size={14} className="text-primary" style={{ fill: 'var(--primary)' }} />
          <span className="text-white font-semibold text-sm">{rating}</span>
          <span className="text-gray-300 text-xs">({reviews})</span>
        </div>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{name}</h3>
          <div className="text-right">
            <span className="font-bold text-xl text-primary">₹{price}</span>
            <span className="text-xs text-muted block">/ night</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-secondary text-sm mb-4">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-3 text-muted mb-4 mt-auto">
          <div className="flex items-center gap-1" title="Free Wifi"><Wifi size={16} /></div>
          <div className="flex items-center gap-1" title="Breakfast Included"><Coffee size={16} /></div>
          <div className="flex items-center gap-1" title="Air Conditioning"><Wind size={16} /></div>
        </div>

        <Button variant="outline" fullWidth onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/hotel/${id}`;
        }}>View Details</Button>
      </div>

      <style>{`
        .hotel-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
          border-color: var(--border-focus);
        }
        .hotel-card:hover .hotel-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
