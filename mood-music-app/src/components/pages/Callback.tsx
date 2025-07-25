import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../utils/spotifyAuth';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;

    isProcessed.current = true;
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');

    if (error || state !== storedState) {
      console.error('Spotify auth error:', error || 'State mismatch', { state, storedState });
      navigate('/error?message=' + encodeURIComponent(error || 'State mismatch in Spotify authentication'));
      return;
    }

    if (!code) {
      console.error('No authorization code found');
      navigate('/error?message=' + encodeURIComponent('No authorization code provided'));
      return;
    }

    console.log('Exchanging code:', code.slice(0, 10) + '...');
    getAccessToken(code)
      .then((token) => {
        if (token) {
          console.log('Token received:', token.slice(0, 10) + '...');
          localStorage.removeItem('spotify_auth_state');
          navigate('/camerapage');
        } else {
          console.error('No token received');
          navigate('/error?message=' + encodeURIComponent('Failed to obtain Spotify token'));
        }
      })
      .catch((err: any) => {
        console.error('Callback error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        navigate('/error?message=' + encodeURIComponent('Failed to authenticate with Spotify: ' + (err.message || 'Unknown error')));
      });
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p>Processing Spotify authentication...</p>
      </div>
    </div>
  );
};

export default Callback;