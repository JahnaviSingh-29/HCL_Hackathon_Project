import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const promo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ error: 'Invalid or expired promotion code' });
    }

    res.json({ discountPercent: promo.discountPercent });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
