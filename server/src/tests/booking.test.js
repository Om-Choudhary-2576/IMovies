import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

describe('Seat Holding & Booking Concurrency API Tests', () => {
  let userToken1;
  let userToken2;
  let userId1;
  let testShow;

  beforeAll(async () => {
    await connectDB();
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // Create 2 test users
    const u1 = await User.create({
      name: 'Customer One',
      email: 'cust1@test.com',
      password: 'Password@123',
    });
    userId1 = u1._id;

    const u2 = await User.create({
      name: 'Customer Two',
      email: 'cust2@test.com',
      password: 'Password@123',
    });

    const l1 = await request(app).post('/api/auth/login').send({ email: 'cust1@test.com', password: 'Password@123' });
    const l2 = await request(app).post('/api/auth/login').send({ email: 'cust2@test.com', password: 'Password@123' });

    userToken1 = l1.body.data.token;
    userToken2 = l2.body.data.token;

    // Create test movie, theatre & show
    const movie = await Movie.create({
      title: 'Inception Test',
      slug: 'inception-test',
      description: 'Dream within a dream',
      posterUrl: 'https://example.com/poster.jpg',
      backdropUrl: 'https://example.com/backdrop.jpg',
      genres: ['Sci-Fi'],
      duration: 148,
      releaseDate: new Date(),
    });

    const theatre = await Theatre.create({
      name: 'Test Cinema',
      city: 'Metropolis',
      address: '100 Main St',
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1',
          screenType: 'Standard',
          totalRows: 4,
          seatsPerRow: 6,
          totalSeats: 24,
        },
      ],
    });

    const seats = Show.generateSeats(4, 6, { standard: 10, premium: 15, vip: 20 });
    testShow = await Show.create({
      movie: movie._id,
      theatre: theatre._id,
      screenId: theatre.screens[0]._id,
      screenName: theatre.screens[0].name,
      screenType: theatre.screens[0].screenType,
      date: '2026-10-30',
      startTime: '19:00',
      tierPricing: { standard: 10, premium: 15, vip: 20 },
      seats,
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('POST /api/bookings/hold - User 1 should hold seat D1 successfully', async () => {
    const res = await request(app)
      .post('/api/bookings/hold')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({
        showId: testShow._id,
        seatNumbers: ['D1'],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seats[0].seatNumber).toBe('D1');
    expect(res.body.data.holdExpiresAt).toBeDefined();
  });

  it('POST /api/bookings/hold - User 2 attempting to hold seat D1 must fail with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/bookings/hold')
      .set('Authorization', `Bearer ${userToken2}`)
      .send({
        showId: testShow._id,
        seatNumbers: ['D1'],
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.unavailableSeats[0].seatNumber).toBe('D1');
  });

  it('POST /api/bookings/confirm - User 1 confirms booking for held seat D1', async () => {
    const res = await request(app)
      .post('/api/bookings/confirm')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({
        showId: testShow._id,
        seatNumbers: ['D1'],
        paymentMethod: 'Test Card',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bookingReference).toMatch(/^IM-\d{4}-\d{4}$/);
    expect(res.body.data.bookingStatus).toBe('CONFIRMED');
    expect(res.body.data.qrCode).toContain('data:image/png;base64');
  });

  it('POST /api/bookings/confirm - User 2 attempting to book the already confirmed seat D1 must fail with 409', async () => {
    const res = await request(app)
      .post('/api/bookings/confirm')
      .set('Authorization', `Bearer ${userToken2}`)
      .send({
        showId: testShow._id,
        seatNumbers: ['D1'],
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
