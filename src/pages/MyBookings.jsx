import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Car, CheckCircle2, XCircle, 
  AlertCircle, Eye, X, Car as CarIcon, CreditCard, 
  User, Building, ChevronRight, Download,
  Phone, Mail, Fuel, Settings, Users, Star, Timer,
  Trash2, FileText, PhoneCall, MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  active: {
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
    label: "Active",
    badgeColor: "bg-emerald-500",
  },
  upcoming: {
    icon: AlertCircle,
    color: "bg-blue-50 text-blue-700",
    label: "Upcoming",
    badgeColor: "bg-blue-500",
  },
  pending: {
    icon: Timer,
    color: "bg-yellow-50 text-yellow-700",
    label: "Pending",
    badgeColor: "bg-yellow-500",
  },
  completed: {
    icon: CheckCircle2,
    color: "bg-gray-100 text-gray-700",
    label: "Completed",
    badgeColor: "bg-gray-500",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-50 text-red-700",
    label: "Cancelled",
    badgeColor: "bg-red-500",
  }
};

// Config for extras
const extrasConfig = {
  gps: { label: "GPS", icon: "📍" },
  wifi: { label: "WiFi", icon: "📶" },
  babySeat: { label: "Baby seat", icon: "👶" },
  delivery: { label: "Delivery", icon: "🚗" }
};

// Config for insurance
const insuranceConfig = {
  basic: { label: "Basic" },
  premium: { label: "Premium" },
  full: { label: "Full coverage" }
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateDaysTotal = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const calculateDaysRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isPast = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

// Simplified Booking Card component
const BookingCard = ({ booking, onCancel, onViewDetails }) => {
  const StatusIcon = statusConfig[booking.status]?.icon;
  const totalDays = calculateDaysTotal(booking.reservation.startDate, booking.reservation.endDate);
  const daysRemaining = calculateDaysRemaining(booking.reservation.endDate);
  const isActive = booking.status === 'active';
  const isUpcoming = booking.status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusConfig[booking.status]?.color}`}>
                {statusConfig[booking.status]?.label}
              </span>
              <span className="text-xs text-gray-500">{booking.reservation.reference}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.car.name}</h3>
            <p className="text-sm text-gray-600 dark:text-white">{booking.car.brand}</p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{booking.price} MAD</div>
            <div className="text-sm text-gray-500 dark:text-white/70">{totalDays} day{totalDays > 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(booking.reservation.startDate)}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(booking.reservation.endDate)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-purple-800/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(booking)}
            className="flex-1 py-2 px-3 bg-gray-50 dark:bg-indigo-900/60 text-gray-700 dark:text-white rounded-md font-medium hover:bg-gray-100 dark:hover:bg-indigo-900/80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View details</span>
          </motion.button>

          {(isActive || isUpcoming) && booking.status !== 'pending' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCancel(booking)}
              className="py-2 px-3 bg-red-50 text-red-700 rounded-md font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>
          )}
          {booking.status === 'pending' && (
            <div className="py-2 px-3 bg-yellow-50 text-yellow-700 rounded-md font-medium text-sm text-center">
              Waiting for approval
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Cancel Confirmation Modal
const CancelConfirmationModal = ({ booking, onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm cancellation</h3>
              <p className="text-sm text-gray-600 dark:text-white">Reference: {booking.reservation.reference}</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ Are you sure you want to cancel this reservation? This action is irreversible.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Vehicle: <span className="font-medium">{booking.car.name}</span>
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              From {formatDate(booking.reservation.startDate)} to {formatDate(booking.reservation.endDate)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-purple-700/30 rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-indigo-900/40 transition-colors"
            >
              No, keep it
            </button>
            <button
              onClick={() => {
                onConfirm(booking);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 bg-red-600 dark:bg-red-700 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Yes, cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Simplified Details Modal
const BookingDetailsModal = ({ booking, onClose }) => {
  const totalDays = calculateDaysTotal(booking.reservation.startDate, booking.reservation.endDate);
  const daysRemaining = calculateDaysRemaining(booking.reservation.endDate);
  const StatusIcon = statusConfig[booking.status]?.icon;
  const insurance = insuranceConfig[booking.reservation.insurance];
  const extras = booking.reservation.extras.map(id => extrasConfig[id]).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/30 dark:border-purple-800/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl border-b border-gray-200 dark:border-purple-800/30 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Booking details</h3>
            <p className="text-sm text-gray-600 dark:text-white">{booking.reservation.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and vehicle */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={booking.car.image}
                  alt={booking.car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{booking.car.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusConfig[booking.status]?.color}`}>
                    {statusConfig[booking.status]?.label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-white">{booking.car.brand}</span>
                </div>
                <div className="flex gap-3 text-sm text-gray-600 dark:text-white">
                  <span>{booking.car.seats} seats</span>
                  <span>•</span>
                  <span>{booking.car.fuel}</span>
                  <span>•</span>
                  <span>{booking.car.gearbox}</span>
                </div>
              </div>
            </div>
            
            {daysRemaining > 0 && booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{daysRemaining}</div>
                <div className="text-sm text-gray-500 dark:text-white/70">day{daysRemaining > 1 ? 's' : ''} remaining</div>
              </div>
            )}
          </div>

          {/* Dates and price */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Rental period</h5>
                <div className="bg-gray-50 dark:bg-indigo-900/40 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500 dark:text-white/70">Start</div>
                    <div className="font-medium dark:text-white">{formatDate(booking.reservation.startDate)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-white/70">End</div>
                    <div className="font-medium dark:text-white">{formatDate(booking.reservation.endDate)}</div>
                  </div>
                  <div className="text-center text-sm text-gray-500 dark:text-white/70 mt-3">
                    {totalDays} day{totalDays > 1 ? 's' : ''} total
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Selected options</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm dark:text-white">
                    <span>Insurance</span>
                    <span className="font-medium">{insurance?.label}</span>
                  </div>
                  {extras.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 dark:text-white/70 mb-1">Additional services</div>
                      <div className="space-y-1">
                        {extras.map((extra, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm dark:text-white">
                            <span>{extra.icon}</span>
                            <span>{extra.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Payment</h5>
                <div className="bg-gray-50 dark:bg-indigo-900/40 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{booking.price} MAD</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between dark:text-white">
                      <span className="text-gray-600 dark:text-white/70">Method</span>
                      <span className="font-medium">
                        {booking.reservation.paymentMethod === 'card' ? 'Credit card' : 
                         booking.reservation.paymentMethod === 'cash' ? 'Cash' : 'Bank transfer'}
                      </span>
                    </div>
                    <div className="flex justify-between dark:text-white">
                      <span className="text-gray-600 dark:text-white/70">Status</span>
                      <span className={`font-medium ${
                        booking.status === 'cancelled' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {booking.status === 'cancelled' ? 'Cancelled' : 'Paid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Booked on</h5>
                <div className="text-sm text-gray-600 dark:text-white">
                  {formatDate(booking.reservation.createdAt)} at {formatTime(booking.reservation.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-purple-800/30">
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-purple-700/30 rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Download invoice</span>
              </button>
              <button className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-purple-700/30 rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Contact support</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ filter, onExplore }) => {
  const messages = {
    all: "You haven't made any bookings yet",
    active: "No active bookings",
    upcoming: "No upcoming bookings",
    completed: "No completed bookings",
    cancelled: "No cancelled bookings"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
        <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {filter === "all" ? "No bookings yet" : "No results found"}
      </h3>
      <p className="text-gray-600 dark:text-white mb-8 max-w-md mx-auto">
        {messages[filter] || "No bookings found"}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExplore}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
      >
        <CarIcon className="w-5 h-5" />
        <span>Explore vehicles</span>
      </motion.button>
    </motion.div>
  );
};

export default function MyBookings({ isEmbedded = false }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Handle explore vehicles navigation
  const handleExploreVehicles = () => {
    if (isEmbedded) {
      // If embedded in owner page, switch to home tab (catalogue)
      const currentUser = localStorage.getItem("carrent_current_user");
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          if (user.role === "owner" || user.role === "OWNER") {
            // Navigate to owner page and set home tab
            navigate("/owner");
            if (user.id) {
              localStorage.setItem(`carrent_owner_active_tab_${user.id}`, "home");
            }
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "home" }));
            }, 100);
            return;
          }
        } catch (err) {
          // Fall through to regular navigation
        }
      }
    }
    // Regular client navigation to catalogue
    navigate("/catalogue");
  };

  // Load bookings from API
  useEffect(() => {
    const loadBookings = async () => {
      const currentUser = localStorage.getItem("carrent_current_user");
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          const { reservationAPI, carAPI } = await import('../services/api');
          
          // Get reservations from API
          const response = await reservationAPI.getReservationsByUser(user.id);
          const reservations = response.data || [];
          
          // Map reservations to booking format expected by frontend
          const mappedBookings = await Promise.all(reservations.map(async (reservation) => {
            // Fetch car details
            let carData = null;
            try {
              const carResponse = await carAPI.getCarById(reservation.carId);
              carData = carResponse.data;
            } catch (err) {
              console.error('Error loading car:', err);
            }
            
            // Determine status based on dates and reservation status
            let status = reservation.status || 'pending';
            
            // If pending or cancelled, keep the status as is
            if (status === 'pending' || status === 'cancelled') {
              // Keep pending/cancelled status regardless of dates
            } else {
              // For confirmed reservations, determine status based on dates
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset time to start of day
              
              const startDate = new Date(reservation.startDate);
              startDate.setHours(0, 0, 0, 0);
              
              const endDate = new Date(reservation.endDate);
              endDate.setHours(0, 0, 0, 0);
              
              if (endDate < today) {
                // Past reservation
                status = 'completed';
              } else if (startDate > today) {
                // Future reservation
                status = 'upcoming';
              } else {
                // Current reservation (today is between start and end)
                status = 'active';
              }
            }
            
            // Map to frontend format
            return {
              id: reservation.id,
              car: carData ? {
                id: carData.id,
                name: carData.name,
                image: carData.mainImageUrl || '',
                brand: carData.brand,
                seats: carData.seats,
                fuel: carData.fuelType,
                gearbox: carData.gearbox,
              } : null,
              reservation: {
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                reference: `RES-${reservation.id}`,
                createdAt: reservation.createdAt || new Date().toISOString(),
                insurance: reservation.insuranceType,
                extras: reservation.extras || [],
                paymentMethod: 'cash' // Default, not stored in DB
              },
              status: status,
              price: reservation.totalPrice || 0
            };
          }));
          
          setBookings(mappedBookings);
        } catch (err) {
          console.error("Error loading bookings:", err);
          setBookings([]);
        }
      }
    };
    loadBookings();
  }, []);

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (booking) => {
    try {
      const { reservationAPI } = await import('../services/api');
      await reservationAPI.cancelReservation(booking.id);
      
      // Update local state
      const updatedBookings = bookings.map(b => 
        b.id === booking.id ? { ...b, status: 'cancelled' } : b
      );
      setBookings(updatedBookings);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert('Error cancelling reservation. Please try again.');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.price || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a0f24]">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2 lg:max-w-7xl lg:mx-auto">
        {/* Simple filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6 flex-wrap lg:flex-nowrap"
        >
            {[
              { id: "all", label: "All", count: stats.total },
              { id: "pending", label: "Pending", count: stats.pending },
              { id: "active", label: "Active", count: stats.active },
              { id: "upcoming", label: "Upcoming", count: stats.upcoming },
              { id: "completed", label: "Completed", count: stats.completed },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(item.id)}
                className={`flex-1 lg:flex-none px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                  filter === item.id
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50"
                    : "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/60 border-gray-200 dark:border-gray-700/50"
                }`}
              >
                {item.label}
                {item.count > 0 && (
                  <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs opacity-75">({item.count})</span>
                )}
              </motion.button>
            ))}
        </motion.div>
      </div>

      {/* Bookings list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {filteredBookings.length > 0 ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState 
              filter={filter} 
              onExplore={handleExploreVehicles}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDetailsModal && selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setShowDetailsModal(false)}
          />
        )}

        {showCancelModal && bookingToCancel && (
          <CancelConfirmationModal
            booking={bookingToCancel}
            onClose={() => {
              setShowCancelModal(false);
              setBookingToCancel(null);
            }}
            onConfirm={handleCancelConfirm}
          />
        )}
      </AnimatePresence>

    </div>
  );
}