import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.scss";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const [musics, setMusics] = useState([
    {
      id: 1,
      title: "Midnight Flow",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Neon Skyline",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      title: "Acoustic Sunset",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      title: "Urban Beats",
      artist: "John Smith",
      coverImageUrl: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      title: "LoFi Study",
      artist: "DJ Chill",
      coverImageUrl: "https://via.placeholder.com/300",
    },
  ]);

  const [playlists, setPlaylists] = useState([
    { id: 1, title: "Chill Vibes", artist: "Jane Doe", musics: [1, 2] },
    { id: 2, title: "Workout Hits", artist: "Jane Doe", musics: [3] },
    {
      id: 3,
      title: "Top 50 Global",
      artist: "Spotify",
      musics: [1, 2, 3, 4, 5],
    },
    { id: 4, title: "Deep Focus", artist: "Spotify", musics: [1, 5] },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/music", { withCredentials: true })
      .then((res) => {
        if (res.data.musics) setMusics(res.data.musics);
      })
      .catch(console.error);

    axios
      .get("http://localhost:3002/api/music/playlist", {
        withCredentials: true,
      })
      .then((res) => {
        const payload = res.data.playlist || res.data.playlists || [];
        setPlaylists(payload);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="home-container">
      <nav className="home-nav">
        <Link to="/" className="logo">
          Spotify26
        </Link>
        <div className="nav-links">
          <Link to="/artist/dashboard">Artists</Link>
          <Link to="/register" className="btn-primary">
            Sign Up
          </Link>
          <Link to="/login">Log In</Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="content-section">
          <h2>Featured Playlists</h2>
          <div className="media-grid">
            {playlists.map((playlist, index) => (
              <div
                key={playlist._id || playlist.id || index}
                className="media-card"
              >
                <div className="card-image-wrapper">
                  <div className="placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                    </svg>
                  </div>
                  <div className="play-btn">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="card-info">
                  <h3>{playlist.title}</h3>
                  <p>By {playlist.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>New Releases</h2>
          <div className="media-grid">
            {musics.map((music, index) => (
              <div
                onClick={() => {
                  socket.emit("play", { musicId: music._id });
                  navigate(`/music/${music._id || music.id}`);
                }}
                key={music._id || music.id || index}
                className="media-card"
              >
                <div className="card-image-wrapper">
                  {music.coverImageUrl ? (
                    <img src={music.coverImageUrl} alt={music.title} />
                  ) : (
                    <div className="placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  )}
                  <div className="play-btn">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="card-info">
                  <h3>{music.title}</h3>
                  <p>{music.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
