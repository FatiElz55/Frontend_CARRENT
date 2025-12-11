import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "./assets/logo.png";

/**
 * Sign-in page for the car rent website.
 *
 * This component calls a Spring Boot backend login endpoint.
 * Adjust the URL and response handling to match your backend.
 */
function SignIn({ onSignedIn, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  // Sync theme with document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // very simple email check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
      const user = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );

      if (!user) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Initialize bookings array if it doesn't exist for this user
      if (!user.bookings) {
        user.bookings = [];
        // Update user in users array
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = user;
          localStorage.setItem("carrent_users", JSON.stringify(users));
        }
      }
      
      // Initialize empty bookings in localStorage if not exists (for first sign in)
      const bookingsKey = `carrent_bookings_${user.id}`;
      if (!localStorage.getItem(bookingsKey)) {
        localStorage.setItem(bookingsKey, JSON.stringify([]));
      }

      // Store current session
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null,
      };
      localStorage.setItem("carrent_current_user", JSON.stringify(userData));

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("carrent_remember_me", "true");
      } else {
        localStorage.removeItem("carrent_remember_me");
      }

      if (onSignedIn) {
        onSignedIn(userData);
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log("SignIn component rendering"); // Debug log
  
  // Ensure we're on the sign-in page, not owner page
  React.useEffect(() => {
    if (window.location.pathname === '/owner') {
      window.location.href = '/signin';
    }
  }, []);

  return (
    <div className="signin-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 24px 40px', background: 'radial-gradient(circle at top left, rgba(129, 140, 248, 0.25), transparent 55%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.22), transparent 55%), #f5f3ff' }}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 bg-transparent border-0 rounded-lg transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-purple-800" />
        )}
      </button>
      
      <div className="app-brand" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4c1d95', zIndex: 10 }}>
        <img 
          src={logo} 
          alt="CarRent logo" 
          className="app-logo" 
          style={{ 
            width: '36px', 
            height: '36px', 
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
            visibility: 'visible',
            opacity: 1
          }} 
          onError={(e) => {
            console.error('Logo failed to load:', logo);
            e.target.style.display = 'none';
          }}
        />
        <span className="app-brand-text" style={{ color: '#4c1d95' }}>
          CAR<span style={{ color: '#7c3aed' }}>RENT</span>
        </span>
      </div>
      <div className="signin-card" style={{ maxWidth: '420px', width: '100%', marginTop: '72px', padding: '28px 24px 40px', borderRadius: '20px', background: '#ffffff', boxShadow: '0 20px 40px rgba(148, 163, 184, 0.35), 0 0 0 1px rgba(129, 140, 248, 0.2)', border: '1px solid rgba(226, 232, 240, 0.9)', color: '#111827' }}>
        <div className="signin-header">
          <h2 className="signin-title signup-title-purple">Sign in</h2>
          <p className="signin-subtitle">
            Access your bookings and find your next ride.
          </p>
        </div>

        {error && <div className="signin-error">{error}</div>}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="signin-field">
            <label className="signin-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="password">
              Password
            </label>
            <div className="signin-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="signin-password-input"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="signin-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="signin-row">
            <label className="signin-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              className="signin-link"
              onClick={() => {
                // Hook up to your "forgot password" route
                // e.g. navigate("/forgot-password");
                alert("Forgot password flow not implemented yet.");
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="signin-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="signin-footer">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="signin-link"
            onClick={onGoToSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;


