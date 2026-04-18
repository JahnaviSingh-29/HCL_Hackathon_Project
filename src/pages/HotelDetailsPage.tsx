import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { differenceInDays } from 'date-fns';
import {
  MapPin, Star, Wifi, Coffee, Wind, Check, ChevronLeft,
  BedDouble, Users, Layers, CheckCircle, XCircle, AlertTriangle,
  ChevronRight, Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { getHotelById } from '../data/indianHotels';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Room {
  id: number;
  roomNumber: string;
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'PREMIUM';
  capacity: number;
  pricePerNight: number;
  floor: number;
  status: string;
  availabilityStatus: string; // live status factoring in date-range
  amenities: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ROOM_TYPE_META: Record<string, { label: string; color: string; gradient: string }> = {
  STANDARD: { label: 'Standard',  color: '#64748b', gradient: 'linear-gradient(135deg,#334155,#1e293b)' },
  DELUXE:   { label: 'Deluxe',    color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0369a1,#0c4a6e)' },
  SUITE:    { label: 'Suite',     color: '#a855f7', gradient: 'linear-gradient(135deg,#7e22ce,#4c1d95)' },
  PREMIUM:  { label: 'Premium',   color: '#f59e0b', gradient: 'linear-gradient(135deg,#d97706,#92400e)' },
};

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  AVAILABLE:   { label: 'Available',   icon: <CheckCircle size={14} />,   color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  BOOKED:      { label: 'Booked',      icon: <XCircle size={14} />,       color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  MAINTENANCE: { label: 'Maintenance', icon: <AlertTriangle size={14} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

// ─── Room Card ────────────────────────────────────────────────────────────────
interface RoomCardProps {
  room: Room;
  nights: number;
  selected: boolean;
  onSelect: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, nights, selected, onSelect }) => {
  const meta = ROOM_TYPE_META[room.type] ?? ROOM_TYPE_META.STANDARD;
  const statusMeta = STATUS_META[room.availabilityStatus] ?? STATUS_META.BOOKED;
  const isSelectable = room.availabilityStatus === 'AVAILABLE';
  const total = nights > 0 ? room.pricePerNight * nights : null;

  return (
    <div
      onClick={isSelectable ? onSelect : undefined}
      style={{
        border: selected
          ? `2px solid ${meta.color}`
          : isSelectable
          ? '2px solid rgba(255,255,255,0.08)'
          : '2px solid rgba(255,255,255,0.04)',
        borderRadius: '1rem',
        padding: '1.4rem',
        cursor: isSelectable ? 'pointer' : 'not-allowed',
        opacity: isSelectable ? 1 : 0.5,
        position: 'relative',
        transition: 'all 0.2s ease',
        background: selected
          ? `${meta.gradient}, rgba(255,255,255,0.02)`
          : 'rgba(255,255,255,0.03)',
        boxShadow: selected ? `0 0 24px ${meta.color}33` : 'none',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Selected badge */}
      {selected && (
        <div style={{
          position: 'absolute', top: '-1px', right: '-1px',
          background: meta.color, color: '#fff', fontSize: '0.65rem',
          fontWeight: 700, padding: '0.2rem 0.6rem',
          borderRadius: '0 1rem 0 0.6rem', letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Selected ✓
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: `${meta.color}22`, color: meta.color,
            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem',
            borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: '0.4rem',
          }}>
            <Sparkles size={10} />{meta.label}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Room {room.roomNumber}</div>
          <div style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.8rem' }}>Floor {room.floor}</div>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          background: statusMeta.bg, color: statusMeta.color,
          fontSize: '0.72rem', fontWeight: 600, padding: '0.3rem 0.7rem',
          borderRadius: '2rem',
        }}>
          {statusMeta.icon} {statusMeta.label}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '0.9rem', color: 'var(--text-secondary, #cbd5e1)', fontSize: '0.82rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <BedDouble size={14} /> {room.type === 'SUITE' || room.type === 'PREMIUM' ? 'King Bed' : 'Queen Bed'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Users size={14} /> {room.capacity} guests
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Layers size={14} /> Floor {room.floor}
        </span>
      </div>

      {/* Amenity chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {room.amenities.slice(0, 4).map((a) => (
          <span key={a} style={{
            background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary, #94a3b8)',
            fontSize: '0.7rem', padding: '0.18rem 0.5rem', borderRadius: '0.4rem',
          }}>{a}</span>
        ))}
        {room.amenities.length > 4 && (
          <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.7rem', padding: '0.18rem 0.5rem', borderRadius: '0.4rem' }}>
            +{room.amenities.length - 4} more
          </span>
        )}
      </div>

      {/* Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: meta.color }}>
            ₹{room.pricePerNight.toLocaleString()}
          </span>
          <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.78rem' }}> / night</span>
        </div>
        {total !== null && (
          <div style={{ color: 'var(--text-secondary, #cbd5e1)', fontSize: '0.8rem' }}>
            ₹{total.toLocaleString()} for {nights}n
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingHotel, setLoadingHotel] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Load hotel
  useEffect(() => {
    axios.get(`http://localhost:5000/api/hotels/${id}`, { timeout: 3000 })
      .then(res => { setHotel(res.data); setLoadingHotel(false); })
      .catch(() => {
        const fallback = getHotelById(parseInt(id || '1'));
        if (fallback) setHotel(fallback); else { toast.error('Hotel not found'); navigate('/'); }
        setLoadingHotel(false);
      });
  }, [id, navigate]);

  // Load rooms whenever hotel or dates change
  useEffect(() => {
    if (!hotel || !id) return;
    setLoadingRooms(true);
    const params: any = {};
    if (checkIn) params.checkIn = new Date(checkIn).toISOString();
    if (checkOut) params.checkOut = new Date(checkOut).toISOString();

    axios.get(`http://localhost:5000/api/rooms/hotel/${id}`, { params, timeout: 3000 })
      .then(res => { setRooms(res.data); setLoadingRooms(false); })
      .catch(() => {
        // Fallback synthetic rooms if backend is down
        const basePrice = hotel?.price ?? 10000;
        const synthetic: Room[] = [
          { id: 1, roomNumber: '101', type: 'STANDARD', capacity: 2, pricePerNight: Math.round(basePrice * 0.85), floor: 1, status: 'AVAILABLE',    availabilityStatus: 'AVAILABLE',    amenities: ['Free WiFi','Air Conditioning','TV','Mini Fridge'] },
          { id: 2, roomNumber: '102', type: 'STANDARD', capacity: 2, pricePerNight: Math.round(basePrice * 0.85), floor: 1, status: 'BOOKED',        availabilityStatus: 'BOOKED',        amenities: ['Free WiFi','Air Conditioning','TV','Mini Fridge'] },
          { id: 3, roomNumber: '201', type: 'DELUXE',   capacity: 3, pricePerNight: Math.round(basePrice * 1.2 ), floor: 2, status: 'AVAILABLE',    availabilityStatus: 'AVAILABLE',    amenities: ['Free WiFi','Balcony','Mini Bar','TV','Bathtub'] },
          { id: 4, roomNumber: '202', type: 'DELUXE',   capacity: 3, pricePerNight: Math.round(basePrice * 1.2 ), floor: 2, status: 'BOOKED',        availabilityStatus: 'BOOKED',        amenities: ['Free WiFi','Balcony','Mini Bar','TV','Bathtub'] },
          { id: 5, roomNumber: '301', type: 'SUITE',    capacity: 4, pricePerNight: Math.round(basePrice * 1.8 ), floor: 3, status: 'AVAILABLE',    availabilityStatus: 'AVAILABLE',    amenities: ['Free WiFi','Living Room','Jacuzzi','Mini Bar','City View'] },
          { id: 6, roomNumber: '401', type: 'PREMIUM',  capacity: 2, pricePerNight: Math.round(basePrice * 2.5 ), floor: 4, status: 'MAINTENANCE', availabilityStatus: 'MAINTENANCE', amenities: ['Private Pool','Personal Butler','Ocean View','Jacuzzi'] },
        ];
        setRooms(synthetic);
        setLoadingRooms(false);
      });
  }, [hotel, id, checkIn, checkOut]);

  const nights = checkIn && checkOut ? Math.max(0, differenceInDays(new Date(checkOut), new Date(checkIn))) : 0;

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please login to book a hotel'); navigate('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    if (!selectedRoom) { toast.error('Please select a room to book'); return; }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) { toast.error('Check-out date must be after check-in date'); return; }

    const totalAmount = nights * selectedRoom.pricePerNight;
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        hotelId: parseInt(id!),
        roomId: selectedRoom.id,
        checkIn: start.toISOString(),
        checkOut: end.toISOString(),
        amount: totalAmount,
      });
      setBookingConfirmed(true);
      setTimeout(() => navigate('/bookings'), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  // ── Filter ──
  const roomTypes = ['ALL', ...Array.from(new Set(rooms.map(r => r.type)))];
  const filteredRooms = filterType === 'ALL' ? rooms : rooms.filter(r => r.type === filterType);
  const availableCount = rooms.filter(r => r.availabilityStatus === 'AVAILABLE').length;
  const bookedCount    = rooms.filter(r => r.availabilityStatus === 'BOOKED').length;

  if (loadingHotel) return (
    <div style={{ paddingTop: '6rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>Loading hotel details...
    </div>
  );
  if (!hotel) return null;

  if (bookingConfirmed) {
    return (
      <div className="container pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-panel" style={{ padding: '4rem', maxWidth: '600px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
            <Check size={40} style={{ color: '#22c55e' }} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-secondary text-lg mb-2">
            <strong className="text-primary">{hotel.name}</strong> · Room {selectedRoom?.roomNumber} ({selectedRoom?.type})
          </p>
          <p className="text-secondary mb-8">Your reservation has been placed. We've sent a confirmation email.</p>
          <p className="text-sm text-muted">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 mb-16">
      {/* Back */}
      <div className="container mb-6 mt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-secondary hover:text-primary transition">
          <ChevronLeft size={20} /> Back to results
        </button>
      </div>

      {/* Hero image */}
      <div className="container mb-8">
        <div style={{ height: '500px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
          <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Details + Booking panel */}
      <div className="container grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '3rem' }} id="details-grid">

        {/* LEFT COL */}
        <div>
          {/* Title */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-secondary">
                <MapPin size={18} /><span className="text-lg">{hotel.location}</span>
              </div>
            </div>
            <div className="glass-panel flex flex-col items-center justify-center p-3" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="flex items-center gap-1 mb-1">
                <Star size={20} style={{ fill: 'var(--primary)', color: 'var(--primary)' }} />
                <span className="font-bold text-xl">{hotel.rating}</span>
              </div>
              <span className="text-xs text-secondary">{hotel.reviews} reviews</span>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-light)', margin: '2rem 0' }} />

          {/* About */}
          <h2 className="text-2xl font-bold mb-4">About this property</h2>
          <p className="text-secondary leading-relaxed text-lg mb-8">{hotel.description}</p>

          {/* Amenities */}
          <h2 className="text-2xl font-bold mb-4">Popular Amenities</h2>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
            {hotel.amenities.map((amenity: string) => (
              <div key={amenity} className="flex items-center gap-3 text-secondary p-3 glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {amenity.includes('WiFi') ? <Wifi size={20} className="text-primary" /> :
                 amenity.includes('Breakfast') ? <Coffee size={20} className="text-primary" /> :
                 <Wind size={20} className="text-primary" />}
                <span>{amenity}</span>
              </div>
            ))}
          </div>

          {/* ═══ ROOM AVAILABILITY SECTION ══════════════════════════════════ */}
          <div id="room-availability-section">
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div>
                <h2 className="text-2xl font-bold">Available Rooms</h2>
                {checkIn && checkOut && nights > 0 ? (
                  <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    Showing availability for {nights} night{nights > 1 ? 's' : ''} · {checkIn} → {checkOut}
                  </p>
                ) : (
                  <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    Select dates in the booking panel to see live availability
                  </p>
                )}
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', flexShrink: 0 }}>
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: v.color }}>
                    {v.icon} {v.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary strip */}
            <div style={{
              display: 'flex', gap: '1rem', marginBottom: '1.4rem',
              padding: '0.8rem 1.2rem', borderRadius: '0.8rem',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> {availableCount} Available
              </span>
              <span style={{ color: '#94a3b8' }}>·</span>
              <span style={{ fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <XCircle size={16} /> {bookedCount} Booked
              </span>
              <span style={{ color: '#94a3b8' }}>·</span>
              <span style={{ fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={16} /> {rooms.filter(r => r.availabilityStatus === 'MAINTENANCE').length} Maintenance
              </span>
              <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>
                {rooms.length} total rooms
              </span>
            </div>

            {/* Type filter tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {roomTypes.map((t) => {
                const meta = t === 'ALL' ? null : ROOM_TYPE_META[t];
                const isActive = filterType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    style={{
                      padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.18s',
                      border: isActive ? `1.5px solid ${meta?.color ?? 'var(--primary)'}` : '1.5px solid rgba(255,255,255,0.1)',
                      background: isActive ? (meta ? `${meta.color}22` : 'rgba(var(--primary-rgb),0.12)') : 'transparent',
                      color: isActive ? (meta?.color ?? 'var(--primary)') : 'var(--text-secondary, #94a3b8)',
                    }}
                  >
                    {t === 'ALL' ? 'All Rooms' : ROOM_TYPE_META[t]?.label ?? t}
                  </button>
                );
              })}
            </div>

            {/* Room grid */}
            {loadingRooms ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🏨</div>
                Loading rooms...
              </div>
            ) : filteredRooms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No rooms match the selected filter.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    nights={nights}
                    selected={selectedRoom?.id === room.id}
                    onSelect={() => {
                      setSelectedRoom(prev => prev?.id === room.id ? null : room);
                      document.getElementById('booking-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                  />
                ))}
              </div>
            )}

            {/* Selected room summary */}
            {selectedRoom && (
              <div style={{
                marginTop: '1.5rem', padding: '1rem 1.4rem', borderRadius: '0.8rem',
                background: `${ROOM_TYPE_META[selectedRoom.type]?.color ?? '#64748b'}18`,
                border: `1.5px solid ${ROOM_TYPE_META[selectedRoom.type]?.color ?? '#64748b'}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={18} color={ROOM_TYPE_META[selectedRoom.type]?.color} />
                  <span style={{ fontWeight: 600 }}>
                    Room {selectedRoom.roomNumber} ({ROOM_TYPE_META[selectedRoom.type]?.label}) selected
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>· Floor {selectedRoom.floor} · {selectedRoom.capacity} guests</span>
                </div>
                <button onClick={() => setSelectedRoom(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
          {/* ═══ END ROOM AVAILABILITY ══════════════════════════════════════ */}
        </div>

        {/* RIGHT COL — Booking panel */}
        <div>
          <div id="booking-panel" className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '6rem' }}>
            {/* Price display */}
            <div style={{ marginBottom: '0.5rem' }}>
              {selectedRoom ? (
                <>
                  <div className="flex items-end gap-1">
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: ROOM_TYPE_META[selectedRoom.type]?.color ?? 'var(--primary)' }}>
                      ₹{selectedRoom.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-secondary mb-1">/ night</span>
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    background: `${ROOM_TYPE_META[selectedRoom.type]?.color}22`,
                    color: ROOM_TYPE_META[selectedRoom.type]?.color,
                    fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                    borderRadius: '2rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                  }}>
                    <ChevronRight size={10} /> Room {selectedRoom.roomNumber} · {ROOM_TYPE_META[selectedRoom.type]?.label}
                  </div>
                </>
              ) : (
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-primary">₹{hotel.price.toLocaleString()}</span>
                  <span className="text-secondary mb-1">/ night</span>
                </div>
              )}
            </div>

            {/* Date pickers */}
            <div className="grid grid-cols-2 gap-2 mb-4 mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: 'var(--radius-md) 0 0 0' }}>
                <div className="text-xs font-semibold text-muted uppercase mb-1">Check In</div>
                <input type="date" value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); setSelectedRoom(null); }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent border-none text-primary" style={{ outline: 'none' }} />
              </div>
              <div style={{ border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: '0 var(--radius-md) 0 0', borderLeft: 'none' }}>
                <div className="text-xs font-semibold text-muted uppercase mb-1">Check Out</div>
                <input type="date" value={checkOut}
                  onChange={(e) => { setCheckOut(e.target.value); setSelectedRoom(null); }}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent border-none text-primary" style={{ outline: 'none' }} />
              </div>
              <div style={{ border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: '0 0 var(--radius-md) var(--radius-md)', gridColumn: '1 / span 2', borderTop: 'none' }}>
                <div className="text-xs font-semibold text-muted uppercase mb-1">Guests</div>
                <select defaultValue="2 Adults" className="w-full bg-transparent border-none text-primary" style={{ outline: 'none' }}>
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                </select>
              </div>
            </div>

            {/* Night + total summary */}
            {nights > 0 && selectedRoom && (
              <div style={{
                padding: '0.8rem 1rem', marginBottom: '1rem',
                background: 'rgba(255,255,255,0.04)', borderRadius: '0.7rem',
                fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>₹{selectedRoom.pricePerNight.toLocaleString()} × {nights} nights</span>
                  <span>₹{(selectedRoom.pricePerNight * nights).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Taxes & fees (18%)</span>
                  <span>₹{Math.round(selectedRoom.pricePerNight * nights * 0.18).toLocaleString()}</span>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '0.3rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span>
                  <span>₹{Math.round(selectedRoom.pricePerNight * nights * 1.18).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            {!selectedRoom ? (
              <div style={{
                padding: '0.9rem', textAlign: 'center', borderRadius: '0.7rem',
                background: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(255,255,255,0.12)',
                color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem',
              }}>
                <BedDouble size={20} style={{ margin: '0 auto 0.4rem' }} />
                Select a room below to continue
              </div>
            ) : (
              <Button variant="primary" size="lg" fullWidth onClick={handleBook}>
                Book Room {selectedRoom.roomNumber}
              </Button>
            )}

            <p className="text-center text-xs text-muted mt-4">You won't be charged yet</p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          #details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
