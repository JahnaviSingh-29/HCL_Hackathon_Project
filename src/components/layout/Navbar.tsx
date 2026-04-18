import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plane, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="glass-panel" style={{ 
      position: 'fixed', 
      top: '1rem', 
      left: '1rem', 
      right: '1rem', 
      zIndex: 50,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <NavLink to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
        <Plane size={28} />
        <span className="text-xl font-bold" style={{ color: 'white' }}>WanderStay</span>
      </NavLink>

      <div className="flex items-center gap-6" style={{ display: 'none' }} id="desktop-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"}>Home</NavLink>
        <NavLink to="/search" className={({isActive}) => isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"}>Explore</NavLink>
        <a href="#promotions" className="text-secondary hover:text-primary">Offers</a>
        {isAuthenticated && (
          <NavLink to="/bookings" className={({isActive}) => isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"}>Bookings</NavLink>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-medium text-white hidden-mobile">{user?.name} (pts: {user?.points})</span>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <NavLink to="/login"><Button variant="ghost" size="sm" className="hidden-mobile">Sign In</Button></NavLink>
            <NavLink to="/register"><Button variant="primary" size="sm">Register</Button></NavLink>
          </>
        )}
        <button className="text-secondary mobile-only" style={{ display: 'none' }}>
          <Menu size={24} />
        </button>
      </div>
      
      <style>{`
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
