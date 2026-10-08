import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );

      setMessage(response.data.message || "Registration successful!");

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "candidate",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "object") {
          const messages = Object.values(data).flat();
          setError(messages.join(" "));
        } else {
          setError("Registration failed.");
        }
      } else {
        setError(
          "Cannot connect to server. Make sure Django backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <Link to="/" className="auth-logo">
            Job<span>Sphere</span>
          </Link>

          <h1>Create your account</h1>

          <p>
            Join JobSphere and find your next opportunity.
          </p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}

          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          {/* Role */}

          <div className="form-group">

            <label>Account Type</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="candidate">
                Candidate
              </option>

              <option value="recruiter">
                Recruiter
              </option>

            </select>

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading ? "Creating Account..." : "Create Account"}

          </button>

        </form>


        <div className="auth-footer">

          <p>
            Already have an account?
            {" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;