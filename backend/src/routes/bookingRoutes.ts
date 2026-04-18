import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { differenceInDays } from 'date-fns';

const router = Router();

// Get user's bookings
router.get('/user', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user?.id },
      include: { hotel: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unavailable dates for a hotel
router.get('/hotel/:id/dates', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const bookings = await prisma.booking.findMany({
      where: { 
        hotelId,
        status: 'CONFIRMED',
        checkOut: { gte: new Date() } // Only future or current bookings
      },
      select: { checkIn: true, checkOut: true }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { hotelId, checkIn, checkOut, amount } = req.body;
    const roomId: number | null = req.body.roomId ? parseInt(String(req.body.roomId)) : null;
    
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    // Validate dates
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    if (start >= end) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Check availability (whole hotel or specific room)
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        hotelId,
        status: 'CONFIRMED',
        ...(roomId ? { roomId } : {}),
        OR: [
          { checkIn: { lte: end }, checkOut: { gte: start } }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ error: 'Selected room is already booked for these dates' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        hotelId,
        roomId: roomId || null,
        checkIn: start,
        checkOut: end,
        totalAmount: amount,
      }
    });

    // Mock Email functionality
    console.log(`\n================================`);
    console.log(`📧 MOCK EMAIL NOTIFICATION`);
    console.log(`To: ${req.user.email}`);
    console.log(`Subject: Booking Confirmation #${booking.id}`);
    console.log(`Your booking for ${amount} has been confirmed from ${start.toDateString()} to ${end.toDateString()}.`);
    console.log(`================================\n`);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
