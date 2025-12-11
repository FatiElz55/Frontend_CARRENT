import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";
import OwnerPage from "./OwnerPage.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalogue from "./pages/Catalogue";
import ReservationPage from "./pages/ReservationPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookings from "./pages/MyBookings";
import CarDetailsPage from "./pages/CarDetailsPage";

// Protected Route Component
function ProtectedRoute({ children, requireRole }) {
  const currentUser = localStorage.getItem("carrent_current_user");
  
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const user = JSON.parse(currentUser);
    if (requireRole && user.role !== requireRole && user.role !== requireRole.toUpperCase()) {
      // User doesn't have the required role, redirect to signin
      localStorage.removeItem("carrent_current_user");
      return <Navigate to="/signin" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem("carrent_current_user");
    return <Navigate to="/signin" replace />;
  }
}

// Sign In Page Component with redirect
function SignInPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("carrent_current_user");
  
  console.log("SignInPage rendering, currentUser:", currentUser); // Debug log
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.role === "client" || user.role === "CLIENT") {
          navigate("/catalogue", { replace: true });
        } else if (user.role === "owner" || user.role === "OWNER") {
          navigate("/owner", { replace: true });
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        // Invalid user data, continue to sign in
      }
    }
  }, [currentUser, navigate]);

  const handleSignedIn = (data) => {
    localStorage.setItem("carrent_current_user", JSON.stringify(data));
      // Redirect based on role
    if (data.role === "client" || data.role === "CLIENT") {
        navigate("/catalogue");
    } else if (data.role === "owner" || data.role === "OWNER") {
        navigate("/owner");
      }
  };

  return (
    <SignIn 
      onSignedIn={handleSignedIn}
      onGoToSignUp={() => navigate("/signup")}
    />
  );
}

// Sign Up Page Component with redirect
function SignUpPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("carrent_current_user");
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.role === "client" || user.role === "CLIENT") {
          navigate("/catalogue", { replace: true });
        } else if (user.role === "owner" || user.role === "OWNER") {
          navigate("/owner", { replace: true });
    }
      } catch (err) {
        // Invalid user data, continue to sign up
      }
    }
  }, [currentUser, navigate]);

  const handleSignedUp = (data) => {
    localStorage.setItem("carrent_current_user", JSON.stringify(data));
    // Redirect based on role
    if (data.role === "client" || data.role === "CLIENT") {
      navigate("/catalogue");
    } else if (data.role === "owner" || data.role === "OWNER") {
      navigate("/owner");
    } else {
      navigate("/signin");
    }
  };

    return (
      <SignUp
        onSignedUp={handleSignedUp}
      onGoToSignIn={() => navigate("/signin")}
      />
    );
  }

// Client Layout Component (with Navbar and Footer)
function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-6 md:pt-6 min-h-screen dark:!bg-[#1a0f24] bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300">
        {children}
      </div>
      <Footer />
    </>
  );
}

// Owner Layout Component (with Navbar and Footer, no top padding for banner)
function OwnerLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen dark:!bg-[#1a0f24] bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300" style={{ padding: 0, margin: 0 }}>
        {children}
      </div>
      <Footer />
    </>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Something went wrong</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Reload Page
            </button>
            <pre style={{ marginTop: '24px', padding: '16px', background: '#1f2937', color: '#f3f4f6', borderRadius: '8px', overflow: 'auto', textAlign: 'left' }}>
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Auth Routes - These should be accessible without authentication */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Root route - ALWAYS redirect to signin first */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Client Routes (protected) */}
        <Route
          path="/catalogue"
          element={
            <ProtectedRoute requireRole="client">
              <ClientLayout>
                <Catalogue />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservation/:carId"
          element={
            <ProtectedRoute requireRole="client">
              <ClientLayout>
                <ReservationPage />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireRole="client">
              <ClientLayout>
                <ProfilePage />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute requireRole="client">
              <ClientLayout>
                <MyBookings />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/car/:carId"
          element={
            <ProtectedRoute requireRole="client">
              <ClientLayout>
                <CarDetailsPage />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        {/* Owner Route */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute requireRole="owner">
              <OwnerLayout>
                <OwnerPage userData={(() => {
                  try {
                    const user = localStorage.getItem("carrent_current_user");
                    return user ? JSON.parse(user) : null;
                  } catch {
                    return null;
                  }
                })()} 
                onSignOut={() => {
                  localStorage.removeItem("carrent_current_user");
                  window.location.href = "/signin";
                }}
                />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />

        {/* Logout Route */}
        <Route
          path="/logout"
          element={
            <Navigate
              to="/signin"
              replace
              state={{ logout: true }}
    />
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
