import React from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Register from "./pages/auth/Register";

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(
          "http://127.0.0.1:8000/api/logout/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <Link to="/" className="logo">
          Job<span>Sphere</span>
        </Link>


        {/* Navigation */}

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Find Jobs
          </Link>

          {token && (
            <>
              <Link to="/profile">
                Profile
              </Link>

              <Link to="/applications">
                Applications
              </Link>
            </>
          )}

        </div>


        {/* Authentication */}

        <div className="nav-buttons">

          {token ? (

            <button
              onClick={handleLogout}
              className="register-btn"
            >
              Logout
            </button>

          ) : (

            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>

          )}

        </div>

      </div>
    </nav>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

function Home() {
  return (
    <div className="app">

      <Navbar />


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            🚀 Find your dream career
          </p>

          <h1>
            Find the job that
            <span> fits your future.</span>
          </h1>

          <p className="hero-description">
            Discover thousands of job opportunities
            from top companies and take the next
            step in your career.
          </p>


          {/* SEARCH */}

          <div className="search-box">

            <input
              type="text"
              placeholder="Job title, skills or keywords"
            />

            <input
              type="text"
              placeholder="Location"
            />

            <Link
              to="/jobs"
              className="search-button"
            >
              Search Jobs
            </Link>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            🔎
          </div>

          <h3>
            Search Jobs
          </h3>

          <p>
            Find jobs according to your skills,
            experience and preferred location.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            💼
          </div>

          <h3>
            Apply Easily
          </h3>

          <p>
            Apply to your favorite jobs with
            just a few clicks.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            👤
          </div>

          <h3>
            Build Profile
          </h3>

          <p>
            Create your professional profile
            and upload your resume.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🏢
          </div>

          <h3>
            For Recruiters
          </h3>

          <p>
            Post jobs and find talented
            candidates easily.
          </p>

        </div>

      </section>


      {/* CTA */}

      <section className="cta">

        <h2>
          Ready to find your next opportunity?
        </h2>

        <p>
          Join JobSphere and start your
          career journey today.
        </p>

        <Link
          to="/register"
          className="cta-button"
        >
          Create Your Account
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div>
          © 2026 JobSphere. All rights reserved.
        </div>

        <div className="footer-links">

          <a href="#privacy">
            Privacy
          </a>

          <a href="#terms">
            Terms
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   LOGIN PAGE
========================================================= */

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [error, setError] = React.useState("");

  const [loading, setLoading] = React.useState(false);


  /* HANDLE INPUT */

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };


  /* LOGIN */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!formData.username.trim()) {

      setError(
        "Please enter your username."
      );

      return;
    }


    if (!formData.password) {

      setError(
        "Please enter your password."
      );

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
          }),
        }
      );


      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.detail ||
          "Invalid username or password."
        );

      }


      if (!data.token) {

        throw new Error(
          "Login successful, but token was not received."
        );

      }


      /* SAVE TOKEN */

      localStorage.setItem(
        "token",
        data.token
      );


      /* SAVE USER */

      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      }


      alert("Login successful!");

      navigate("/");

      window.location.reload();


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {

        setError(
          "Cannot connect to Django server. Make sure Django is running on http://127.0.0.1:8000/"
        );

      } else {

        setError(
          error.message ||
          "Login failed. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        {/* HEADER */}

        <div className="auth-header">

          <Link
            to="/"
            className="auth-logo"
          >
            Job<span>Sphere</span>
          </Link>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your JobSphere account
          </p>

        </div>


        {/* ERROR */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

          </div>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* REGISTER LINK */}

        <div className="auth-footer">

          <p>
            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   JOBS PAGE
========================================================= */

function Jobs() {

  const token = localStorage.getItem("token");

  return (

    <div>

      <Navbar />


      {/* JOB HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            💼 JobSphere Jobs
          </p>

          <h1>
            Find your
            <span> perfect job.</span>
          </h1>

          <p className="hero-description">
            Search and discover opportunities
            from leading companies.
          </p>


          <div className="search-box">

            <input
              type="text"
              placeholder="Job title or skills"
            />

            <input
              type="text"
              placeholder="Location"
            />

            <button>
              Search
            </button>

          </div>

        </div>

      </section>


      {/* JOB CARDS */}

      <section className="features">

        <JobCard
          icon="💻"
          title="Software Developer"
          company="ABC Technologies"
          location="Pune"
          type="Full Time"
          salary="₹4 LPA - ₹7 LPA"
          token={token}
        />


        <JobCard
          icon="⚛️"
          title="React Developer"
          company="Tech Solutions"
          location="Mumbai"
          type="Full Time"
          salary="₹5 LPA - ₹8 LPA"
          token={token}
        />


        <JobCard
          icon="🐍"
          title="Python Developer"
          company="Software Labs"
          location="Bangalore"
          type="Full Time"
          salary="₹4 LPA - ₹9 LPA"
          token={token}
        />


        <JobCard
          icon="☕"
          title="Java Developer"
          company="IT Solutions Pvt Ltd"
          location="Pune"
          type="Full Time"
          salary="₹5 LPA - ₹10 LPA"
          token={token}
        />

      </section>

    </div>
  );
}


/* =========================================================
   JOB CARD
========================================================= */

function JobCard({
  icon,
  title,
  company,
  location,
  type,
  salary,
  token,
}) {

  return (

    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        <strong>
          {company}
        </strong>
      </p>

      <p>
        📍 {location}
      </p>

      <p>
        💼 {type}
      </p>

      <p>
        💰 {salary}
      </p>


      {token ? (

        <button
          className="auth-submit"
        >
          Apply Now
        </button>

      ) : (

        <Link
          to="/login"
          className="auth-submit"
          style={{
            display: "block",
            textAlign: "center",
          }}
        >
          Login to Apply
        </Link>

      )}

    </div>
  );
}


/* =========================================================
   PROFILE PAGE
========================================================= */

function Profile() {

  const token = localStorage.getItem("token");


  const [profile, setProfile] = React.useState({

    username: "",
    email: "",
    role: "",

    phone: "",
    location: "",
    headline: "",
    about: "",
    skills: "",
    education: "",
    experience: "",
    linkedin: "",
    github: "",

    profile_image: null,
    resume: null,

  });


  const [profileImage, setProfileImage] =
    React.useState(null);

  const [resumeFile, setResumeFile] =
    React.useState(null);


  const [loading, setLoading] =
    React.useState(true);

  const [saving, setSaving] =
    React.useState(false);


  const [message, setMessage] =
    React.useState("");

  const [error, setError] =
    React.useState("");


  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  React.useEffect(() => {

    if (!token) {

      setLoading(false);

      return;

    }


    const loadProfile = async () => {

      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/profile/",
          {
            method: "GET",

            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );


        let data = {};

        try {

          data = await response.json();

        } catch {

          data = {};

        }


        if (!response.ok) {

          throw new Error(
            data.error ||
            data.detail ||
            "Failed to load profile."
          );

        }


        setProfile({

          username:
            data.username || "",

          email:
            data.email || "",

          role:
            data.role || "candidate",

          phone:
            data.phone || "",

          location:
            data.location || "",

          headline:
            data.headline || "",

          about:
            data.about || "",

          skills:
            data.skills || "",

          education:
            data.education || "",

          experience:
            data.experience || "",

          linkedin:
            data.linkedin || "",

          github:
            data.github || "",

          profile_image:
            data.profile_image || null,

          resume:
            data.resume || null,

        });

      } catch (error) {

        console.error(
          "Profile error:",
          error
        );

        setError(
          error.message ||
          "Unable to load profile."
        );

      } finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, [token]);


  /* =====================================================
     HANDLE TEXT INPUT
  ===================================================== */

  const handleChange = (event) => {

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.value,
    });

    setMessage("");
    setError("");

  };


  /* =====================================================
     PROFILE IMAGE
  ===================================================== */

  const handleProfileImage = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    setProfileImage(file);

    setMessage("");
    setError("");

  };


  /* =====================================================
     RESUME
  ===================================================== */

  const handleResume = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    setResumeFile(file);

    setMessage("");
    setError("");

  };


  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSubmit = async (event) => {

    event.preventDefault();

    setSaving(true);

    setMessage("");
    setError("");


    try {

      const formData =
        new FormData();


      formData.append(
        "phone",
        profile.phone
      );

      formData.append(
        "location",
        profile.location
      );

      formData.append(
        "headline",
        profile.headline
      );

      formData.append(
        "about",
        profile.about
      );

      formData.append(
        "skills",
        profile.skills
      );

      formData.append(
        "education",
        profile.education
      );

      formData.append(
        "experience",
        profile.experience
      );

      formData.append(
        "linkedin",
        profile.linkedin
      );

      formData.append(
        "github",
        profile.github
      );


      if (profileImage) {

        formData.append(
          "profile_image",
          profileImage
        );

      }


      if (resumeFile) {

        formData.append(
          "resume",
          resumeFile
        );

      }


      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/",
        {
          method: "PUT",

          headers: {
            Authorization:
              `Token ${token}`,
          },

          body: formData,
        }
      );


      let data = {};

      try {

        data = await response.json();

      } catch {

        data = {};

      }


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.detail ||
          "Profile update failed."
        );

      }


      setMessage(
        "Profile updated successfully!"
      );


      /* Reload profile */

      const updatedResponse =
        await fetch(
          "http://127.0.0.1:8000/api/profile/",
          {
            headers: {
              Authorization:
                `Token ${token}`,
            },
          }
        );


      if (updatedResponse.ok) {

        const updatedData =
          await updatedResponse.json();


        setProfile({

          username:
            updatedData.username || "",

          email:
            updatedData.email || "",

          role:
            updatedData.role || "candidate",

          phone:
            updatedData.phone || "",

          location:
            updatedData.location || "",

          headline:
            updatedData.headline || "",

          about:
            updatedData.about || "",

          skills:
            updatedData.skills || "",

          education:
            updatedData.education || "",

          experience:
            updatedData.experience || "",

          linkedin:
            updatedData.linkedin || "",

          github:
            updatedData.github || "",

          profile_image:
            updatedData.profile_image || null,

          resume:
            updatedData.resume || null,

        });

      }


      setProfileImage(null);
      setResumeFile(null);


    } catch (error) {

      console.error(
        "Profile save error:",
        error
      );

      setError(
        error.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     LOGIN REQUIRED
  ===================================================== */

  if (!token) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-header">

            <div className="feature-icon">
              🔐
            </div>

            <h1>
              Login Required
            </h1>

            <p>
              Please login to manage your profile.
            </p>

          </div>


          <Link
            to="/login"
            className="auth-submit"
            style={{
              display: "block",
              textAlign: "center",
            }}
          >
            Login
          </Link>

        </div>

      </div>

    );

  }


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-header">

            <h1>
              Loading Profile...
            </h1>

            <p>
              Please wait.
            </p>

          </div>

        </div>

      </div>

    );

  }


  /* =====================================================
     PROFILE UI
  ===================================================== */

  return (

    <div>

      <Navbar />


      <div className="auth-page">

        <div
          className="auth-card"
          style={{
            maxWidth: "700px",
          }}
        >

          {/* HEADER */}

          <div className="auth-header">

            <div className="feature-icon">
              👤
            </div>

            <h1>
              My Profile
            </h1>

            <p>
              Build your professional
              JobSphere profile.
            </p>

          </div>


          {/* SUCCESS */}

          {message && (

            <div className="success-message">
              {message}
            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          <form onSubmit={handleSubmit}>


            {/* PROFILE PHOTO */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >

              {profile.profile_image ? (

                <img
                  src={profile.profile_image}
                  alt="Profile"
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border:
                      "4px solid #2563eb",
                    marginBottom: "15px",
                  }}
                />

              ) : (

                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "45px",
                    margin:
                      "0 auto 15px",
                  }}
                >
                  👤
                </div>

              )}


              <label
                htmlFor="profileImage"
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Change Profile Photo
              </label>


              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImage}
                style={{
                  display: "none",
                }}
              />

            </div>


            {/* USERNAME */}

            <div className="form-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={profile.username}
                disabled
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

            </div>


            {/* ACCOUNT TYPE */}

            <div className="form-group">

              <label>
                Account Type
              </label>

              <input
                type="text"
                value={
                  profile.role === "recruiter"
                    ? "Recruiter"
                    : "Candidate"
                }
                disabled
              />

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={profile.phone}
                onChange={handleChange}
              />

            </div>


            {/* LOCATION */}

            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Pune, Maharashtra"
                value={profile.location}
                onChange={handleChange}
              />

            </div>


            {/* HEADLINE */}

            <div className="form-group">

              <label>
                Professional Headline
              </label>

              <input
                type="text"
                name="headline"
                placeholder="Java Full Stack Developer"
                value={profile.headline}
                onChange={handleChange}
              />

            </div>


            {/* ABOUT */}

            <div className="form-group">

              <label>
                About Me
              </label>

              <textarea
                name="about"
                placeholder="Tell recruiters about yourself..."
                value={profile.about}
                onChange={handleChange}
                rows="5"
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                  resize: "vertical",
                  fontFamily:
                    "inherit",
                  fontSize: "15px",
                }}
              />

            </div>


            {/* SKILLS */}

            <div className="form-group">

              <label>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                placeholder="Java, React, Python, SQL, Django"
                value={profile.skills}
                onChange={handleChange}
              />

              <small
                style={{
                  color: "#64748b",
                }}
              >
                Separate skills using commas.
              </small>

            </div>


            {/* EDUCATION */}

            <div className="form-group">

              <label>
                Education
              </label>

              <input
                type="text"
                name="education"
                placeholder="BE Computer Engineering"
                value={profile.education}
                onChange={handleChange}
              />

            </div>


            {/* EXPERIENCE */}

            <div className="form-group">

              <label>
                Experience
              </label>

              <input
                type="text"
                name="experience"
                placeholder="Fresher / 1 Year / 2 Years"
                value={profile.experience}
                onChange={handleChange}
              />

            </div>


            {/* LINKEDIN */}

            <div className="form-group">

              <label>
                LinkedIn Profile
              </label>

              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={profile.linkedin}
                onChange={handleChange}
              />

            </div>


            {/* GITHUB */}

            <div className="form-group">

              <label>
                GitHub Profile
              </label>

              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                value={profile.github}
                onChange={handleChange}
              />

            </div>


            {/* RESUME */}

            <div className="form-group">

              <label>
                Resume
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResume}
              />


              {profile.resume && (

                <div
                  style={{
                    marginTop: "10px",
                  }}
                >

                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#2563eb",
                      fontWeight: "600",
                    }}
                  >
                    📄 View Current Resume
                  </a>

                </div>

              )}

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="auth-submit"
              disabled={saving}
            >

              {saving
                ? "Saving Profile..."
                : "Save Profile"
              }

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   APPLICATIONS PAGE
========================================================= */

function Applications() {

  const token = localStorage.getItem("token");

  if (!token) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-header">

            <h1>
              Login Required
            </h1>

            <p>
              Please login to view your applications.
            </p>

          </div>


          <Link
            to="/login"
            className="auth-submit"
            style={{
              display: "block",
              textAlign: "center",
            }}
          >
            Login
          </Link>

        </div>

      </div>

    );

  }


  return (

    <div>

      <Navbar />


      <div className="auth-page">

        <div
          className="auth-card"
          style={{
            maxWidth: "700px",
          }}
        >

          <div className="auth-header">

            <h1>
              My Applications
            </h1>

            <p>
              Track your job applications.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              💼
            </div>

            <h3>
              No applications yet
            </h3>

            <p>
              Start applying for jobs to see
              your applications here.
            </p>


            <Link
              to="/jobs"
              className="auth-submit"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "15px",
              }}
            >
              Find Jobs
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   APP ROUTES
========================================================= */

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />


      <Route
        path="/login"
        element={<Login />}
      />


      <Route
        path="/register"
        element={<Register />}
      />


      <Route
        path="/jobs"
        element={<Jobs />}
      />


      <Route
        path="/profile"
        element={<Profile />}
      />


      <Route
        path="/applications"
        element={<Applications />}
      />


      {/* FALLBACK */}

      <Route
        path="*"
        element={<Home />}
      />

    </Routes>
  );
}


export default App;