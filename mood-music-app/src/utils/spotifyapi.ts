import axios from 'axios';
import qs from 'query-string';
import type { SpotifyTrack } from '../types';
import { isTokenValid, refreshSpotifyToken } from './spotifyAuth';
import { moodTracks } from '../server/MT.ts';

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

// Helper function to generate realistic mock tracks with exact Spotify album covers and valid track IDs
const generateMockTracks = (mood: string): SpotifyTrack[] => {
  // Map negative moods to uplifting or calming moods
  const moodMapping: Record<string, string> = {
    sad: 'happy',
    angry: 'calm',
    stressed: 'relaxed',
  };

  const targetMood = moodMapping[mood.toLowerCase()] || mood.toLowerCase();
  const tracks = moodTracks[targetMood] || moodTracks.calm;
  return tracks.map((track) => ({
    id: track.trackId,
    name: track.name,
    artists: [{ name: track.artist }],
    album: { name: track.album, images: [{ url: track.image }] },
    duration_ms: track.duration_ms,
    preview_url: null, // Satisfy SpotifyTrack type; not used since playback is disabled
    external_urls: { spotify: `https://open.spotify.com/track/${track.trackId}` },
  }));
};

export const testSpotifyApi = async (token: string): Promise<any> => {
  try {
    console.log('Testing Spotify API connectivity');
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Spotify API connectivity confirmed:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Spotify API connectivity test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(`Failed to verify Spotify API access: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const getAvailableGenres = async (token: string): Promise<string[]> => {
  try {
    console.log('Fetching Spotify genre seeds');
    const response = await axios.get<{ genres: string[] }>(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Available genres retrieved:', response.data.genres);
    return response.data.genres;
  } catch (error: any) {
    console.error('Failed to retrieve genre seeds:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error('Failed to fetch genre seeds from Spotify');
  }
};

export const getRecommendations = async (mood: string, token: string, retries: number = 2): Promise<SpotifyTrack[]> => {
  console.log('Fetching recommendations for mood:', mood);
  let accessToken = token;

  // Use fallback data if no token or in development mode
  if (process.env.NODE_ENV === 'development' || !accessToken) {
    console.log('Returning recommendations for mood:', mood);
    return generateMockTracks(mood);
  }

  if (!(await isTokenValid())) {
    console.log('Token expired, attempting refresh...');
    accessToken = (await refreshSpotifyToken()) || token;
    if (!accessToken) {
      console.log('No valid token, returning recommendations');
      return generateMockTracks(mood);
    }
  }

  // Map negative moods to uplifting or calming genres for Spotify API
  const moodMapping: Record<string, string> = {
    sad: 'happy',
    angry: 'calm',
    stressed: 'relaxed',
  };
  const targetMood = moodMapping[mood.toLowerCase()] || mood.toLowerCase();

  const moodParams = {
    happy: { seed_genres: 'pop,dance-pop', target_valence: 0.8, target_energy: 0.7, limit: 10, market: 'from_token' },
    sad: { seed_genres: 'pop,dance-pop', target_valence: 0.8, target_energy: 0.7, limit: 10, market: 'from_token' }, // Uplifting for sad
    angry: { seed_genres: 'chill,acoustic', target_valence: 0.4, target_energy: 0.2, limit: 10, market: 'from_token' }, // Calming for angry
    excited: { seed_genres: 'dance,edm', target_valence: 0.7, target_energy: 0.8, limit: 10, market: 'from_token' },
    stressed: { seed_genres: 'chill,ambient', target_valence: 0.5, target_energy: 0.3, limit: 10, market: 'from_token' }, // Relaxing for stressed
    relaxed: { seed_genres: 'chill,ambient', target_valence: 0.5, target_energy: 0.3, limit: 10, market: 'from_token' },
    calm: { seed_genres: 'chill,acoustic', target_valence: 0.4, target_energy: 0.2, limit: 10, market: 'from_token' },
  };

  const params = moodParams[targetMood as keyof typeof moodParams] || moodParams.calm;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Requesting Spotify recommendations (attempt ${attempt}) with params:`, params);
      const response = await axios.get<SpotifyRecommendationsResponse>(
        'https://api.spotify.com/v1/recommendations',
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'comma' });
          },
        }
      );
      console.log('Recommendations received:', response.data.tracks.length, 'tracks');
      return response.data.tracks;
    } catch (error: any) {
      console.error(`Spotify API request failed (attempt ${attempt}):`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        if (attempt === retries) {
          console.log('Authentication failed, returning recommendations');
          return generateMockTracks(mood);
        }
        console.log('Retrying with refreshed token...');
        accessToken = (await refreshSpotifyToken()) || token;
        if (!accessToken) {
          console.log('No valid token after refresh, returning recommendations');
          return generateMockTracks(mood);
        }
      } else if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 1;
        console.log(`Rate limit hit, waiting ${retryAfter} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      } else {
        console.log('API error, returning recommendations');
        return generateMockTracks(mood);
      }
    }
  }
  console.log('All retries failed, returning recommendations');
  return generateMockTracks(mood);
};