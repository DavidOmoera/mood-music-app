export const generateCodeVerifier = (length: number = 128): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  const crypto = window.crypto || (window as any).msCrypto;

  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    verifier += charset.charAt(randomValues[i] % charset.length);
  }

  return verifier;
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const redirectToSpotifyAuth = async () => {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('code_verifier', verifier);

  const clientId =  import.meta.env.VITE_SPOTIFY_CLIENT_ID || '3e2faf01d38e45b6afd202b6a8fac32b';
  const redirectUri = import.meta.env.VITE_REDIRECT_URI|| 'http://127.0.0.1:5173/callback';
  const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state';

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `${authUrl}?${params.toString()}`;
};