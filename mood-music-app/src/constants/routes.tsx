import type { RouteObject } from 'react-router-dom';
import Home from '../components/pages/Home';
import CameraPage from '../components/pages/CameraPage';
import Callback from '../components/pages/Callback';

const ErrorPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-300">Please try again later or reconnect to Spotify.</p>
      <a href="/camerapage" className="mt-4 inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full">
        Go Back
      </a>
    </div>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/', // Root path now renders CameraPage
    element: <CameraPage />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/camerapage',
    element: <CameraPage />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
];

export default routes;