import { useState, useRef, useEffect } from 'react';
import { Heart, Share2, ListMusic, AlertCircle, Home, Search, Library, Menu } from 'lucide-react';
import Webcam from 'react-webcam';
import { FaceSmileIcon, FaceFrownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useTensorFlow } from '../../hooks/useTensorFlow';
import { getRecommendations, testSpotifyApi } from '../../utils/spotifyapi';
import { redirectToSpotifyAuth, isTokenValid, refreshSpotifyToken } from '../../utils/spotifyAuth';
import TextInput from '../TextInput';
import type { SpotifyTrack, MoodData } from '../../types';

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  spotify_url: string;
};

const emotionIcons = {
  happy: <FaceSmileIcon className="h-6 w-6 text-yellow-500" />,
  sad: <FaceFrownIcon className="h-6 w-6 text-blue-500" />,
  angry: <FaceFrownIcon className="h-6 w-6 text-red-500" />,
  excited: <ExclamationCircleIcon className="h-6 w-6 text-orange-500" />,
  stressed: <FaceFrownIcon className="h-6 w-6 text-purple-500" />,
  relaxed: <FaceSmileIcon className="h-6 w-6 text-green-500" />,
  calm: <FaceSmileIcon className="h-6 w-6 text-teal-500" />,
};

const CameraPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const { loadModel, detectEmotion } = useTensorFlow();
  const [model, setModel] = useState<any>(null);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const getVideoElement = () => {
    if (!webcamRef.current) return null;
    return webcamRef.current.video as HTMLVideoElement | null;
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing model and token...');
        let token = localStorage.getItem('spotify_token');
        if (token && (await isTokenValid())) {
          console.log('Valid token found:', token.slice(0, 10) + '...');
          setSpotifyToken(token);
        } else {
          console.log('Token invalid or missing, attempting refresh...');
          token = await refreshSpotifyToken();
          if (token) {
            console.log('Refreshed token:', token.slice(0, 10) + '...');
            setSpotifyToken(token);
            localStorage.setItem('spotify_token', token);
          } else {
            console.warn('No valid token after refresh');
            setError('Recommendations will be provided based on your mood');
            setSpotifyToken(null);
          }
        }

        // Test Spotify API connectivity if token exists
        if (token) {
          try {
            await testSpotifyApi(token);
            console.log('Spotify API connectivity confirmed');
          } catch (err: any) {
            setError('Unable to connect to Spotify. Recommendations will be provided based on your mood.');
            console.error('Spotify API test error:', err);
            if (err.response?.status === 401) {
              setSpotifyToken(null);
              localStorage.removeItem('spotify_token');
              localStorage.removeItem('spotify_token_expiry');
              authenticateSpotify();
            }
          }
        }

        try {
          const modelResult = await loadModel();
          setModel(modelResult);
          setIsModelLoaded(true);
          console.log('Model loaded successfully');
        } catch (err: any) {
          setError('Failed to load face detection model. Please use text input.');
          console.error('Model loading error:', err);
        }
      } catch (err: any) {
        setError('Failed to initialize. Recommendations will be provided based on your mood.');
        console.error('Initialization error:', err);
      }
    };
    initialize();
  }, [loadModel]);

  const authenticateSpotify = () => {
    console.log('Redirecting to Spotify auth...');
    setError(null);
    redirectToSpotifyAuth();
  };

  const detectMood = async (retries = 2) => {
    if (!isModelLoaded) {
      setError('Face detection model not loaded. Please use text input.');
      console.error('Model not loaded');
      return;
    }
    if (!spotifyToken && process.env.NODE_ENV !== 'development') {
      setError('Please authenticate with Spotify');
      console.error('No Spotify token');
      return;
    }

    const videoElement = getVideoElement();
    if (!videoElement) {
      setError('Camera not accessible. Please use text input.');
      console.error('Camera not accessible');
      return;
    }

    setIsDetecting(true);
    setError(null);
    console.log('Starting mood detection...');

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const emotion = await detectEmotion(videoElement, model);
        console.log('Detected emotion:', emotion);
        const moodData: MoodData = {
          emotion,
          confidence: 0.8,
          color: emotion === 'happy' ? 'bg-yellow-500' :
            emotion === 'sad' ? 'bg-blue-500' :
              emotion === 'angry' ? 'bg-red-500' :
                emotion === 'excited' ? 'bg-orange-500' :
                  emotion === 'stressed' ? 'bg-purple-500' :
                    emotion === 'relaxed' ? 'bg-green-500' : 'bg-teal-500',
        };
        setCurrentMood(moodData);
        setMoodHistory((prev) => [...prev.slice(-4), moodData]);

        setIsLoadingRecommendations(true);
        console.log('Fetching recommendations for mood:', moodData.emotion);
        const spotifyTracks = await getRecommendations(moodData.emotion, spotifyToken || '');
        console.log('Received tracks:', spotifyTracks.length);
        const formattedTracks: Track[] = spotifyTracks.map((track: SpotifyTrack) => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(', '),
          album: track.album.name,
          duration: formatDuration(track.duration_ms),
          image: track.album.images[0]?.url || 'https://via.placeholder.com/300',
          spotify_url: track.external_urls.spotify,
        }));
        setRecommendations(formattedTracks);
        if (spotifyTracks.length === 0) {
          setError('No recommendations found for this mood. Try a different mood.');
        }
        break;
      } catch (err: any) {
        const errorMessage =
          err.message === 'Spotify authentication failed'
            ? 'Unable to connect to Spotify. Recommendations provided based on your mood.'
            : err.message === 'Spotify API rate limit exceeded'
              ? 'Rate limit reached. Recommendations provided based on your mood.'
              : `Failed to detect mood (attempt ${attempt}/${retries}). Recommendations provided based on your mood.`;
        setError(errorMessage);
        console.error('Mood detection error:', {
          message: err.message,
          stack: err.stack,
          response: err.response ? { status: err.response.status, data: err.response.data } : null,
        });
        if (err.response?.status === 401) {
          setSpotifyToken(null);
          localStorage.removeItem('spotify_token');
          localStorage.removeItem('spotify_token_expiry');
          authenticateSpotify();
          break;
        }
      } finally {
        setIsDetecting(false);
        setIsLoadingRecommendations(false);
      }
    }
  };

  const handleTextMood = async (mood: string) => {
    const normalizedMood = mood.toLowerCase();
    if (!['happy', 'sad', 'angry', 'excited', 'stressed', 'relaxed', 'calm'].includes(normalizedMood)) {
      setError('Invalid mood. Please use: happy, sad, angry, excited, stressed, relaxed, or calm.');
      console.error('Invalid mood input:', mood);
      return;
    }

    console.log('Text mood input:', normalizedMood);
    const moodData: MoodData = {
      emotion: normalizedMood,
      confidence: 0.9,
      color: normalizedMood === 'happy' ? 'bg-yellow-500' :
        normalizedMood === 'sad' ? 'bg-blue-500' :
          normalizedMood === 'angry' ? 'bg-red-500' :
            normalizedMood === 'excited' ? 'bg-orange-500' :
              normalizedMood === 'stressed' ? 'bg-purple-500' :
                normalizedMood === 'relaxed' ? 'bg-green-500' : 'bg-teal-500',
    };
    setCurrentMood(moodData);
    setMoodHistory((prev) => [...prev.slice(-4), moodData]);

    if (!spotifyToken && process.env.NODE_ENV !== 'development') {
      setError('Please authenticate with Spotify');
      console.error('No Spotify token for text mood');
      return;
    }

    setIsLoadingRecommendations(true);
    try {
      console.log('Fetching recommendations for:', normalizedMood);
      const spotifyTracks = await getRecommendations(normalizedMood, spotifyToken || '');
      console.log('Received tracks:', spotifyTracks.length);
      const formattedTracks: Track[] = spotifyTracks.map((track: SpotifyTrack) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        duration: formatDuration(track.duration_ms),
        image: track.album.images[0]?.url || 'https://via.placeholder.com/300',
        spotify_url: track.external_urls.spotify,
      }));
      setRecommendations(formattedTracks);
      if (spotifyTracks.length === 0) {
        setError('No recommendations found for this mood. Try a different mood.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.status === 401 ? 'Unable to connect to Spotify. Recommendations provided based on your mood.' :
        err.response?.status === 429 ? 'Rate limit reached. Recommendations provided based on your mood.' :
          'Recommendations provided based on your mood.';
      setError(errorMessage);
      console.error('Text mood recommendation error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        setSpotifyToken(null);
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_expiry');
        authenticateSpotify();
      }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openTrack = (track: Track) => {
    console.log('Opening track on Spotify:', track.name);
    setCurrentTrack(track);
    window.open(track.spotify_url, '_blank');
  };

  const openMoodPlaylist = () => {
    if (!currentMood) return;
    const playlistUrls: Record<string, string> = {
      happy: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
      sad: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634',
      angry: 'https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa',
      excited: 'https://open.spotify.com/playlist/37i9dQZF1DX3oM43CtKnRV',
      stressed: 'https://open.spotify.com/playlist/37i9dQZF1DWU0ScTcjJBdj',
      relaxed: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiZ',
      calm: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiZ',
    };
    const url = playlistUrls[currentMood.emotion] || 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiZ';
    console.log('Opening mood playlist:', url);
    window.open(url, '_blank');
  };

  const saveToFavorites = (track: Track) => {
    console.log('Saving to favorites:', track.name);
    setError('Track saved to favorites (simulated)');
    // Future: Add backend call to save track
  };

  const shareMood = (track: Track) => {
    const shareText = `I'm feeling ${currentMood?.emotion || 'great'} with "${track.name}" by ${track.artist} on MoodTunes!`;
    console.log('Sharing mood:', shareText);
    navigator.clipboard.writeText(shareText).then(() => {
      setError('Mood copied to clipboard! Share it on social media.');
    }).catch(() => {
      setError('Failed to copy mood. Try sharing manually.');
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300';
    console.warn('Failed to load image, using placeholder:', e.currentTarget.alt);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500">MoodTunes</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/home" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800">
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800">
            <Heart className="w-5 h-5" />
            <span>Liked Songs</span>
          </a>
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-white focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold ml-2">AI Mood Detection</h2>
          <div className="w-6"></div>
        </header>
        {error && (
          <div className="bg-red-900 border border-red-700 p-4 m-4 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}
        <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Let's detect your mood!</h3>
              <p className="text-gray-300">
                {isModelLoaded
                  ? 'Use your camera or type how you feel to get music recommendations'
                  : 'Camera detection unavailable. Type your mood to get music recommendations.'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              {isModelLoaded && (
                <div className="relative">
                  <div className="w-64 h-48 bg-gray-700 rounded-lg overflow-hidden">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full h-full object-cover"
                      videoConstraints={{
                        facingMode: 'user',
                        width: 640,
                        height: 480,
                      }}
                    />
                    {isDetecting && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-2"></div>
                          <p className="text-white">Analyzing your mood...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {currentMood && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
                      {emotionIcons[currentMood.emotion as keyof typeof emotionIcons] || <FaceSmileIcon className="h-6 w-6 text-teal-500" />}
                      <span className="font-medium capitalize">{currentMood.emotion}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="text-center">
                <button
                  onClick={() => {
                    if (spotifyToken && isModelLoaded) {
                      detectMood();
                    } else {
                      authenticateSpotify();
                    }
                  }}
                  disabled={isDetecting}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-50 mb-4"
                >
                  {isDetecting ? 'Detecting...' : spotifyToken && isModelLoaded ? 'Detect My Mood' : 'Connect to Spotify'}
                </button>
                <TextInput onMoodDetected={handleTextMood} />
              </div>
            </div>
            {moodHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Recent Moods</h4>
                <div className="flex gap-2">
                  {moodHistory.map((mood, index) => (
                    <div key={index} className={`px-3 py-1 rounded-full ${mood.color} text-white`}>
                      {mood.emotion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {(recommendations.length > 0 || isLoadingRecommendations || error) && (
          <div className="flex-1 p-6">
            <h4 className="text-xl font-bold mb-4">
              {currentMood ? `Recommended for your ${currentMood.emotion} mood` : 'Music Recommendations'}
            </h4>
            {isLoadingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3">Loading recommendations...</span>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-gray-400">
                <p>No recommendations available. Try detecting your mood again.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {recommendations.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer group"
                    onClick={() => openTrack(track)}
                  >
                    <div className="relative">
                      <img
                        src={track.image}
                        alt={track.album}
                        className="w-12 h-12 rounded object-cover"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ListMusic className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium truncate">{track.name}</h5>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <div className="text-gray-400 text-sm">{track.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img
                src={currentTrack.image}
                alt={currentTrack.album}
                className="w-12 h-12 rounded object-cover"
                onError={handleImageError}
              />
              <div className="min-w-0">
                <h6 className="font-medium truncate">{currentTrack.name}</h6>
                <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openMoodPlaylist()}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                title="Open Mood Playlist"
              >
                <ListMusic className="w-5 h-5" />
              </button>
              <button
                onClick={() => saveToFavorites(currentTrack)}
                className="hover:text-red-500 transition-colors"
                title="Save to Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => shareMood(currentTrack)}
                className="hover:text-red-500 transition-colors"
                title="Share Mood"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;