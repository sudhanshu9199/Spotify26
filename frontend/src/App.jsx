import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtistDashboard from "./pages/ArtistDashboard";
import UploadMusic from "./pages/UploadMusic";
import MusicPlayer from "./pages/MusicPlayer";
import { io } from "socket.io-client";
const socket = io("http://localhost:3002", {
  withCredentials: true,
});

socket.on("play", (data) => {
  const musicId = data.musicId;
  window.location.href = `/music/${musicId}`;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home socket={socket} />,
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
