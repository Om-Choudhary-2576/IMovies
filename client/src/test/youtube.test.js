import { describe, it, expect } from 'vitest';
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  isValidYouTubeUrl,
} from '../utils/youtube';

describe('YouTube Utility Functions', () => {
  const validId = 'Way9Dexny3w';

  describe('extractYouTubeVideoId', () => {
    it('extracts ID from standard watch URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/watch?v=${validId}`)).toBe(validId);
    });

    it('extracts ID from watch URL with query parameters', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/watch?v=${validId}&t=25s&ab_channel=WarnerBros`)).toBe(validId);
    });

    it('extracts ID from youtu.be short URL', () => {
      expect(extractYouTubeVideoId(`https://youtu.be/${validId}`)).toBe(validId);
      expect(extractYouTubeVideoId(`https://youtu.be/${validId}?t=10`)).toBe(validId);
    });

    it('extracts ID from YouTube Shorts URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/shorts/${validId}`)).toBe(validId);
    });

    it('extracts ID from standard embed URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube.com/embed/${validId}`)).toBe(validId);
    });

    it('extracts ID from youtube-nocookie.com embed URL', () => {
      expect(extractYouTubeVideoId(`https://www.youtube-nocookie.com/embed/${validId}`)).toBe(validId);
    });

    it('handles direct 11-character video ID', () => {
      expect(extractYouTubeVideoId(validId)).toBe(validId);
    });

    it('returns null for empty, invalid, or malicious URLs', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId(null)).toBeNull();
      expect(extractYouTubeVideoId(undefined)).toBeNull();
      expect(extractYouTubeVideoId('https://example.com/video.mp4')).toBeNull();
      expect(extractYouTubeVideoId('javascript:alert(1)')).toBeNull();
      expect(extractYouTubeVideoId('https://youtube.com/invalid/too-short')).toBeNull();
    });
  });

  describe('getYouTubeEmbedUrl', () => {
    it('constructs standard embed URL without autoplay by default', () => {
      const embedUrl = getYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${validId}`);
      expect(embedUrl).toContain(`https://www.youtube.com/embed/${validId}`);
      expect(embedUrl).toContain('autoplay=0');
      expect(embedUrl).toContain('enablejsapi=1');
      expect(embedUrl).toContain('rel=0');
      expect(embedUrl).toContain('modestbranding=1');
    });

    it('returns null for invalid video input', () => {
      expect(getYouTubeEmbedUrl('invalid-url')).toBeNull();
    });
  });

  describe('getYouTubeWatchUrl', () => {
    it('constructs verified external watch URL', () => {
      expect(getYouTubeWatchUrl(`https://youtu.be/${validId}`)).toBe(`https://www.youtube.com/watch?v=${validId}`);
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('accurately identifies valid and invalid YouTube sources', () => {
      expect(isValidYouTubeUrl(`https://www.youtube.com/watch?v=${validId}`)).toBe(true);
      expect(isValidYouTubeUrl(validId)).toBe(true);
      expect(isValidYouTubeUrl('not-a-video')).toBe(false);
    });
  });
});
