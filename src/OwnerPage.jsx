import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import "../SignIn.css";
import logo from "./assets/logo.png";
import { FaArrowLeft } from "react-icons/fa";
import Catalogue from "./pages/Catalogue";
import MyBookings from "./pages/MyBookings";
import ReservationPage from "./pages/ReservationPage";
import OwnerCarCard from "./components/owner/OwnerCarCard";
import AddCarModal from "./components/owner/AddCarModal";

function OwnerPage({ userData, onSignOut, onSwitchToClient, onUpdateUserData }) {
  const [activeTab, setActiveTab] = useState("home");
  const [clientMode, setClientMode] = useState(() => {
    // Check if client mode is stored in localStorage
    const stored = localStorage.getItem(`carrent_client_mode_${userData?.id}`);
    return stored === "true";
  });
  const [ownerCars, setOwnerCars] = useState([]);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarForReservation, setSelectedCarForReservation] = useState(null);
  const fileInputRef = useRef(null);

  // Load owner's cars from localStorage
  useEffect(() => {
    if (userData?.id) {
      const cars = JSON.parse(localStorage.getItem(`carrent_owner_cars_${userData.id}`) || "[]");
      setOwnerCars(cars);
    }
  }, [userData?.id]);

  // Listen for navbar tab changes and sync with localStorage
  useEffect(() => {
    const handleTabChange = (event) => {
      const newTab = event.detail;
      setActiveTab(newTab);
      if (userData?.id) {
        localStorage.setItem(`carrent_owner_active_tab_${userData.id}`, newTab);
      }
    };
    // Load active tab from localStorage on mount
    if (userData?.id) {
      const storedTab = localStorage.getItem(`carrent_owner_active_tab_${userData.id}`);
      if (storedTab && (storedTab === "home" || storedTab === "demands" || storedTab === "contact" || storedTab === "profile" || storedTab === "bookings" || storedTab === "reservation")) {
        setActiveTab(storedTab);
        // If reservation tab but no car selected, go back to home
        if (storedTab === "reservation" && !selectedCarForReservation) {
          setActiveTab("home");
        }
      }
    }
    window.addEventListener("owner-tab-change", handleTabChange);
    return () => window.removeEventListener("owner-tab-change", handleTabChange);
  }, [userData?.id]);

  // Save cars to localStorage
  const saveCars = (cars) => {
    if (userData?.id) {
      localStorage.setItem(`carrent_owner_cars_${userData.id}`, JSON.stringify(cars));
      setOwnerCars(cars);
    }
  };

  // Handle add/edit car
  const handleSaveCar = (carData) => {
    const cars = [...ownerCars];
    const existingIndex = cars.findIndex(c => c.id === carData.id);
    
    if (existingIndex >= 0) {
      cars[existingIndex] = carData;
    } else {
      cars.push(carData);
    }
    
    saveCars(cars);
    setCarToEdit(null);
  };

  // Handle delete car
  const handleDeleteCar = (carId) => {
    const cars = ownerCars.filter(c => c.id !== carId);
    saveCars(cars);
  };

  // Handle edit car
  const handleEditCar = (car) => {
    setCarToEdit(car);
    setShowAddCarModal(true);
  };

  // Filter cars by search query
  const filteredCars = ownerCars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initials for avatar
  const getInitials = () => {
    if (userData?.name) {
      const names = userData.name.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return userData.name.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedUserData = {
        ...userData,
        profilePicture: base64String
      };

      // Update localStorage
      localStorage.setItem("carrent_current_user", JSON.stringify(updatedUserData));
      
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
      const userIndex = users.findIndex(u => u.id === userData.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], profilePicture: base64String };
        localStorage.setItem("carrent_users", JSON.stringify(users));
      }

      // Notify parent component
      if (onUpdateUserData) {
        onUpdateUserData(updatedUserData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const renderHomeView = () => (
    <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Add New Car Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setCarToEdit(null);
              setShowAddCarModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Car
          </button>
        </div>

        {/* Search Bar */}
        {ownerCars.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, brand, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <OwnerCarCard
                    car={car}
                    onDelete={handleDeleteCar}
                    onEdit={handleEditCar}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
              {searchQuery ? "No cars found" : "No cars published yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Try modifying your search criteria"
                : "Start by adding your first car to the platform"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderDemandsView = () => (
    <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No demands yet</p>
        </div>
      </div>
    </div>
  );

  // Contact view component with scroll effect
  const ContactView = () => {
    useEffect(() => {
      const footer = document.getElementById("contact");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);

    return (
      <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scroll down to see the contact form
          </p>
        </div>
      </div>
    );
  };

  const renderAccountView = () => (
    <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Account</h2>
        <p className="text-gray-600 dark:text-white/70">
          Manage your account settings and profile.
        </p>
      </div>
      
      {userData && (
        <>
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={handleChangePictureClick}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 dark:bg-purple-600 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-purple-700 transition-colors"
                title="Change photo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={handleChangePictureClick}
              className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-purple-300 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              {userData.profilePicture ? "Change Picture" : "Add Picture"}
            </button>
          </div>

          {/* Account Information */}
          <div className="space-y-6 mb-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Name</label>
                <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">
                  {userData.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email</label>
                <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">
                  {userData.email}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Role</label>
              <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">
                Car Owner
              </p>
            </div>
          </div>
        </>
      )}
      
      {onSignOut && (
        <button
          type="button"
          onClick={onSignOut}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Sign Out
        </button>
      )}
    </div>
  );

  return (
    <div className={`owner-page ${clientMode && (activeTab === "home" || activeTab === "bookings" || activeTab === "reservation") ? "owner-page-client-mode" : ""}`}>
      {/* Client Mode Switch Banner */}
      {(activeTab === "home" || activeTab === "demands" || activeTab === "bookings" || activeTab === "reservation") && (
        <div className="client-mode-banner">
          <span className="client-mode-text">Wanna rent a car? switch to client mode</span>
          <label className="client-mode-toggle">
            <input
              type="checkbox"
              checked={clientMode}
              onChange={(e) => {
                const isClientMode = e.target.checked;
                setClientMode(isClientMode);
                // Store client mode preference in localStorage
                if (userData?.id) {
                  localStorage.setItem(`carrent_client_mode_${userData.id}`, isClientMode.toString());
                }
                
                // Switch tabs when toggling client mode
                if (isClientMode && activeTab === "demands") {
                  // Switching to client mode from demands -> switch to bookings
                  setActiveTab("bookings");
                  if (userData?.id) {
                    localStorage.setItem(`carrent_owner_active_tab_${userData.id}`, "bookings");
                  }
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "bookings" }));
                  }, 100);
                } else if (!isClientMode && activeTab === "bookings") {
                  // Switching to owner mode from bookings -> switch to demands
                  setActiveTab("demands");
                  if (userData?.id) {
                    localStorage.setItem(`carrent_owner_active_tab_${userData.id}`, "demands");
                  }
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "demands" }));
                  }, 100);
                }
                
                // Notify parent if needed (but don't switch pages - owner stays on owner page)
                if (onSwitchToClient) {
                  onSwitchToClient(isClientMode);
                }
              }}
            />
            <span className="client-mode-slider"></span>
          </label>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === "home" ? (
        clientMode ? (
          <div className="owner-catalogue-wrapper">
            <Catalogue 
              isEmbedded={true} 
              onCarSelect={(car) => {
                setSelectedCarForReservation(car);
                setActiveTab("reservation");
                if (userData?.id) {
                  localStorage.setItem(`carrent_owner_active_tab_${userData.id}`, "reservation");
                }
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "reservation" }));
                }, 100);
              }}
            />
          </div>
        ) : (
          renderHomeView()
        )
      ) : activeTab === "reservation" && selectedCarForReservation ? (
        clientMode ? (
          <div className="owner-catalogue-wrapper">
            <ReservationPage isEmbedded={true} carId={selectedCarForReservation.id} />
          </div>
        ) : (
          renderHomeView()
        )
      ) : activeTab === "bookings" ? (
        clientMode ? (
          <div className="owner-catalogue-wrapper">
            <MyBookings isEmbedded={true} />
          </div>
        ) : (
          renderHomeView()
        )
      ) : activeTab === "demands" ? (
        renderDemandsView()
      ) : activeTab === "contact" ? (
        <ContactView />
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderAccountView()}
        </div>
      )}

      {/* Add/Edit Car Modal */}
      <AddCarModal
        isOpen={showAddCarModal}
        onClose={() => {
          setShowAddCarModal(false);
          setCarToEdit(null);
        }}
        onSave={handleSaveCar}
        carToEdit={carToEdit}
        ownerName={userData?.name || "Owner"}
      />
    </div>
  );
}

export default OwnerPage;

