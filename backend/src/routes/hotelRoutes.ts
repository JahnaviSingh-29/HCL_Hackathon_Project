import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all hotels with optional filtering
router.get('/', async (req, res) => {
  try {
    const { location, maxPrice, minRating } = req.query;
    const hotels = await prisma.hotel.findMany();

    let results = hotels.map(h => ({ ...h, amenities: JSON.parse(h.amenities) }));

    if (location && String(location).trim()) {
      const loc = String(location).toLowerCase();
      results = results.filter(h =>
        h.location.toLowerCase().includes(loc) || h.name.toLowerCase().includes(loc)
      );
    }
    if (maxPrice) results = results.filter(h => h.price <= parseFloat(String(maxPrice)));
    if (minRating) results = results.filter(h => h.rating >= parseFloat(String(minRating)));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured hotels
router.get('/featured', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({ where: { featured: true }, take: 6 });
    res.json(hotels.map(h => ({ ...h, amenities: JSON.parse(h.amenities) })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single hotel by id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json({ ...hotel, amenities: JSON.parse(hotel.amenities) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
