import { useEffect, useState } from "react";
import "./ArtistDashboard.scss";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ArtistDashboard() {
  // Dummy data for visual representation until API is wired up
  const [musics, setmusics] = useState([
    {
      id: 1,
      title: "Midnight Flow",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/48",
      musicUrl: "#",
    },
    {
      id: 2,
      title: "Neon Skyline",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/48",
      musicUrl: "#",
    },
    {
      id: 3,
      title: "Acoustic Sunset",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/48",
      musicUrl: "#",
    },
  ]);

  const [playlists, setplaylists] = useState([
    {
      id: 1,
      title: "Chill Vibes",
      artist: "Jane Doe",
      musics: [musics[0], musics[1]],
    },
    { id: 2, title: "Workout Hits", artist: "Jane Doe", musics: [musics[2]] },
    {
      id: 3,
      title: "Late Night Focus",
      artist: "Jane Doe",
      musics: [musics[0], musics[2]],
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/music/artist-musics", {
        withCredentials: true,
      })
      .then((res) => {
        setmusics(
          res.data.musics.map((m) => ({
            id: m._id,
            title: m.title,
            artist: m.artist,
            coverImageUrl: m.coverImageUrl,
            musicUrl: m.musicUrl,
            plays: m.plays || 0,
            duration: m.duration || "3:00",
            released: m.released
              ? new Date(m.released).toISOString().split("T")[0]
              : "2024-01-01",
          })),
        );
      });

    axios
      .get("http://localhost:3002/api/music/playlist/artist", {
        withCredentials: true,
      })
      .then((res) => {
        const payload = res.data.playlist || res.data.playlists || [];
        setplaylists(
          payload.map((p) => ({
            id: p._id,
            title: p.title,
            artist: p.artist,
            musics: p.musics || [],
            followers: p.followers || 0,
            updated: p.updated
              ? `${Math.floor((Date.now() - new Date(p.updated).getTime()) / (1000 * 60 * 60 * 24))} days ago`
              : "New Playlist",
          })),
        );
      });
  }, []);

  return (
    <div className="artist-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Artist Dashboard</h1>
          <p>Welcome back! Here's an overview of your music and playlists.</p>
        </div>
        <Link to="/artist/dashboard/upload-music" className="btn-create" style={{ display: 'inline-block', textDecoration: 'none' }}>
          + Upload New
        </Link>
      </header>

      <div className="dashboard-grid">
        {/* Musics Section */}
        <section className="section">
          <div className="section-header">
            <h2>Your Music</h2>
            <button className="btn-view-all">View All</button>
          </div>
          <div className="item-list">
            {musics.map((music) => (
              <div key={music.id} className="list-item">
                <div className="item-icon">
                  {music.coverImageUrl ? (
                    <img
                      src={music.coverImageUrl}
                      alt={music.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  )}
                </div>
                <div className="item-info">
                  <h3>{music.title}</h3>
                  <p>{music.artist}</p>
                </div>
                <div className="item-actions" title="Play">
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
            ))}
          </div>
        </section>

        {/* Playlists Section */}
        <section className="section">
          <div className="section-header">
            <h2>Your Playlists</h2>
            <button className="btn-view-all">View All</button>
          </div>
          <div className="item-list">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="list-item">
                <div className="item-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                </div>
                <div className="item-info">
                  <h3>{playlist.title}</h3>
                  <p>
                    By {playlist.artist} • {playlist.musics.length} Tracks
                  </p>
                </div>
                <div className="item-actions" title="Options">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
