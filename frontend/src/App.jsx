import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtistDashboard from './pages/ArtistDashboard';
import UploadMusic from './pages/UploadMusic';
import MusicPlayer from './pages/MusicPlayer';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/artist/dashboard",
    element: <ArtistDashboard />,
  },
  {
    path: "/artist/dashboard/upload-music",
    element: <UploadMusic />,
  },
  {
    path: "/music/:id",
    element: <MusicPlayer />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
