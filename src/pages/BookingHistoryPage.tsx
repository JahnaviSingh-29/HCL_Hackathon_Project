import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';

export const BookingHistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/user');
        setBookings(res.data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  return (
    <div className="pt-20 container mb-16 h-custom" style={{ minHeight: '80vh' }}>
      <h1 className="text-4xl font-bold mb-8">Your Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="glass-panel p-8 text-center text-secondary">
          <p className="text-xl mb-4">You have no booking history yet.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Explore Hotels</Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={booking.hotel.image} alt={booking.hotel.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{booking.hotel.name}</h3>
                  <div className="text-secondary text-sm">
                    {format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-primary font-semibold mt-1">₹{booking.totalAmount} • {booking.status}</div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button variant="secondary" onClick={() => navigate(`/hotel/${booking.hotelId}`)}>Book Again</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
