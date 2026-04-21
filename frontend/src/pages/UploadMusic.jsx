import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadMusic.scss";

export default function UploadMusic() {
  const navigate = useNavigate();
  const musicInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [form, setform] = useState({
    title: "",
    name: "", // Artist/Album custom name tag
  });
  
  const [files, setFiles] = useState({
    music: null,
    coverImage: null,
  });

  const [previews, setPreviews] = useState({
    music: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = e.target.name;

    // Revoke old object URL if changing files to prevent memory leaks
    if (previews[name]) {
      URL.revokeObjectURL(previews[name]);
    }

    const objectUrl = URL.createObjectURL(file);

    setFiles((prev) => ({ ...prev, [name]: file }));
    setPreviews((prev) => ({ ...prev, [name]: objectUrl }));
  };

  // Revoke URLs safely on component unmount
  useEffect(() => {
    return () => {
      if (previews.music) URL.revokeObjectURL(previews.music);
      if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Guard clause: ensure files are selected
    if (!files.music || !files.coverImage) {
      alert("Please select both an audio file and a cover image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("name", form.name);
      formData.append("music", files.music);
      formData.append("coverImage", files.coverImage);

      const response = await axios.post(
        "http://localhost:3002/api/music/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log(response.data);
      navigate("/artist/dashboard");
    } catch (err) {
      console.error("Error uploading music:", err);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <Link to="/artist/dashboard" className="back-link">
          &larr; Back to Dashboard
        </Link>
        <div className="upload-header">
          <h1>Upload Music</h1>
          <p>Share your latest tracks with the world.</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Song Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Midnight Flow"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Artist/Album Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Optional name tag"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Audio File (.mp3, .wav)</label>
            <div 
              className={`file-input-wrapper ${previews.music ? "has-preview" : ""}`}
              onClick={() => !previews.music && musicInputRef.current.click()}
            >
              {previews.music ? (
                <div className="preview-container">
                  <p className="file-selected">{files.music?.name}</p>
                  <audio controls src={previews.music} className="audio-preview" />
                  <button type="button" className="btn-change-file" onClick={() => musicInputRef.current.click()}>
                    Change Audio
                  </button>
                </div>
              ) : (
                <p>Click here to choose audio file</p>
              )}
              <input
                type="file"
                name="music"
                accept="audio/*"
                onChange={handleFileChange}
                ref={musicInputRef}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image (.jpg, .png)</label>
            <div 
              className={`file-input-wrapper ${previews.coverImage ? "has-preview" : ""}`}
              onClick={() => !previews.coverImage && coverInputRef.current.click()}
            >
              {previews.coverImage ? (
                <div className="preview-container">
                  <img src={previews.coverImage} alt="Cover preview" className="image-preview" />
                  <button type="button" className="btn-change-file" onClick={() => coverInputRef.current.click()}>
                    Change Image
                  </button>
                </div>
              ) : (
                <p>Click here to choose artwork</p>
              )}
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                ref={coverInputRef}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Upload Track
          </button>
        </form>
      </div>
    </div>
  );
}
