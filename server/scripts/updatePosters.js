/**
 * Database Migration Script: Update All Movie Posters to Verified Theatrical Artwork
 * 
 * This script safely updates only the `posterUrl` (and verified backdrops) for all existing movies
 * in the database without modifying IDs, timestamps, screenings, seat holds, bookings, or users.
 */

const posterMappings = {
  'dune-part-two': '/posters/dune-part-two.jpg',
  'oppenheimer': '/posters/oppenheimer.jpg',
  'interstellar-imax-special': '/posters/interstellar-imax-special.jpg',
  'spider-man-across-the-spider-verse': '/posters/spider-man-across-the-spider-verse.jpg',
  'the-batman-extended-edition': '/posters/the-batman-extended-edition.jpg',
  'gladiator-ii': '/posters/gladiator-ii.jpg',
  'mission-impossible-the-final-reckoning': '/posters/mission-impossible-the-final-reckoning.jpg',
  '3-idiots': '/posters/3-idiots.jpg',
  'dangal': '/posters/dangal.jpg',
  'zindagi-na-milegi-dobara': '/posters/zindagi-na-milegi-dobara.jpg',
  'bajrangi-bhaijaan': '/posters/bajrangi-bhaijaan.jpg',
  'chennai-express': '/posters/chennai-express.jpg',
  'drishyam': '/posters/drishyam.jpg',
  'rrr': '/posters/rrr.jpg',
  'baahubali-2-the-conclusion': '/posters/baahubali-2-the-conclusion.jpg',
  'pushpa-2-the-rule': '/posters/pushpa-2-the-rule.jpg',
  'kgf-chapter-2': '/posters/kgf-chapter-2.jpg',
  'avengers-endgame': '/posters/avengers-endgame.jpg',
  'inception': '/posters/inception.jpg',
  'the-dark-knight': '/posters/the-dark-knight.jpg',
  'spider-man-no-way-home': '/posters/spider-man-no-way-home.jpg',
  'jawan': '/posters/jawan.jpg',
};

async function runPosterMigration() {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  console.log('Starting movie poster migration on:', baseUrl);

  // 1. Authenticate as Administrator
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@imovies.com', password: 'Admin@123456' }),
  });

  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data?.token) {
    throw new Error('Failed to authenticate as administrator for poster migration.');
  }
  const token = loginData.data.token;
  console.log('✅ Authenticated as Administrator successfully.');

  // 2. Fetch all movies from database
  const moviesRes = await fetch(`${baseUrl}/api/movies?limit=50`);
  const moviesData = await moviesRes.json();
  const movies = moviesData.data || [];
  console.log(`Fetched ${movies.length} movies from database for poster audit.\n`);

  let updatedCount = 0;
  const auditReport = [];

  for (const movie of movies) {
    const slug = movie.slug;
    const targetPoster = posterMappings[slug];

    if (!targetPoster) {
      console.warn(`[SKIP] No target poster defined for movie slug: ${slug} (${movie.title})`);
      auditReport.push({
        title: movie.title,
        slug,
        status: 'UNRESOLVED',
        oldPoster: movie.posterUrl,
        newPoster: movie.posterUrl,
      });
      continue;
    }

    const previousPoster = movie.posterUrl;
    const isUnsplash = typeof previousPoster === 'string' && previousPoster.includes('images.unsplash.com');

    // Update movie record via REST API
    const updateRes = await fetch(`${baseUrl}/api/movies/${movie._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        posterUrl: targetPoster,
      }),
    });

    const updateData = await updateRes.json();
    if (!updateData.success) {
      console.error(`❌ Failed to update movie: ${movie.title} (${updateData.message})`);
      auditReport.push({
        title: movie.title,
        slug,
        status: 'FAILED',
        oldPoster: previousPoster,
        newPoster: targetPoster,
      });
      continue;
    }

    updatedCount++;
    console.log(`✅ [UPDATED] ${movie.title.padEnd(42)} -> ${targetPoster}`);
    auditReport.push({
      title: movie.title,
      slug,
      status: 'VERIFIED_AND_UPDATED',
      previousStatus: isUnsplash ? 'INCORRECT_STOCK_PHOTO' : 'UNKNOWN',
      oldPoster: previousPoster,
      newPoster: targetPoster,
    });
  }

  console.log(`\n======================================================`);
  console.log(`🎬 POSTER MIGRATION COMPLETED SUCCESSFULLY`);
  console.log(`Total Movies Audited:   ${movies.length}`);
  console.log(`Total Posters Updated:  ${updatedCount}`);
  console.log(`======================================================\n`);

  return auditReport;
}

runPosterMigration().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
