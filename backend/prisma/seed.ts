import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'demo@wanderstay.com' },
    update: {},
    create: { email: 'demo@wanderstay.com', name: 'Demo User', password: hashedPassword, points: 500 },
  });

  await prisma.promotion.upsert({
    where: { code: 'SUMMER20' },
    update: {},
    create: { code: 'SUMMER20', discountPercent: 20, isActive: true },
  });

  await prisma.promotion.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', discountPercent: 10, isActive: true },
  });

  // Delete all hotels and re-seed fresh
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});

  const hotels = [
    {
      name: 'Grand Horizon Resort',
      location: 'Bali, Indonesia',
      price: 19600,
      rating: 4.9,
      reviews: 1254,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      featured: true,
      description: 'Experience unparalleled luxury at the Grand Horizon Resort. Nestled in the heart of Bali, our resort offers breathtaking ocean views, private infinity pools, and world-class spa facilities.',
      amenities: JSON.stringify(['Free High-Speed WiFi', 'Complimentary Breakfast', 'Infinity Pool', 'World-Class Spa', 'Airport Shuttle', 'Fitness Center']),
    },
    {
      name: 'Azure Seaside Villa',
      location: 'Santorini, Greece',
      price: 36000,
      rating: 5.0,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
      featured: true,
      description: 'Perched on the cliffs of Santorini, the Azure Seaside Villa offers stunning panoramic views of the caldera. Enjoy luxurious comfort and iconic Greek architecture.',
      amenities: JSON.stringify(['Free WiFi', 'Private Terrace', 'Jacuzzi', 'Breakfast Included', 'Ocean View', 'Concierge']),
    },
    {
      name: 'Urban Boutique Hotel',
      location: 'Tokyo, Japan',
      price: 14400,
      rating: 4.7,
      reviews: 2109,
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
      featured: false,
      description: 'Located in vibrant central Tokyo, our Urban Boutique Hotel blends modern design with traditional Japanese elements. Steps from top shopping and dining districts.',
      amenities: JSON.stringify(['City View', 'Free WiFi', 'On-site Sushi Bar', 'Gym', 'Concierge']),
    },
    {
      name: 'Emerald Rainforest Lodge',
      location: 'Costa Rica',
      price: 25600,
      rating: 4.8,
      reviews: 645,
      image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80',
      featured: true,
      description: 'Immerse yourself in nature at the Emerald Rainforest Lodge. Surrounded by lush greenery and exotic wildlife, this eco-friendly lodge offers a serene and sustainable getaway.',
      amenities: JSON.stringify(['Eco-friendly', 'Guided Tours', 'Organic Breakfast', 'Pool', 'Free WiFi']),
    },
    {
      name: 'Le Palais Paris',
      location: 'Paris, France',
      price: 42000,
      rating: 4.9,
      reviews: 3201,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      featured: true,
      description: 'Experience the romance of Paris from our luxury hotel with Eiffel Tower views. Indulge in fine French cuisine and world-class service in the heart of the City of Light.',
      amenities: JSON.stringify(['Eiffel Tower View', 'Michelin Restaurant', 'Spa', 'Free WiFi', 'Limousine Service', 'Butler']),
    },
    {
      name: 'Maldives Pearl Overwater',
      location: 'Maldives',
      price: 68000,
      rating: 5.0,
      reviews: 412,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      featured: true,
      description: 'Wake up above turquoise waters in our overwater bungalow paradise. Private plunge pools, direct lagoon access, and stunning coral reef snorkelling await.',
      amenities: JSON.stringify(['Overwater Bungalow', 'Private Plunge Pool', 'Snorkelling', 'All-Inclusive', 'Seaplane Transfer', 'Spa']),
    },
    {
      name: 'Swiss Alpine Chalet',
      location: 'Swiss Alps, Switzerland',
      price: 38000,
      rating: 4.8,
      reviews: 789,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      featured: false,
      description: 'A stunning luxury chalet nestled in the Swiss Alps. Perfect for ski lovers and nature enthusiasts, offering breathtaking mountain views and cozy fireside comfort.',
      amenities: JSON.stringify(['Mountain View', 'Ski-in/Ski-out', 'Heated Pool', 'Sauna', 'Free WiFi', 'Restaurant']),
    },
    {
      name: 'Desert Oasis Resort',
      location: 'Dubai, UAE',
      price: 52000,
      rating: 4.9,
      reviews: 1567,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      featured: false,
      description: 'Luxury meets the desert at Dubai\'s most iconic resort. Featuring rooftop pools, fine dining, and breathtaking views of the city skyline and golden dunes.',
      amenities: JSON.stringify(['Rooftop Pool', 'Fine Dining', 'Spa', 'Desert Safari', 'Free WiFi', 'Gym']),
    },
    {
      name: 'Nusa Penida Clifftop',
      location: 'Bali, Indonesia',
      price: 22000,
      rating: 4.6,
      reviews: 834,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      featured: false,
      description: 'Perched atop dramatic cliffs in Nusa Penida, this hideaway offers breathtaking ocean views, infinity pools, and luxurious open-air villas immersed in tropical beauty.',
      amenities: JSON.stringify(['Cliff View', 'Infinity Pool', 'Breakfast', 'Free WiFi', 'Yoga Sessions']),
    },
    {
      name: 'Kyoto Zen Ryokan',
      location: 'Kyoto, Japan',
      price: 18800,
      rating: 4.9,
      reviews: 998,
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      featured: false,
      description: 'Experience authentic Japanese culture in a traditional Ryokan in the heart of Kyoto. Tatami rooms, kaiseki dinners, and tranquil zen gardens await you.',
      amenities: JSON.stringify(['Tatami Rooms', 'Kaiseki Dinner', 'Hot Spring Bath', 'Free WiFi', 'Zen Garden', 'Tea Ceremony']),
    },
  ];

  // Room templates per hotel (6 rooms each)
  const roomTemplates = [
    { roomNumber: '101', type: 'STANDARD', capacity: 2, floorMult: 0.85, floor: 1, status: 'AVAILABLE',    amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Mini Fridge', 'TV']) },
    { roomNumber: '102', type: 'STANDARD', capacity: 2, floorMult: 0.85, floor: 1, status: 'BOOKED',        amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Mini Fridge', 'TV']) },
    { roomNumber: '201', type: 'DELUXE',   capacity: 3, floorMult: 1.20, floor: 2, status: 'AVAILABLE',    amenities: JSON.stringify(['Free WiFi', 'Balcony', 'Air Conditioning', 'Mini Bar', 'TV', 'Bathtub']) },
    { roomNumber: '202', type: 'DELUXE',   capacity: 3, floorMult: 1.20, floor: 2, status: 'BOOKED',        amenities: JSON.stringify(['Free WiFi', 'Balcony', 'Air Conditioning', 'Mini Bar', 'TV', 'Bathtub']) },
    { roomNumber: '301', type: 'SUITE',    capacity: 4, floorMult: 1.80, floor: 3, status: 'AVAILABLE',    amenities: JSON.stringify(['Free WiFi', 'Living Room', 'Jacuzzi', 'Mini Bar', 'City View', 'Butler Service']) },
    { roomNumber: '401', type: 'PREMIUM',  capacity: 2, floorMult: 2.50, floor: 4, status: 'MAINTENANCE',  amenities: JSON.stringify(['Free WiFi', 'Private Pool', 'Personal Butler', 'Ocean View', 'Jacuzzi', 'King Bed']) },
  ];

  for (const hotel of hotels) {
    const created = await prisma.hotel.create({ data: hotel });
    for (const t of roomTemplates) {
      await prisma.room.create({
        data: {
          hotelId: created.id,
          roomNumber: t.roomNumber,
          type: t.type,
          capacity: t.capacity,
          pricePerNight: Math.round(hotel.price * t.floorMult),
          floor: t.floor,
          status: t.status,
          amenities: t.amenities,
        },
      });
    }
  }

  console.log('✅ Database seeded with hotels, rooms, promotions & demo user!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
