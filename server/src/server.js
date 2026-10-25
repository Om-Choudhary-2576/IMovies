import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import Movie from './models/Movie.js';
import { seedDatabase } from '../scripts/seed.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start listening
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed sample catalog if database is fresh/empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[Startup] Empty database detected. Auto-seeding cinema catalog and demo accounts...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🎬 IMovies Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`💓 Health:   http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
      // Close server and exit
      server.close(() => process.exit(1));
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT received. Shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`Failed to launch server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
