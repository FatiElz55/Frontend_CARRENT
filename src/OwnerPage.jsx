import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import "../SignIn.css";
import logo from "./assets/logo.png";
import { FaArrowLeft, FaCar } from "react-icons/fa";
import Catalogue from "./pages/Catalogue";
import MyBookings from "./pages/MyBookings";
import ReservationPage from "./pages/ReservationPage";
import OwnerCarCard from "./components/owner/OwnerCarCard";
import AddCarModal from "./components/owner/AddCarModal";

function OwnerPage({ userData: propUserData, onSignOut, onSwitchToClient, onUpdateUserData }) {
  // Load userData from localStorage if not provided as prop
  const [userData, setUserData] = useState(() => {
    if (propUserData) return propUserData;
    try {
      const stored = localStorage.getItem("carrent_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing userData from localStorage:", err);
      return null;
    }
  });

  // Sync with localStorage changes and prop updates
  useEffect(() => {
    if (propUserData) {
      setUserData(propUserData);
    } else {
      try {
        const stored = localStorage.getItem("carrent_current_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        }
      } catch (err) {
        console.error("Error parsing userData from localStorage:", err);
      }
    }
  }, [propUserData]);

  // Listen for storage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "carrent_current_user") {
        try {
          const stored = e.newValue;
          setUserData(stored ? JSON.parse(stored) : null);
        } catch (err) {
          console.error("Error parsing userData from storage event:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [activeTab, setActiveTab] = useState("home");
  const [clientMode, setClientMode] = useState(() => {
    // Check if client mode is stored in localStorage
    const stored = localStorage.getItem(`carrent_client_mode_${userData?.id}`);
    return stored === "true";
  });
  const [ownerCars, setOwnerCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarForReservation, setSelectedCarForReservation] = useState(null);
  const [demands, setDemands] = useState([]);
  const [loadingDemands, setLoadingDemands] = useState(false);
  const fileInputRef = useRef(null);

  // Load owner's cars from API
  useEffect(() => {
    const loadCars = async () => {
      // Ensure we have userData
      const currentUserData = userData || (() => {
        try {
          const stored = localStorage.getItem("carrent_current_user");
          return stored ? JSON.parse(stored) : null;
        } catch {
          return null;
        }
      })();

      if (currentUserData?.id) {
        setLoadingCars(true);
        try {
          const { carAPI } = await import('./services/api');
          const response = await carAPI.getCarsByOwner(currentUserData.id);
          // Map API response to frontend format
          const mappedCars = (response.data || []).map(car => ({
            id: car.id,
            name: car.name,
            brand: car.brand,
            pricePerDay: typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0,
            city: car.city,
            availability: car.availability,
            owner: car.ownerName || currentUserData.name,
            ownerId: car.ownerId,
            mainImage: car.mainImageUrl || '',
            images: car.imagesUrl || [],
            seats: car.seats,
            fuel: car.fuelType,
            gearbox: car.gearbox,
            latitude: car.latitude,
            longitude: car.longitude
          }));
          setOwnerCars(mappedCars);
          console.log('Loaded cars:', mappedCars.length);
        } catch (error) {
          console.error('Error loading cars:', error);
          // Show user-friendly error message
          const errorMessage = error.response?.data?.message || error.message || 'Failed to load cars';
          alert(`Error loading cars: ${errorMessage}. Please check if the backend server is running.`);
          // Fallback to empty array on error
          setOwnerCars([]);
        } finally {
          setLoadingCars(false);
        }
      }
    };
    loadCars();
  }, [userData?.id]);

  // Load booking demands (reservations for owner's cars)
  const loadDemands = async () => {
    // Ensure we have userData
    const currentUserData = userData || (() => {
      try {
        const stored = localStorage.getItem("carrent_current_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

    if (currentUserData?.id && ownerCars.length > 0) {
      setLoadingDemands(true);
      try {
        const { reservationAPI, userAPI } = await import('./services/api');
        
        // Get all reservations for all owner's cars
        const allDemands = [];
        
        for (const car of ownerCars) {
          try {
            const response = await reservationAPI.getReservationsByCar(car.id);
            const reservations = response.data || [];
            
            // Map each reservation with car and user details
            for (const reservation of reservations) {
              // Get user details for the reservation
              let customerData = null;
              try {
                const userResponse = await userAPI.getUserById(reservation.userId);
                customerData = userResponse.data;
              } catch (err) {
                console.error('Error loading customer:', err);
              }
              
              allDemands.push({
                id: reservation.id,
                reservation: reservation,
                car: {
                  id: car.id,
                  name: car.name,
                  brand: car.brand,
                  image: car.mainImage,
                  pricePerDay: car.pricePerDay
                },
                customer: customerData ? {
                  id: customerData.id,
                  name: customerData.fullName || customerData.name,
                  email: customerData.email
                } : {
                  id: reservation.userId,
                  name: 'Unknown User',
                  email: 'N/A'
                }
              });
            }
          } catch (err) {
            console.error(`Error loading reservations for car ${car.id}:`, err);
          }
        }
        
        // Sort by creation date (newest first)
        allDemands.sort((a, b) => {
          const dateA = new Date(a.reservation.createdAt || 0);
          const dateB = new Date(b.reservation.createdAt || 0);
          return dateB - dateA;
        });
        
        setDemands(allDemands);
      } catch (error) {
        console.error('Error loading demands:', error);
        setDemands([]);
      } finally {
        setLoadingDemands(false);
      }
    } else if (ownerCars.length === 0) {
      setDemands([]);
      setLoadingDemands(false);
    }
  };

  useEffect(() => {
    if (activeTab === "demands") {
      loadDemands();
    }
  }, [userData?.id, ownerCars, activeTab]);

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

  // Handle add/edit car
  const handleSaveCar = async (carData) => {
    try {
      // Ensure we have userData - load from localStorage if needed
      const currentUserData = userData || (() => {
        try {
          const stored = localStorage.getItem("carrent_current_user");
          return stored ? JSON.parse(stored) : null;
        } catch {
          return null;
        }
      })();

      if (!currentUserData || !currentUserData.id) {
        console.error('User data is not available');
        alert('Please log in to save a car.');
        return;
      }

      const { carAPI } = await import('./services/api');
      
      // Prepare car data for API - ensure price is properly converted
      const priceValue = parseFloat(carData.pricePerDay);
      if (isNaN(priceValue) || priceValue < 0) {
        alert('Please enter a valid price (must be a positive number)');
        return;
      }

      const apiCarData = {
        name: carData.name,
        brand: carData.brand,
        pricePerDay: priceValue,
        city: carData.city,
        availability: carData.availability || 'available',
        ownerId: currentUserData.id,
        ownerName: currentUserData.name || carData.owner,
        mainImageUrl: carData.mainImage || '',
        imagesUrl: carData.images || [],
        seats: Number(carData.seats) || 5,
        fuelType: carData.fuel || 'Gasoline',
        gearbox: carData.gearbox || 'Manual',
        latitude: carData.latitude ? Number(carData.latitude) : null,
        longitude: carData.longitude ? Number(carData.longitude) : null,
      };

      console.log('Saving car with price:', apiCarData.pricePerDay, 'from input:', carData.pricePerDay);

      if (carData.id && !isNaN(carData.id) && carData.id.toString().length < 10) {
        // Existing car - update (if ID is a reasonable number, it's likely from API)
        await carAPI.updateCar(carData.id, apiCarData);
      } else {
        // New car - create
        await carAPI.addCar(apiCarData);
      }
      
      // Reload cars from API with mapping
      const carsResponse = await carAPI.getCarsByOwner(currentUserData.id);
      const mappedCars = (carsResponse.data || []).map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        pricePerDay: typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0,
        city: car.city,
        availability: car.availability,
        owner: car.ownerName || currentUserData.name,
        ownerId: car.ownerId,
        mainImage: car.mainImageUrl || '',
        images: car.imagesUrl || [],
        seats: car.seats,
        fuel: car.fuelType,
        gearbox: car.gearbox,
        latitude: car.latitude,
        longitude: car.longitude
      }));
      setOwnerCars(mappedCars);
      setCarToEdit(null);
      setShowAddCarModal(false); // Close modal on success
      
      // Show success message
      alert(carData.id ? 'Car updated successfully!' : 'Car added successfully!');
    } catch (error) {
      console.error('Error saving car:', error);
      
      // Extract error message from response if available
      let errorMessage = 'Error saving car. Please check console for details.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        // Check for specific error messages
        const errorText = data?.message || data?.error || JSON.stringify(data);
        
        // Detect MySQL packet size error
        if (errorText && (errorText.includes('PacketTooBig') || errorText.includes('max_allowed_packet') || errorText.includes('Packet for query is too large'))) {
          errorMessage = 'Image files are too large. Please use smaller images or compress them before uploading.';
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (status === 500) {
          errorMessage = 'Server error occurred. Please check your connection and try again.';
        } else if (status === 400) {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        }
        
        console.error('Error response:', status, data);
      } else if (error.request) {
        errorMessage = 'Could not connect to server. Please check your internet connection.';
      }
      
      alert(errorMessage);
    }
  };

  // Handle delete car
  const handleDeleteCar = async (carId) => {
    try {
      // Ensure we have userData
      const currentUserData = userData || (() => {
        try {
          const stored = localStorage.getItem("carrent_current_user");
          return stored ? JSON.parse(stored) : null;
        } catch {
          return null;
        }
      })();

      if (!currentUserData?.id) {
        console.error('User data is not available');
        return;
      }

      const { carAPI } = await import('./services/api');
      await carAPI.deleteCar(carId);
      
      // Reload cars from API with mapping
      const response = await carAPI.getCarsByOwner(currentUserData.id);
      const mappedCars = (response.data || []).map(car => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        pricePerDay: typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0,
        city: car.city,
        availability: car.availability,
        owner: car.ownerName || currentUserData.name,
        ownerId: car.ownerId,
        mainImage: car.mainImageUrl || '',
        images: car.imagesUrl || [],
        seats: car.seats,
        fuel: car.fuelType,
        gearbox: car.gearbox,
        latitude: car.latitude,
        longitude: car.longitude
      }));
      setOwnerCars(mappedCars);
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car. Please check console for details.');
    }
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

    // Ensure we have userData
    const currentUserData = userData || (() => {
      try {
        const stored = localStorage.getItem("carrent_current_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

    if (!currentUserData || !currentUserData.id) {
      alert('Please log in to update profile picture.');
      return;
    }

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
        ...currentUserData,
        profilePicture: base64String
      };

      // Update localStorage
      localStorage.setItem("carrent_current_user", JSON.stringify(updatedUserData));
      
      // Update state
      setUserData(updatedUserData);
      
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("carrent_users") || "[]");
      const userIndex = users.findIndex(u => u.id === currentUserData.id);
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
        {loadingCars ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading cars...</p>
          </div>
        ) : filteredCars.length > 0 ? (
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

  // Handle reservation status update
  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      const { reservationAPI } = await import('./services/api');
      const response = await reservationAPI.getReservationById(reservationId);
      const reservation = response.data;
      
      reservation.status = newStatus;
      await reservationAPI.updateReservation(reservationId, reservation);
      
      // Reload demands
      await loadDemands();
      
      alert(`Reservation ${newStatus === 'confirmed' ? 'confirmed' : 'cancelled'} successfully!`);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Error updating reservation. Please try again.');
    }
  };

  const renderDemandsView = () => {
    // Get status badge color and text
    const getStatusBadge = (status) => {
      switch (status) {
        case 'pending':
          return { text: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-50' };
        case 'confirmed':
          return { text: 'Confirmed', color: 'bg-green-500', textColor: 'text-green-50' };
        case 'cancelled':
          return { text: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-50' };
        case 'completed':
          return { text: 'Completed', color: 'bg-blue-500', textColor: 'text-blue-50' };
        default:
          return { text: status, color: 'bg-gray-500', textColor: 'text-gray-50' };
      }
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Calculate days
    const calculateDays = (startDate, endDate) => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    };

    if (loadingDemands) {
      return (
        <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-8 text-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading demands...</p>
            </div>
          </div>
        </div>
      );
    }

    if (demands.length === 0) {
      return (
        <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No demands yet</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-4 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Booking Requests</h1>
          
          <div className="space-y-6">
            {demands.map((demand) => {
              const statusBadge = getStatusBadge(demand.reservation.status);
              const days = calculateDays(demand.reservation.startDate, demand.reservation.endDate);
              const totalPrice = typeof demand.reservation.totalPrice === 'number' 
                ? demand.reservation.totalPrice 
                : parseFloat(demand.reservation.totalPrice) || 0;

              return (
                <motion.div
                  key={demand.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Car Image */}
                    <div className="flex-shrink-0">
                      {demand.car.image ? (
                        <img
                          src={demand.car.image}
                          alt={demand.car.name}
                          className="w-full md:w-48 h-32 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full md:w-48 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl flex items-center justify-center">
                          <FaCar className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Demand Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {demand.car.brand} {demand.car.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Requested by: <span className="font-medium">{demand.customer.name}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {demand.customer.email}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color} ${statusBadge.textColor}`}>
                          {statusBadge.text}
                        </span>
                      </div>

                      {/* Dates and Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rental Period</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatDate(demand.reservation.startDate)} - {formatDate(demand.reservation.endDate)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{days} day{days !== 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Insurance</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {demand.reservation.insuranceType || 'basic'}
                          </p>
                        </div>
                        {demand.reservation.extras && demand.reservation.extras.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additional Services</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {demand.reservation.extras.join(', ')}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Price</p>
                          <p className="text-xl font-bold text-indigo-600 dark:text-purple-400">
                            {totalPrice} MAD
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {demand.reservation.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleUpdateReservationStatus(demand.id, 'confirmed')}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to reject this booking request?')) {
                                handleUpdateReservationStatus(demand.id, 'cancelled');
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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

  const renderAccountView = () => {
    // Get current user data (from state or localStorage)
    const currentUserData = userData || (() => {
      try {
        const stored = localStorage.getItem("carrent_current_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

    return (
      <div className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Account</h2>
          <p className="text-gray-600 dark:text-white/70">
            Manage your account settings and profile.
          </p>
        </div>
        
        {currentUserData ? (
          <>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {currentUserData.profilePicture ? (
                    <img
                      src={currentUserData.profilePicture}
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
                {currentUserData.profilePicture ? "Change Picture" : "Add Picture"}
              </button>
            </div>

            {/* Account Information */}
            <div className="space-y-6 mb-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Name</label>
                  <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">
                    {currentUserData.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Email</label>
                  <p className="px-4 py-3 bg-gray-50 dark:bg-indigo-900/40 rounded-lg text-gray-900 dark:text-white">
                    {currentUserData.email || 'N/A'}
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
        ) : null}
      
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
  };

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

