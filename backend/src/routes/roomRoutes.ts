import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/rooms/hotel/:id  — returns all rooms with live availability status
// Optional query params: checkIn, checkOut (ISO strings) for date-range availability check
router.get('/hotel/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const { checkIn, checkOut } = req.query;

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    });

    // If date range provided, check booking conflicts
    let bookedRoomIds = new Set<number>();
    if (checkIn && checkOut) {
      const start = new Date(String(checkIn));
      const end = new Date(String(checkOut));

      const conflicts = await prisma.booking.findMany({
        where: {
          hotelId,
          status: 'CONFIRMED',
          roomId: { not: null },
          OR: [{ checkIn: { lte: end }, checkOut: { gte: start } }],
        },
        select: { roomId: true },
      });
      bookedRoomIds = new Set(conflicts.map((b) => b.roomId as number));
    }

    const result = rooms.map((room) => ({
      ...room,
      amenities: JSON.parse(room.amenities),
      // Override status if date-range conflict found
      availabilityStatus: bookedRoomIds.has(room.id)
        ? 'BOOKED'
        : room.status, // AVAILABLE | BOOKED | MAINTENANCE
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
