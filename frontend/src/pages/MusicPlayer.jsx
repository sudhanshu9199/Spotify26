import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MusicPlayer.scss";

export default function MusicPlayer() {
  const { id } = useParams();
  const audioRef = useRef(null);

  const [music, setMusic] = useState({
    title: "Loading...",
    artist: "Loading...",
    coverImageUrl: "https://via.placeholder.com/400",
    musicUrl: null,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    // When the real endpoint is verified, uncomment below:

    axios
      .get(`http://localhost:3002/api/music/get-details/${id}`, {
        withCredentials: true,
      })
      .then((res) => setMusic(res.data.music))
      .catch(console.error);

    // Fallback demonstration while dev is active
    setMusic({
      title: "Neon Skyline",
      artist: "Jane Doe",
      coverImageUrl: "https://via.placeholder.com/400",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    });
  }, [id]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !music.musicUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    const newVol = Number(e.target.value);
    audioRef.current.volume = newVol;
    setVolume(newVol);
  };

  const handleSpeedChange = (e) => {
    if (!audioRef.current) return;
    const newRate = Number(e.target.value);
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className="player-container">
      {music.musicUrl && (
        <audio
          ref={audioRef}
          src={music.musicUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          autoPlay={true}
        />
      )}

      <header className="player-header">
        <Link to="/" className="back-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
          </svg>
          Back
        </Link>
      </header>

      <main className="player-main">
        <div className="cover-art">
          <img src={music.coverImageUrl} alt={`${music.title} Cover`} />
        </div>

        <div className="track-info">
          <h1>{music.title}</h1>
          <h2>{music.artist}</h2>
        </div>

        <div className="controls-wrapper">
          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              className="progress-bar"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleProgressChange}
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${progressPercent}%, var(--color-background-highlight) ${progressPercent}%)`,
              }}
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="controls-matrix">
            <div className="speed-control">
              <label htmlFor="speed">Speed:</label>
              <select
                id="speed"
                value={playbackRate}
                onChange={handleSpeedChange}
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
            </div>

            <div className="playback-controls">
              <button type="button" title="Previous">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                type="button"
                className="play-pause-btn"
                onClick={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  // Pause Icon
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  // Play Icon
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button type="button" title="Next">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            <div className="volume-control">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, #fff ${volumePercent}%, var(--color-background-highlight) ${volumePercent}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
