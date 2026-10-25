import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connect to MongoDB using configured URI or fallback to MongoMemoryServer
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected to external database: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] External connection failed (${err.message}). Falling back to in-memory instance...`);
    }
  }

  // Attempt connection to already-running local instance (e.g. active server on 7181 or 27017)
  const candidatePorts = [7181, 27017];
  for (const port of candidatePorts) {
    try {
      const candidateUri = `mongodb://127.0.0.1:${port}/imovies`;
      const conn = await mongoose.connect(candidateUri, { serverSelectionTimeoutMS: 800 });
      console.log(`[MongoDB] Connected to active local MongoDB instance at: ${candidateUri}`);
      return conn;
    } catch (e) {
      // Continue to next candidate or fallback
    }
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'imovies'
      }
    });
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Fatal database connection error: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect from MongoDB and stop memory server if running
 */
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
  } catch (error) {
    console.error(`[MongoDB] Error disconnecting: ${error.message}`);
  }
};
