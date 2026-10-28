/**
 * YouTube Utility functions for IMovies
 * Provides robust video ID extraction, URL validation, and secure embedding configurations.
 */

/**
 * Safely extracts an 11-character YouTube video ID from various YouTube URL formats or raw ID.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID (with optional timestamps or additional params)
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - Raw 11-character ID
 *
 * @param {string} input - YouTube URL or ID
 * @returns {string|null} - 11-character video ID or null if invalid
 */
export const extractYouTubeVideoId = (input) => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // First check standard YouTube URL formats
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }

  // Direct 11-character video ID check (must not be an arbitrary hyphenated slug like 'invalid-url')
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    if (/^[a-z]+-[a-z]+(-[a-z]+)?$/i.test(trimmed)) {
      return null;
    }
    return trimmed;
  }

  return null;
};

/**
 * Builds a valid, standard YouTube embed URL with recommended parameters.
 * Does not use autoplay by default to avoid browser playback issues and audio blocking.
 *
 * @param {string} input - YouTube URL or video ID
 * @param {object} options - Custom parameters
 * @returns {string|null} - Standard embed URL or null
 */
export const getYouTubeEmbedUrl = (input, options = {}) => {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;

  const {
    autoplay = 0,
    enablejsapi = 1,
    origin = typeof window !== 'undefined' ? window.location.origin : '',
    rel = 0,
    modestbranding = 1,
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: String(rel),
    modestbranding: String(modestbranding),
    enablejsapi: String(enablejsapi),
    playsinline: '1',
  });

  if (origin && origin.startsWith('http')) {
    params.set('origin', origin);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Returns a verified external watch URL for direct viewing on YouTube in a new tab.
 *
 * @param {string} input - YouTube URL or video ID
 * @returns {string} - Full https://www.youtube.com/watch?v=VIDEO_ID URL
 */
export const getYouTubeWatchUrl = (input) => {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) {
    if (typeof input === 'string' && input.startsWith('http')) return input;
    return 'https://www.youtube.com';
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Validates whether the given string is a valid YouTube URL or video ID.
 *
 * @param {string} input - URL or string to validate
 * @returns {boolean}
 */
export const isValidYouTubeUrl = (input) => {
  return extractYouTubeVideoId(input) !== null;
};
