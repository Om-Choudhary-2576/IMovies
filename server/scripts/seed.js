import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Movie from '../src/models/Movie.js';
import Theatre from '../src/models/Theatre.js';
import Show from '../src/models/Show.js';
import Booking from '../src/models/Booking.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import QRCode from 'qrcode';

dotenv.config();

const sampleMovies = [
  {
    title: 'Dune: Part Two',
    slug: 'dune-part-two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    certification: 'PG-13',
    rating: 8.8,
    votesCount: 420000,
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Oppenheimer',
    slug: 'oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral dilemmas and political fallout that followed.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    certification: 'R',
    rating: 8.9,
    votesCount: 650000,
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Interstellar: IMAX Special',
    slug: 'interstellar-imax-special',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2024-11-07'),
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    certification: 'PG-13',
    rating: 8.7,
    votesCount: 980000,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    slug: 'spider-man-across-the-spider-verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    certification: 'PG',
    rating: 8.7,
    votesCount: 350000,
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'The Batman: Extended Edition',
    slug: 'the-batman-extended-edition',
    description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 176,
    releaseDate: new Date('2024-04-15'),
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    director: 'Matt Reeves',
    certification: 'PG-13',
    rating: 7.9,
    votesCount: 740000,
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Gladiator II',
    slug: 'gladiator-ii',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2026-11-22'),
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    certification: 'R',
    rating: 8.4,
    votesCount: 95000,
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    status: 'COMING_SOON',
    isFeatured: true,
  },
  {
    title: 'Mission: Impossible - The Final Reckoning',
    slug: 'mission-impossible-the-final-reckoning',
    description: 'Ethan Hunt and his IMF team face off against their most formidable adversary yet, an all-powerful rogue AI known as the Entity, culminating in a race across the globe to secure humanity’s survival.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Thriller', 'Adventure'],
    language: 'English',
    duration: 165,
    releaseDate: new Date('2026-12-18'),
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
    director: 'Christopher McQuarrie',
    certification: 'PG-13',
    rating: 8.6,
    votesCount: 88000,
    trailerUrl: 'https://www.youtube.com/watch?v=NOhDyHNwvbc',
    status: 'COMING_SOON',
    isFeatured: false,
  },
];

const sampleTheatres = [
  {
    name: 'IMovies Grand Cinema',
    city: 'New York',
    address: '1540 Broadway, Times Square, New York, NY 10036',
    location: { lat: 40.7589, lng: -73.9851 },
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Luxury Recliners', 'Gourmet Bar', 'Reserved Seating'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - IMAX Laser',
        screenType: 'IMAX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Dolby Cinema',
        screenType: 'Dolby Cinema',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
  {
    name: 'IMovies Starplex',
    city: 'Los Angeles',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    location: { lat: 34.1016, lng: -118.3414 },
    amenities: ['4DX Motion', 'Dolby Atmos', 'In-Seat Dining', 'Valet Parking', 'Wheelchair Access'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - 4DX Immersion',
        screenType: '4DX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Premier Standard',
        screenType: 'Standard',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
  {
    name: 'IMovies Metro Cineplex',
    city: 'Chicago',
    address: '600 E Grand Ave, Navy Pier, Chicago, IL 60611',
    location: { lat: 41.8917, lng: -87.6086 },
    amenities: ['IMAX 70mm', 'Dolby Surround', 'Arcade Lounge', 'Café & Bakery', 'Full Bar'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - IMAX Grand',
        screenType: 'IMAX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Classic Screen',
        screenType: 'Standard',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('\n[Seed] Connecting to database...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // 1. Create Administrator and Demo Users
    console.log('[Seed] Creating Administrator and Customer accounts...');
    const admin = await User.create({
      name: 'Cinema Administrator',
      email: 'admin@imovies.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+1 (555) 019-2834',
    });

    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'user@imovies.com',
      password: 'User@123456',
      role: 'user',
      phone: '+1 (555) 014-9988',
    });

    // 2. Insert Movies
    console.log('[Seed] Inserting movie catalog...');
    const createdMovies = await Movie.insertMany(sampleMovies);

    // 3. Insert Theatres & Screens
    console.log('[Seed] Inserting cinema theatres and screens...');
    const createdTheatres = await Theatre.insertMany(sampleTheatres);

    // 4. Generate Shows for Today and Next 4 Days
    console.log('[Seed] Scheduling shows across screens...');
    const showtimes = ['11:00', '14:30', '18:00', '21:30'];
    const createdShows = [];

    // Helper to format date YYYY-MM-DD
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(formatDate(d));
    }

    const nowShowingMovies = createdMovies.filter((m) => m.status === 'NOW_SHOWING');

    for (let theatreIdx = 0; theatreIdx < createdTheatres.length; theatreIdx++) {
      const theatre = createdTheatres[theatreIdx];

      for (let screenIdx = 0; screenIdx < theatre.screens.length; screenIdx++) {
        const screen = theatre.screens[screenIdx];
        const movie = nowShowingMovies[(theatreIdx + screenIdx) % nowShowingMovies.length];

        for (const showDate of dates) {
          for (const time of showtimes) {
            const pricing = screen.screenType === 'IMAX'
              ? { standard: 16.0, premium: 20.0, vip: 26.0 }
              : { standard: 12.0, premium: 16.0, vip: 22.0 };

            const seats = Show.generateSeats(screen.totalRows, screen.seatsPerRow, pricing);

            // Mark a few seats as pre-booked for realism
            if (seats.length > 10) {
              seats[3].status = 'BOOKED';
              seats[4].status = 'BOOKED';
              seats[15].status = 'BOOKED';
            }

            const show = await Show.create({
              movie: movie._id,
              theatre: theatre._id,
              screenId: screen._id,
              screenName: screen.name,
              screenType: screen.screenType,
              date: showDate,
              startTime: time,
              tierPricing: pricing,
              seats,
              status: 'ACTIVE',
            });

            createdShows.push(show);
          }
        }
      }
    }

    // 5. Create a sample confirmed booking for the demo user
    console.log('[Seed] Creating initial sample booking...');
    const firstShow = createdShows[0];
    const firstMovie = await Movie.findById(firstShow.movie);
    const firstTheatre = await Theatre.findById(firstShow.theatre);

    const bookedSeats = [
      { seatNumber: 'C7', row: 'C', column: 7, tier: 'premium', price: 16.0 },
      { seatNumber: 'C8', row: 'C', column: 8, tier: 'premium', price: 16.0 },
    ];

    // Mark these seats in the first show
    for (const seat of firstShow.seats) {
      if (seat.seatNumber === 'C7' || seat.seatNumber === 'C8') {
        seat.status = 'BOOKED';
        seat.heldBy = demoUser._id;
      }
    }
    await firstShow.save();

    const subtotal = 32.0;
    const convenienceFee = 3.0;
    const tax = 2.56;
    const totalAmount = 37.56;

    const qrPayload = JSON.stringify({
      ref: 'IM-7382-9104',
      showId: firstShow._id,
      movie: firstMovie.title,
      date: firstShow.date,
      time: firstShow.startTime,
      seats: ['C7', 'C8'],
    });

    const qrCode = await QRCode.toDataURL(qrPayload);

    await Booking.create({
      bookingReference: 'IM-7382-9104',
      user: demoUser._id,
      show: firstShow._id,
      movie: {
        id: firstMovie._id,
        title: firstMovie.title,
        posterUrl: firstMovie.posterUrl,
        duration: firstMovie.duration,
        language: firstMovie.language,
      },
      theatre: {
        id: firstTheatre._id,
        name: firstTheatre.name,
        city: firstTheatre.city,
        screenName: firstShow.screenName,
        screenType: firstShow.screenType,
      },
      showDetails: {
        date: firstShow.date,
        startTime: firstShow.startTime,
        endTime: firstShow.endTime,
      },
      seats: bookedSeats,
      subtotal,
      convenienceFee,
      tax,
      discount: 0,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'Credit Card (Demo Mode)',
      qrCode,
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('======================================================');
    console.log(`👤 Admin:      admin@imovies.com  / Admin@123456`);
    console.log(`👤 Customer:   user@imovies.com   / User@123456`);
    console.log(`🎬 Movies:     ${createdMovies.length} records`);
    console.log(`🏛️  Theatres:   ${createdTheatres.length} complexes`);
    console.log(`🎟️  Shows:      ${createdShows.length} scheduled screenings`);
    console.log('======================================================\n');
  } catch (error) {
    console.error(`[Seed] Error seeding database: ${error.message}`);
    throw error;
  }
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      await disconnectDB();
      process.exit(1);
    });
}
