import React from 'react';
import { Plane, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-card-solid)', 
      borderTop: '1px solid var(--border-light)',
      padding: '4rem 1rem 2rem 1rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
              <Plane size={28} />
              <span className="text-xl font-bold" style={{ color: 'white' }}>WanderStay</span>
            </div>
            <p className="text-secondary text-sm" style={{ maxWidth: '300px' }}>
              Your premium destination for booking the world's most luxurious and comfortable hotel stays.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-secondary hover:text-primary"><Globe size={20} /></a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="flex flex-col gap-2 text-secondary text-sm">
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="flex flex-col gap-2 text-secondary text-sm">
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Cancellation Options</a>
              <a href="#">Trust & Safety</a>
            </div>
          </div>

        </div>
        
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', textAlign: 'center' }}>
          <p className="text-secondary text-sm">
            &copy; {new Date().getFullYear()} WanderStay Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
