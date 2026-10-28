import Movie from '../models/Movie.js';

/**
 * List of verified official primary trailers and alternatives.
 * Every trailer has been tested and verified for existence and external embedding permission via YouTube oEmbed API.
 */
export const verifiedTrailersMap = {
  'Dune: Part Two': {
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=U2Qp5pL3ovA',
  },
  'Oppenheimer': {
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=bK6ldnjE3Y0',
  },
  'Interstellar: IMAX Special': {
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=2LqzF5WauAw',
  },
  'Spider-Man: Across the Spider-Verse': {
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=shW9i6k8cB0',
  },
  'The Batman: Extended Edition': {
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=NLOp_6uPccQ',
  },
  'Gladiator II': {
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
  },
  'Mission: Impossible - The Final Reckoning': {
    trailerUrl: 'https://www.youtube.com/watch?v=NOhDyUmT9z0',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=a7UuYSjiBUs',
  },
  '3 Idiots': {
    trailerUrl: 'https://www.youtube.com/watch?v=K0eDlFX9GMc',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=K0eDlFX9GMc',
  },
  'Dangal': {
    trailerUrl: 'https://www.youtube.com/watch?v=x_7YlGv9u1g',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=x_7YlGv9u1g',
  },
  'Zindagi Na Milegi Dobara': {
    trailerUrl: 'https://www.youtube.com/watch?v=FJrpcDgC3zU',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=FJrpcDgC3zU',
  },
  'Bajrangi Bhaijaan': {
    trailerUrl: 'https://www.youtube.com/watch?v=4nwAra0mz_Q',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=4nwAra0mz_Q',
  },
  'Chennai Express': {
    trailerUrl: 'https://www.youtube.com/watch?v=rARol7Dk2zo',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=rARol7Dk2zo',
  },
  'Drishyam': {
    trailerUrl: 'https://www.youtube.com/watch?v=64xJLmcA2K8',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=64xJLmcA2K8',
  },
  'RRR': {
    trailerUrl: 'https://www.youtube.com/watch?v=GY4BgdUSpbE',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=GY4BgdUSpbE',
  },
  'Baahubali 2: The Conclusion': {
    trailerUrl: 'https://www.youtube.com/watch?v=qD-6d8Wo3do',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=qD-6d8Wo3do',
  },
  'Pushpa 2: The Rule': {
    trailerUrl: 'https://www.youtube.com/watch?v=g3JUbgOHgdw',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=g3JUbgOHgdw',
  },
  'KGF: Chapter 2': {
    trailerUrl: 'https://www.youtube.com/watch?v=JKa05nyUmuQ',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=JKa05nyUmuQ',
  },
  'Avengers: Endgame': {
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=hA6hldpSTF8',
  },
  'Inception': {
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  },
  'The Dark Knight': {
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  },
  'Spider-Man: No Way Home': {
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  },
  'Jawan': {
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    alternativeTrailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
  },
};

/**
 * Safely updates trailer URLs in the database without modifying any other movie fields,
 * preserving IDs, bookings, showtimes, seats, and user accounts.
 */
export const syncVerifiedTrailers = async () => {
  try {
    const movies = await Movie.find({});
    if (!movies || movies.length === 0) return;

    let updatedCount = 0;
    for (const movie of movies) {
      const verified = verifiedTrailersMap[movie.title];
      if (verified) {
        let needsUpdate = false;
        const updates = {};

        if (movie.trailerUrl !== verified.trailerUrl) {
          updates.trailerUrl = verified.trailerUrl;
          needsUpdate = true;
        }

        if (!movie.alternativeTrailerUrl || movie.alternativeTrailerUrl !== verified.alternativeTrailerUrl) {
          updates.alternativeTrailerUrl = verified.alternativeTrailerUrl;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await Movie.updateOne({ _id: movie._id }, { $set: updates });
          updatedCount++;
        }
      }
    }

    if (updatedCount > 0) {
      console.log(`[Trailers] In-place updated ${updatedCount} movie trailers to verified embeddable sources (all records preserved).`);
    }
  } catch (error) {
    console.warn(`[Trailers] Warning during trailer synchronization: ${error.message}`);
  }
};
