// src/components/catalogue/FiltersBar.jsx
import React, { useState, useEffect, memo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Filter, X, RotateCcw, Check, Car, Calendar, Map, ChevronDown, Search, Users, Settings, Fuel, DollarSign, TrendingUp, Star } from "lucide-react";
import toast from "react-hot-toast";

const FiltersBar = memo(function FiltersBar({ cars, onFilter }) {
  // Filter state
  const [filters, setFilters] = useState({
    availability: "all", // "all", "available"
    location: "all", // "all" or city name
    brand: "", // selected brand or empty for all
    seats: "", // number of seats or empty for all
    type: "", // "manual", "automatic", or empty for all
    fuel: "", // "diesel", "petrol", or empty for all
    priceMin: "", // minimum price
    priceMax: "", // maximum price
    priceSort: "", // "low-to-high", "high-to-low", "range", or ""
    timesRented: "", // "most", "least", or empty for all
    rating: "", // minimum rating (stars) or empty for all
    dateFrom: "", // start date for availability
    dateTo: "" // end date for availability
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  
  // Dropdown states
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDropdownPosition, setCityDropdownPosition] = useState({ top: 0, left: 0 });
  const brandDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const cityDropdownDesktopRef = useRef(null);
  const cityButtonRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  // Extract unique values
  const brands = Array.from(new Set(cars.map(c => c.brand))).sort();
  const cities = Array.from(new Set(cars.map(c => c.city))).sort();

  // Filtered lists for search
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (showCityDropdown && cityButtonRef.current) {
      const updatePosition = () => {
        if (cityButtonRef.current) {
          const rect = cityButtonRef.current.getBoundingClientRect();
          setCityDropdownPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX
          });
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showCityDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }
      if ((!cityDropdownRef.current || !cityDropdownRef.current.contains(event.target)) &&
          (!cityDropdownDesktopRef.current || !cityDropdownDesktopRef.current.contains(event.target)) &&
          (!cityButtonRef.current || !cityButtonRef.current.contains(event.target))) {
        setShowCityDropdown(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize with no filters
  useEffect(() => {
    if (!appliedFilters) {
      onFilter({ 
        availability: "all", 
        location: "all", 
        brand: "",
        seats: "",
        type: "",
        fuel: "",
        priceMin: "",
        priceMax: "",
        priceSort: "",
        timesRented: "",
        rating: "",
        dateFrom: "",
        dateTo: ""
      });
    }
  }, [appliedFilters, onFilter]);

  // Handle location selection
  const handleLocationSelect = useCallback((value) => {
    setFilters(prev => ({ ...prev, location: value }));
    setShowCityDropdown(false);
  }, []);

  // Handle brand selection
  const handleBrandSelect = useCallback((value) => {
    setFilters(prev => ({ ...prev, brand: value }));
    setShowBrandDropdown(false);
    setSearchQuery("");
  }, []);

  // Apply filters
  const applyFilters = useCallback((e) => {
    if (e) e.preventDefault();
    
    setAppliedFilters({ ...filters });
    
    const filterPayload = {
      availability: filters.availability,
      location: filters.location,
      brand: filters.brand,
      seats: filters.seats,
      type: filters.type,
      fuel: filters.fuel,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      priceSort: filters.priceSort,
      timesRented: filters.timesRented,
      rating: filters.rating,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo
    };
    
    onFilter(filterPayload);
    setShowFilters(false);
    toast.success("Filters applied!");
  }, [filters, onFilter]);

  // Reset all filters
  const resetFilters = useCallback((e) => {
    if (e) e.preventDefault();
    
    setFilters({
      availability: "all",
      location: "all",
      brand: "",
      seats: "",
      type: "",
      fuel: "",
      priceMin: "",
      priceMax: "",
      priceSort: "",
      timesRented: "",
      rating: "",
      dateFrom: "",
      dateTo: ""
    });
    setAppliedFilters(null);
    setSearchQuery("");
    setShowBrandDropdown(false);
    setShowCityDropdown(false);
    setShowPriceDropdown(false);
    setShowDatePicker(false);
    toast.success("Filters reset");
  }, []);

  // Toggle filters panel
  const toggleFilters = useCallback((e) => {
    if (e) e.preventDefault();
    setShowFilters(!showFilters);
    setShowBrandDropdown(false);
    setShowCityDropdown(false);
    setShowPriceDropdown(false);
    setShowDatePicker(false);
  }, [showFilters]);

  // Check if filters have changed from applied state
  const hasUnsavedChanges = appliedFilters ? 
    JSON.stringify(filters) !== JSON.stringify(appliedFilters) : 
    filters.availability !== "all" || filters.location !== "all" || filters.brand !== "" ||
    filters.seats !== "" || filters.type !== "" || filters.fuel !== "" ||
    filters.priceMin !== "" || filters.priceMax !== "" || filters.priceSort !== "" ||
    filters.timesRented !== "" || filters.rating !== "" ||
    filters.dateFrom !== "" || filters.dateTo !== "";

  // Check if any filter is active
  const hasActiveFilters = appliedFilters ? 
    appliedFilters.availability !== "all" || 
    appliedFilters.location !== "all" || 
    appliedFilters.brand !== "" ||
    appliedFilters.seats !== "" || appliedFilters.type !== "" || appliedFilters.fuel !== "" ||
    appliedFilters.priceMin !== "" || appliedFilters.priceMax !== "" || appliedFilters.priceSort !== "" ||
    appliedFilters.timesRented !== "" || appliedFilters.rating !== "" ||
    appliedFilters.dateFrom !== "" || appliedFilters.dateTo !== "" : 
    false;

  // Get display text for selected values
  const getLocationText = () => {
    if (filters.location === "all") return "All cities";
    return filters.location;
  };

  const getBrandText = () => {
    return filters.brand || "All brands";
  };

  const getAvailabilityText = () => {
    switch(filters.availability) {
      case "available": return "Available";
      default: return "All";
    }
  };

  const getPriceText = () => {
    if (filters.priceSort === "low-to-high") return "Lower to Higher";
    if (filters.priceSort === "high-to-low") return "Higher to Lower";
    if (filters.priceSort === "range") {
      if (filters.priceMin && filters.priceMax) {
        return `${filters.priceMin} - ${filters.priceMax}`;
      }
      if (filters.priceMin) return `From ${filters.priceMin}`;
      if (filters.priceMax) return `Up to ${filters.priceMax}`;
      return "Range";
    }
    return "Price";
  };

  const getDateText = () => {
    if (filters.dateFrom && filters.dateTo) {
      return `${new Date(filters.dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(filters.dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (filters.dateFrom) {
      return `From ${new Date(filters.dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (filters.dateTo) {
      return `Until ${new Date(filters.dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return "Date";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-white dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg mb-6 border border-gray-200 dark:border-purple-800/30 transition-colors duration-300 overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header - Compact */}
      <div className="p-4 overflow-visible relative">
        <div className="flex items-center justify-between flex-wrap gap-3 overflow-visible relative">
          {/* Filters icon and text - Left */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600 dark:text-white" />
            <h3 className="font-semibold text-purple-600 dark:text-white">Filters</h3>
          </div>
          
          {/* Quick filter chips - Center */}
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-white">Date:</span>
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors text-xs flex items-center gap-1"
              >
                  {getDateText()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-80 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 p-4 transition-colors duration-300"
            >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-white mb-1">From</label>
                          <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                          />
          </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-white mb-1">To</label>
                          <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                            min={filters.dateFrom || undefined}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                          />
        </div>
                        {(filters.dateFrom || filters.dateTo) && (
            <button
                            onClick={() => {
                              setFilters(prev => ({ ...prev, dateFrom: "", dateTo: "" }));
                            }}
                            className="w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
                            Clear dates
            </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
          
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-white">Price:</span>
              <div className="relative" ref={priceDropdownRef}>
            <button
                  onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  className="px-3 py-1 bg-orange-50 dark:bg-orange-900/40 dark:text-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors text-xs flex items-center gap-1"
            >
                  {getPriceText()}
              <ChevronDown className="w-3 h-3" />
            </button>
                <AnimatePresence>
                  {showPriceDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-64 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 overflow-hidden transition-colors duration-300"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, priceSort: "low-to-high", priceMin: "", priceMax: "" }));
                            setShowPriceDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${
                            filters.priceSort === "low-to-high" ? "bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-white" : "text-gray-700 dark:text-white"
                          }`}
                        >
                          <span className="font-medium">Lower to Higher</span>
                          {filters.priceSort === "low-to-high" && <Check className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                        </button>
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, priceSort: "high-to-low", priceMin: "", priceMax: "" }));
                            setShowPriceDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${
                            filters.priceSort === "high-to-low" ? "bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-white" : "text-gray-700 dark:text-white"
                          }`}
                        >
                          <span className="font-medium">Higher to Lower</span>
                          {filters.priceSort === "high-to-low" && <Check className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                        </button>
                        <div className="border-t border-purple-200/30 dark:border-purple-700/30 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setFilters(prev => ({ ...prev, priceSort: "range" }));
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${
                              filters.priceSort === "range" ? "bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-white" : "text-gray-700 dark:text-white"
                            }`}
                          >
                            <span className="font-medium">Range</span>
                            {filters.priceSort === "range" && <Check className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                          </button>
                          {filters.priceSort === "range" && (
                            <div className="px-4 pb-3 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-500 dark:text-white mb-1">Min</label>
                                <input
                                  type="number"
                                  placeholder="Min price"
                                  value={filters.priceMin}
                                  onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 dark:text-white mb-1">Max</label>
                                <input
                                  type="number"
                                  placeholder="Max price"
                                  value={filters.priceMax}
                                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          </div>
          
            <div className="hidden md:flex items-center gap-2 text-sm relative overflow-visible">
              <span className="text-gray-500 dark:text-white">City:</span>
              <div className="relative overflow-visible" ref={cityDropdownDesktopRef}>
            <button
                  ref={cityButtonRef}
                  onClick={() => {
                    if (cityButtonRef.current) {
                      const rect = cityButtonRef.current.getBoundingClientRect();
                      setCityDropdownPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX
                      });
                    }
                    setShowCityDropdown(!showCityDropdown);
                  }}
                  className="px-3 py-1 bg-green-50 dark:bg-green-900/40 dark:text-green-300 text-green-700 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/60 transition-colors text-xs flex items-center gap-1"
            >
                  {getLocationText()}
              <ChevronDown className="w-3 h-3" />
            </button>
                {/* City Dropdown - Desktop - Using Portal */}
                {showCityDropdown && typeof document !== 'undefined' && createPortal(
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          position: 'fixed',
                          top: `${cityDropdownPosition.top}px`,
                          left: `${cityDropdownPosition.left}px`,
                          zIndex: 9999
                        }}
                        className="w-64 bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 max-h-64 overflow-hidden transition-colors duration-300"
                        ref={cityDropdownDesktopRef}
                      >
                      <div className="p-3 border-b border-purple-200/30 dark:border-purple-700/30">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a city..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {/* All cities option */}
                        <button
                          onClick={() => handleLocationSelect("all")}
                          className={`w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center justify-between ${
                            filters.location === "all" ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-white" : "text-gray-700 dark:text-white"
                          }`}
                        >
                          <span className="font-bold">All cities</span>
                          {filters.location === "all" && <Check className="w-4 h-4 text-green-600 dark:text-green-400" />}
                        </button>
                        {filteredCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleLocationSelect(city)}
                            className={`w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center justify-between ${
                              filters.location === city ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-white" : "text-gray-700 dark:text-white"
                            }`}
                          >
                            <span className="font-bold">{city}</span>
                            {filters.location === city && <Check className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          </button>
                        ))}
                        {filteredCities.length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-500 dark:text-white">
                            No city found
                          </div>
                        )}
                      </div>
                    </motion.div>
                    )}
                  </AnimatePresence>
                  , document.body
                )}
              </div>
            </div>
          </div>
          
          {/* Other preferences button - Right */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="p-2 text-gray-500 dark:text-white hover:text-red-600 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleFilters}
              className="px-4 py-2 bg-purple-50 dark:bg-purple-900/40 dark:text-purple-300 text-purple-600 rounded-xl font-medium flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors duration-150 text-sm"
            >
              <span>{showFilters ? "Close" : "Other preferences"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* Active filters badges */}
        {hasActiveFilters && appliedFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-purple-200/30 dark:border-purple-700/30"
          >
            {appliedFilters.availability !== "all" && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-white dark:text-gray-700 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Calendar className="w-3 h-3" />
                Available
                <button onClick={() => setFilters(prev => ({ ...prev, availability: "all" }))} className="hover:text-blue-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.location !== "all" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-white dark:text-gray-700 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <MapPin className="w-3 h-3" />
                {appliedFilters.location}
                <button onClick={() => setFilters(prev => ({ ...prev, location: "all" }))} className="hover:text-green-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(appliedFilters.dateFrom || appliedFilters.dateTo) && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-white dark:text-gray-700 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Calendar className="w-3 h-3" />
                {appliedFilters.dateFrom && appliedFilters.dateTo 
                  ? `${new Date(appliedFilters.dateFrom).toLocaleDateString()} - ${new Date(appliedFilters.dateTo).toLocaleDateString()}`
                  : appliedFilters.dateFrom 
                    ? `From ${new Date(appliedFilters.dateFrom).toLocaleDateString()}`
                    : `Until ${new Date(appliedFilters.dateTo).toLocaleDateString()}`
                }
                <button onClick={() => setFilters(prev => ({ ...prev, dateFrom: "", dateTo: "" }))} className="hover:text-indigo-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.priceSort && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-white dark:text-gray-700 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <DollarSign className="w-3 h-3" />
                {appliedFilters.priceSort === "low-to-high" ? "Lower to Higher" :
                 appliedFilters.priceSort === "high-to-low" ? "Higher to Lower" :
                 appliedFilters.priceSort === "range" && (appliedFilters.priceMin || appliedFilters.priceMax)
                   ? `${appliedFilters.priceMin || "0"} - ${appliedFilters.priceMax || "∞"}`
                   : "Price"}
                <button onClick={() => setFilters(prev => ({ ...prev, priceSort: "", priceMin: "", priceMax: "" }))} className="hover:text-orange-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.brand && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-white dark:text-gray-700 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Car className="w-3 h-3" />
                {appliedFilters.brand}
                <button onClick={() => setFilters(prev => ({ ...prev, brand: "" }))} className="hover:text-purple-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.seats && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-white dark:text-gray-700 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Users className="w-3 h-3" />
                {appliedFilters.seats} seats
                <button onClick={() => setFilters(prev => ({ ...prev, seats: "" }))} className="hover:text-indigo-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.type && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-white dark:text-gray-700 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Settings className="w-3 h-3" />
                {appliedFilters.type === "manual" ? "Manual" : "Automatic"}
                <button onClick={() => setFilters(prev => ({ ...prev, type: "" }))} className="hover:text-indigo-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.fuel && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-white dark:text-gray-700 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <Fuel className="w-3 h-3" />
                {appliedFilters.fuel === "diesel" ? "Diesel" : "Petrol"}
                <button onClick={() => setFilters(prev => ({ ...prev, fuel: "" }))} className="hover:text-orange-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.timesRented && (
              <span className="px-2 py-1 bg-teal-100 dark:bg-white dark:text-gray-700 text-teal-700 rounded-full text-xs font-medium flex items-center gap-1 border border-purple-200/30 dark:border-purple-700/30">
                <TrendingUp className="w-3 h-3" />
                {appliedFilters.timesRented === "most" ? "Most Rented" : "Least Rented"}
                <button onClick={() => setFilters(prev => ({ ...prev, timesRented: "" }))} className="hover:text-teal-900 dark:hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Dropdowns for mobile */}
      <AnimatePresence>
        {/* Brand Dropdown */}
        {showBrandDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            ref={brandDropdownRef}
            className="absolute z-50 mt-2 w-full max-w-sm bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 max-h-64 overflow-hidden transition-colors duration-300"
          >
            <div className="p-3 border-b border-purple-200/30 dark:border-purple-700/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a brand..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center justify-between ${
                      filters.brand === brand ? "bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-white" : "text-gray-700 dark:text-white"
                    }`}
                  >
                    <span className="font-medium">{brand}</span>
                    {filters.brand === brand && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-white">
                  No brand found
                </div>
              )}
            </div>
            <div className="p-3 border-t border-purple-200/30 dark:border-purple-700/30">
              <button
                onClick={() => handleBrandSelect("")}
                className="w-full px-4 py-2 text-center text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
              >
                All brands
              </button>
            </div>
          </motion.div>
        )}

        {/* City Dropdown - Mobile Only */}
        {showCityDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            ref={cityDropdownRef}
            className="md:hidden absolute z-[9999] mt-2 w-full max-w-sm bg-white/90 dark:bg-indigo-950/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-purple-800/30 max-h-64 overflow-hidden transition-colors duration-300"
          >
            <div className="p-3 border-b border-purple-200/30 dark:border-purple-700/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a city..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {/* All cities option */}
              <button
                onClick={() => handleLocationSelect("all")}
                className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center justify-between ${
                  filters.location === "all" ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-white" : "text-gray-700 dark:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span className="font-bold">All cities</span>
                </div>
                {filters.location === "all" && <Check className="w-4 h-4 text-green-600" />}
              </button>
              
              {/* City list */}
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleLocationSelect(city)}
                      className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center justify-between ${
                      filters.location === city ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-white" : "text-gray-700 dark:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-bold">{city}</span>
                      </div>
                      {filters.location === city && <Check className="w-4 h-4 text-green-600" />}
                    </button>
                  ))
                ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-white">
                    No city found
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t border-purple-200/30 dark:border-purple-700/30"
          >
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Section */}
                <div className="flex-1 space-y-6 md:pr-6 md:border-r md:border-purple-200/30 md:dark:border-purple-700/30">
                  {/* City Filter - Mobile Only */}
                  <div className="space-y-2 md:hidden">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <MapPin className="w-4 h-4" />
                      <span>City</span>
                    </label>
                    <div className="relative">
                      <select
                        value={filters.location === "all" ? "" : filters.location}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value !== "" && value !== "all") {
                            handleLocationSelect(value);
                          } else {
                            handleLocationSelect("all");
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-purple-700/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white/80 dark:bg-indigo-900/60 backdrop-blur-sm text-gray-900 dark:text-purple-100 transition-colors duration-300"
                      >
                        <option value="">All cities</option>
                        {cities.map((city) => (
                          <option key={city} value={city} className="text-gray-700 dark:text-white dark:bg-gray-700">
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white pointer-events-none" />
                    </div>
                  </div>

                  {/* Availability Filter */}
              <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                  <Calendar className="w-4 h-4" />
                  <span>Availability</span>
                </label>
                <div className="flex gap-2">
                      {["all", "available"].map((value) => {
                    const labels = {
                      all: "All",
                          available: "Available"
                    };
                    return (
                      <button
                        key={value}
                        onClick={() => setFilters(prev => ({ ...prev, availability: value }))}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.availability === value
                            ? value === "all" ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/60"
                        }`}
                      >
                        {labels[value]}
                      </button>
                    );
                  })}
                </div>
                    {/* Date inputs under Availability */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-white mb-1">From</label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                        />
              </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-white mb-1">To</label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                          min={filters.dateFrom || undefined}
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
                        />
                  </div>
                </div>
              </div>

                  {/* Brand Filter */}
              <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                  <Car className="w-4 h-4" />
                  <span>Brand</span>
                </label>
                <div className="relative">
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-purple-700/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white/80 dark:bg-indigo-900/60 backdrop-blur-sm text-gray-900 dark:text-purple-100 transition-colors duration-300"
                  >
                    <option value="">All brands</option>
                    {brands.map((brand) => (
                          <option key={brand} value={brand} className="text-gray-700 dark:text-white dark:bg-gray-700">
                        {brand}
                      </option>
                    ))}
                  </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white pointer-events-none" />
                    </div>
                  </div>

                  {/* Seats Filter */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Users className="w-4 h-4" />
                      <span>Seats</span>
                    </label>
                    <div className="relative">
                      <select
                        value={filters.seats}
                        onChange={(e) => setFilters(prev => ({ ...prev, seats: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-purple-700/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white/80 dark:bg-indigo-900/60 backdrop-blur-sm text-gray-900 dark:text-purple-100 transition-colors duration-300"
                      >
                        <option value="">All seats</option>
                        <option value="2">2 seats</option>
                        <option value="4">4 seats</option>
                        <option value="5">5 seats</option>
                        <option value="7">7 seats</option>
                        <option value="8">8+ seats</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 space-y-6 md:pl-6">
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Settings className="w-4 h-4" />
                      <span>Type</span>
                    </label>
                  <div className="flex gap-2">
                      {["", "manual", "automatic"].map((value) => {
                        const labels = {
                          "": "All",
                          "manual": "Manual",
                          "automatic": "Automatic"
                        };
                        return (
                    <button
                            key={value}
                            onClick={() => setFilters(prev => ({ ...prev, type: value }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              filters.type === value
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                : "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/60"
                      }`}
                    >
                            {labels[value]}
                    </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fuel Type Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <Fuel className="w-4 h-4" />
                      <span>Fuel Type</span>
                    </label>
                    <div className="flex gap-2">
                      {["", "diesel", "petrol"].map((value) => {
                        const labels = {
                          "": "All",
                          "diesel": "Diesel",
                          "petrol": "Petrol"
                        };
                        return (
                    <button
                            key={value}
                            onClick={() => setFilters(prev => ({ ...prev, fuel: value }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              filters.fuel === value
                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                : "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/60"
                            }`}
                          >
                            {labels[value]}
                    </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Times Rented Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white">
                      <TrendingUp className="w-4 h-4" />
                      <span>Times Rented</span>
                    </label>
                    <div className="flex gap-2">
                      {["", "most", "least"].map((value) => {
                        const labels = {
                          "": "All",
                          "most": "Most Rented",
                          "least": "Least Rented"
                        };
                        return (
                          <button
                            key={value}
                            onClick={() => setFilters(prev => ({ ...prev, timesRented: value }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              filters.timesRented === value
                                ? "bg-teal-100 text-teal-700 border border-teal-200"
                                : "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/60"
                            }`}
                          >
                            {labels[value]}
                          </button>
                        );
                      })}
                </div>
              </div>

                </div>
              </div>

              {/* Apply Button - Always visible in expanded view */}
              <div className="pt-4">
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={applyFilters}
                    disabled={!hasUnsavedChanges}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
                      hasUnsavedChanges
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply</span>
                  </motion.button>
                  
                  {hasActiveFilters && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={resetFilters}
                      className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Button (when filters panel is closed but there are unsaved changes) */}
      {!showFilters && hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={applyFilters}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Apply filters</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
});

export default FiltersBar;