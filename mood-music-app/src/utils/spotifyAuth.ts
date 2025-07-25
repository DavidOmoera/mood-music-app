import axios from 'axios';
import { generateRandomString } from '../utils/helpers.ts';

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export const redirectToSpotifyAuth = () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '3e2faf01d38e45b6afd202b6a8fac32b';
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://127.0.0.1:5173/callback';
  const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state';
  const state = generateRandomString(16);

  localStorage.setItem('spotify_auth_state', state);
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_refresh_token');

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
  });

  console.log('Redirecting to Spotify auth');
  window.location.href = `${authUrl}?${params.toString()}`;
};

export const getAccessToken = async (code: string): Promise<string | null> => {
  try {
    console.log('Requesting token with code:', code.slice(0, 10) + '...');
    const response = await axios.post<SpotifyTokenResponse>(
      'http://localhost:3000/api/token',
      { code },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Token received:', response.data.access_token.slice(0, 10) + '...');
    if (response.data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', response.data.refresh_token);
    }
    localStorage.setItem('spotify_token', response.data.access_token);
    localStorage.setItem('spotify_token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
    return response.data.access_token;
  } catch (error: any) {
    console.error('Token error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error_description || 'Failed to get token');
  }
};

export const refreshSpotifyToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) {
    console.error('No refresh token');
    return null;
  }

  try {
    console.log('Refreshing token');
    const response = await axios.post<SpotifyTokenResponse>(
      'http://localhost:3000/api/refresh',
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Refreshed token:', response.data.access_token.slice(0, 10) + '...');
    localStorage.setItem('spotify_token', response.data.access_token);
    localStorage.setItem('spotify_token_expiry', (Date.now() + response.data.expires_in * 1000).toString());
    if (response.data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', response.data.refresh_token);
    }
    return response.data.access_token;
  } catch (error: any) {
    console.error('Refresh error:', error.response?.data || error.message);
    return null;
  }
};

export const isTokenValid = async (): Promise<boolean> => {
  const token = localStorage.getItem('spotify_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  if (!token || !expiry) {
    console.warn('No token or expiry');
    return false;
  }

  if (Date.now() >= parseInt(expiry, 10)) {
    console.log('Token expired');
    return false;
  }

  try {
    await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Token valid');
    return true;
  } catch (error: any) {
    console.error('Token validation failed:', error.response?.data || error.message);
    return false;
  }
};