import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './constants/routes.tsx'; 

const router = createBrowserRouter(routes);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;