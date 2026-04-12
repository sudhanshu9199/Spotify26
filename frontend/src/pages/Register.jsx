import { Link } from "react-router-dom";
import "./Register.scss";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();
  const [form, setform] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "user",
  });

  function handleChange(e) {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: form.role,
        fullname: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create an account</h1>
          <p>Join us to explore the world of music today.</p>
        </div>

        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div className="role-selector">
            <label
              className={`role-option ${form.role === "user" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              />
              User
            </label>
            <label
              className={`role-option ${form.role === "artist" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="role"
                value="artist"
                checked={form.role === "artist"}
                onChange={handleChange}
              />
              Artist
            </label>
          </div>

          <div className="name-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit" onClick={handleSubmit}>
            Sign up
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          onClick={() => {
            window.location.href = "http://localhost:3000/api/auth/google";
          }}
          type="button"
          className="btn-google"
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="login-prompt">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
