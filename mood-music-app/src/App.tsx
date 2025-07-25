import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes'; // Adjust the path to your routes file

const router = createBrowserRouter(routes);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;