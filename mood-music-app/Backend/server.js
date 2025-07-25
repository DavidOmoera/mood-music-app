const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const clientId = '3e2faf01d38e45b6afd202b6a8fac32b';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || 'd4281b83260b43c08d4d1c674411f7d4';
const redirectUri = 'http://127.0.0.1:5173/callback';
const usedCodes = new Set();

app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  if (usedCodes.has(code)) {
    console.error('Code already used:', code.slice(0, 10) + '...');
    return res.status(400).json({ error: 'Authorization code already used' });
  }

  console.log('Received token request:', { code: code.slice(0, 10) + '...', redirectUri });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    usedCodes.add(code);
    console.log('Token exchange successful:', {
      access_token: response.data.access_token.slice(0, 10) + '...',
      expires_in: response.data.expires_in,
      refresh_token: response.data.refresh_token?.slice(0, 10) + '...' || 'none',
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error exchanging token:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to exchange token',
      error_description: error.response?.data?.error_description || error.message,
    });
  }
});

app.post('/api/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: 'No refresh token provided' });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('Token refresh successful:', {
      access_token: response.data.access_token.slice(0, 10) + '...',
      expires_in: response.data.expires_in,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error refreshing token:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Failed to refresh token',
      error_description: error.response?.data?.error_description || error.message,
    });
  }
});

app.listen(3000, () => console.log('Backend server running on http://localhost:3000'));