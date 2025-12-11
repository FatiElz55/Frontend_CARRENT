import React, { useState, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "./assets/logo.png";
import { FaCar, FaHandHoldingUsd, FaArrowLeft, FaUpload, FaChevronDown } from "react-icons/fa";

// Common country codes for phone numbers with flags
const countryCodes = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
];

/**
 * Sign-up page with the same white + purple style as SignIn.
 * Adjust the URL/body to match your Spring Boot registration endpoint.
 */
function SignUp({ onSignedUp, onGoToSignIn }) {
  const [step, setStep] = useState(1); // 1: Basic info, 2: Additional info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [identity, setIdentity] = useState("client"); // "client" | "owner"
  const [showPassword, setShowPassword] = useState(false);
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

  // Additional info for clients
  const [profilePicture, setProfilePicture] = useState(null);
  const [drivingCard, setDrivingCard] = useState(null);
  const [nationalCard, setNationalCard] = useState(null);
  const [address, setAddress] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Additional info for owners
  const [ownerProfilePicture, setOwnerProfilePicture] = useState(null);
  const [ownerDrivingCard, setOwnerDrivingCard] = useState(null);
  const [ownerNationalCard, setOwnerNationalCard] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerCountryCode, setOwnerCountryCode] = useState("+1");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [isCompany, setIsCompany] = useState(null); // null, true (company), false (single car processor)

  const drivingCardRef = useRef(null);
  const nationalCardRef = useRef(null);
  const ownerDrivingCardRef = useRef(null);
  const ownerNationalCardRef = useRef(null);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const clientDropdownRef = useRef(null);
  const ownerDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setClientDropdownOpen(false);
      }
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) {
        setOwnerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get selected country info
  const getSelectedCountry = (code) => {
    return countryCodes.find(item => item.code === code) || countryCodes[0];
  };

  // Handle file upload
  const handleFileUpload = (file, setter) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image or PDF file');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Clear any previous errors
    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Basic info submission
  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword || !identity) {
      setError("Please fill in all fields and choose how you will use CarRent.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
    const existingUser = users.find((u) => u.email === email.toLowerCase());

    if (existingUser) {
      setError("An account with this email already exists.");
      return;
    }

    // Move to step 2
    setStep(2);
  };

  // Step 2: Additional info submission
  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (identity === "client") {
      // Validate client fields
      if (!profilePicture || !drivingCard || !nationalCard || !address || !phoneNumber) {
        setError("Please fill in all required fields and upload all documents including profile picture.");
        return;
      }
    } else {
      // Validate owner fields
      if (!ownerProfilePicture || !ownerDrivingCard || !ownerNationalCard || !ownerAddress || !ownerPhoneNumber || isCompany === null) {
        setError("Please fill in all required fields, upload all documents including profile picture, and select your business type.");
        return;
      }
    }

    try {
      setLoading(true);

      // Check if user already exists (double check)
      const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
      const existingUser = users.find((u) => u.email === email.toLowerCase());

      if (existingUser) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      // Create new user object with all information
      const additionalInfo = identity === "client" ? {
        profilePicture,
        drivingCard,
        nationalCard,
        address,
        phone: `${countryCode} ${phoneNumber}`,
      } : {
        profilePicture: ownerProfilePicture,
        drivingCard: ownerDrivingCard,
        nationalCard: ownerNationalCard,
        address: ownerAddress,
        phone: `${ownerCountryCode} ${ownerPhoneNumber}`,
        isCompany,
      };

      const newUser = {
        id: Date.now().toString(),
        name: fullName,
        email: email.toLowerCase(),
        password: password, // In production, this should be hashed
        role: identity,
        ...additionalInfo,
        createdAt: new Date().toISOString(),
        bookings: [], // Initialize empty bookings array for new users
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem("carrent_users", JSON.stringify(users));
      
      // Initialize empty bookings for this user in localStorage
      localStorage.setItem(`carrent_bookings_${newUser.id}`, JSON.stringify([]));

      // Store current session
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      localStorage.setItem("carrent_current_user", JSON.stringify(userData));

      if (onSignedUp) {
        onSignedUp(userData);
      }
    } catch (err) {
      setError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render step 1: Basic information
  const renderStep1 = () => (
    <>
      <div className="signin-header">
        <h2 className="signin-title signup-title-purple">Create account</h2>
        <p className="signin-subtitle">
          Sign up to manage your rentals and save your favourite cars.
        </p>
      </div>

      {error && <div className="signin-error">{error}</div>}

      <form className="signin-form" onSubmit={handleBasicInfoSubmit}>
          <div className="signin-field">
            <label className="signin-label" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              className="signin-input"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <label className="signin-label" htmlFor="signup-password">
              Password
            </label>
            <div className="signin-password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className="signin-password-input"
                placeholder="Create a password"
                value={password}
                autoComplete="new-password"
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

          <div className="signin-field">
            <label className="signin-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="signin-input"
              placeholder="Repeat your password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="signin-field">
            <span className="signin-label">How will you use CarRent?</span>
            <div className="identity-row">
              <label className={`identity-pill ${identity === "client" ? "identity-pill--active" : ""}`}>
                <input
                  type="radio"
                  name="identity"
                  value="client"
                  checked={identity === "client"}
                  onChange={(e) => setIdentity(e.target.value)}
                />
                <FaCar className="identity-icon" />
                Rent a Car
              </label>
              <label className={`identity-pill ${identity === "owner" ? "identity-pill--active" : ""}`}>
                <input
                  type="radio"
                  name="identity"
                  value="owner"
                  checked={identity === "owner"}
                  onChange={(e) => setIdentity(e.target.value)}
                />
                <FaHandHoldingUsd className="identity-icon" />
                Rent Out My Car
              </label>
            </div>
          </div>

        <button
          type="submit"
          className="signin-button"
          disabled={loading}
        >
          Continue
        </button>
      </form>

      <div className="signin-footer">
        Already have an account?{" "}
        <button
          type="button"
          className="signin-link"
          onClick={onGoToSignIn}
        >
          Sign in
        </button>
      </div>
    </>
  );

  // Render step 2: Additional information for clients
  const renderClientStep2 = () => (
    <>
      <div className="signin-header">
        <button
          type="button"
          className="back-button-inline"
          onClick={() => setStep(1)}
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="signin-title signup-title-purple">Additional Information</h2>
        <p className="signin-subtitle">
          Please provide your documents and contact details to complete your registration.
        </p>
      </div>

      {error && <div className="signin-error">{error}</div>}

      <form className="signin-form" onSubmit={handleAdditionalInfoSubmit}>
        <div className="signin-field">
          <label className="signin-label">Profile Picture *</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0], setProfilePicture)}
              style={{ display: "none" }}
              id="profile-picture-input"
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => document.getElementById("profile-picture-input")?.click()}
            >
              <FaUpload /> {profilePicture ? "Change Profile Picture" : "Upload Profile Picture"}
            </button>
            {profilePicture && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">Driving Card *</label>
          <div className="file-upload-wrapper">
            <input
              ref={drivingCardRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], setDrivingCard)}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => drivingCardRef.current?.click()}
            >
              <FaUpload /> {drivingCard ? "Change Driving Card" : "Upload Driving Card"}
            </button>
            {drivingCard && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">National Card *</label>
          <div className="file-upload-wrapper">
            <input
              ref={nationalCardRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], setNationalCard)}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => nationalCardRef.current?.click()}
            >
              <FaUpload /> {nationalCard ? "Change National Card" : "Upload National Card"}
            </button>
            {nationalCard && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label" htmlFor="address">
            Address *
          </label>
          <input
            id="address"
            type="text"
            className="signin-input"
            placeholder="Street, City, State, ZIP Code"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="signin-field">
          <label className="signin-label" htmlFor="phone">
            Phone Number *
          </label>
          <div className="phone-input-wrapper">
            <div className="country-code-dropdown" ref={clientDropdownRef}>
              <button
                type="button"
                className="country-code-select-button"
                onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
              >
                <span className="country-code-display">
                  <span className="country-flag">{getSelectedCountry(countryCode).flag}</span>
                  <span className="country-code-text">{getSelectedCountry(countryCode).code}</span>
                </span>
                <FaChevronDown className={`dropdown-arrow ${clientDropdownOpen ? 'open' : ''}`} />
              </button>
              {clientDropdownOpen && (
                <div className="country-code-dropdown-menu">
                  {countryCodes.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`country-code-option ${countryCode === item.code ? 'selected' : ''}`}
                      onClick={() => {
                        setCountryCode(item.code);
                        setClientDropdownOpen(false);
                      }}
                    >
                      <span className="country-flag">{item.flag}</span>
                      <span className="country-code-text">{item.code}</span>
                      <span className="country-name">{item.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id="phone"
              type="tel"
              className="signin-input phone-input"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="signin-button"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Complete Sign Up"}
        </button>
      </form>
    </>
  );

  // Render step 2: Additional information for owners
  const renderOwnerStep2 = () => (
    <>
      <div className="signin-header">
        <button
          type="button"
          className="back-button-inline"
          onClick={() => setStep(1)}
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="signin-title signup-title-purple">Additional Information</h2>
        <p className="signin-subtitle">
          Please provide your documents and business details to complete your registration.
        </p>
      </div>

      {error && <div className="signin-error">{error}</div>}

      <form className="signin-form" onSubmit={handleAdditionalInfoSubmit}>
        <div className="signin-field">
          <label className="signin-label">Profile Picture *</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0], setOwnerProfilePicture)}
              style={{ display: "none" }}
              id="owner-profile-picture-input"
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => document.getElementById("owner-profile-picture-input")?.click()}
            >
              <FaUpload /> {ownerProfilePicture ? "Change Profile Picture" : "Upload Profile Picture"}
            </button>
            {ownerProfilePicture && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">Driving Card *</label>
          <div className="file-upload-wrapper">
            <input
              ref={ownerDrivingCardRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], setOwnerDrivingCard)}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => ownerDrivingCardRef.current?.click()}
            >
              <FaUpload /> {ownerDrivingCard ? "Change Driving Card" : "Upload Driving Card"}
            </button>
            {ownerDrivingCard && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label">National Card *</label>
          <div className="file-upload-wrapper">
            <input
              ref={ownerNationalCardRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], setOwnerNationalCard)}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-button"
              onClick={() => ownerNationalCardRef.current?.click()}
            >
              <FaUpload /> {ownerNationalCard ? "Change National Card" : "Upload National Card"}
            </button>
            {ownerNationalCard && (
              <span className="file-upload-success">✓ File uploaded</span>
            )}
          </div>
        </div>

        <div className="signin-field">
          <label className="signin-label" htmlFor="owner-address">
            Address *
          </label>
          <input
            id="owner-address"
            type="text"
            className="signin-input"
            placeholder="Street, City, State, ZIP Code"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
            required
          />
        </div>

        <div className="signin-field">
          <label className="signin-label" htmlFor="owner-phone">
            Phone Number *
          </label>
          <div className="phone-input-wrapper">
            <div className="country-code-dropdown" ref={ownerDropdownRef}>
              <button
                type="button"
                className="country-code-select-button"
                onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
              >
                <span className="country-code-display">
                  <span className="country-flag">{getSelectedCountry(ownerCountryCode).flag}</span>
                  <span className="country-code-text">{getSelectedCountry(ownerCountryCode).code}</span>
                </span>
                <FaChevronDown className={`dropdown-arrow ${ownerDropdownOpen ? 'open' : ''}`} />
              </button>
              {ownerDropdownOpen && (
                <div className="country-code-dropdown-menu">
                  {countryCodes.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`country-code-option ${ownerCountryCode === item.code ? 'selected' : ''}`}
                      onClick={() => {
                        setOwnerCountryCode(item.code);
                        setOwnerDropdownOpen(false);
                      }}
                    >
                      <span className="country-flag">{item.flag}</span>
                      <span className="country-code-text">{item.code}</span>
                      <span className="country-name">{item.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id="owner-phone"
              type="tel"
              className="signin-input phone-input"
              placeholder="1234567890"
              value={ownerPhoneNumber}
              onChange={(e) => setOwnerPhoneNumber(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>
        </div>

        <div className="signin-field">
          <span className="signin-label">Business Type *</span>
          <div className="identity-row">
            <label className={`identity-pill ${isCompany === true ? "identity-pill--active" : ""}`}>
              <input
                type="radio"
                name="businessType"
                value="company"
                checked={isCompany === true}
                onChange={() => setIsCompany(true)}
              />
              Company
            </label>
            <label className={`identity-pill ${isCompany === false ? "identity-pill--active" : ""}`}>
              <input
                type="radio"
                name="businessType"
                value="single"
                checked={isCompany === false}
                onChange={() => setIsCompany(false)}
              />
              Single Car Processor
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="signin-button"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Complete Sign Up"}
        </button>
      </form>
    </>
  );

  return (
    <div className="signin-page">
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
      
      <div className="app-brand">
        <img src={logo} alt="CarRent logo" className="app-logo" />
        <span className="app-brand-text">
          CAR<span>RENT</span>
        </span>
      </div>
      <div className="signin-card">
        {step === 1 && renderStep1()}
        {step === 2 && identity === "client" && renderClientStep2()}
        {step === 2 && identity === "owner" && renderOwnerStep2()}
      </div>
    </div>
  );
}

export default SignUp;


