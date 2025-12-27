// src/pages/Catalogue.jsx
import React, { useState, useMemo, lazy, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARS } from "../data/mockData";
import CarCard from "../components/catalogue/CarCard";
import FiltersBar from "../components/catalogue/FiltersBar";
import { distanceInKm } from "../utils/geo";
import { Search, Navigation } from "lucide-react";

// Lazy load modal (loaded only when needed)
const DetailsModal = lazy(() => import("../components/catalogue/DetailsModal"));

export default function Catalogue({ isEmbedded = false, onCarSelect }) {
  const [cars] = useState(CARS);
  const [filter, setFilter] = useState({
    availability: "all", // "all", "available", "reserved"
    location: "all", // "all", "nearest", or city name
    brand: "", // selected brand or empty for all
    userCoords: null, // for nearest location
    radiusKm: 50 // default radius
  });
  const [selectedCar, setSelectedCar] = useState(null);

  const handleFilter = useCallback((filterObj) => {
    setFilter(prev => ({ 
      ...prev, 
      ...filterObj 
    }));
  }, []);

  const filtered = useMemo(() => {
    let list = cars.slice();

    // Filter by availability
    if (filter.availability !== "all") {
      list = list.filter(c => c.availability === filter.availability);
    }

    // Filter by brand
    if (filter.brand) {
      list = list.filter(c => c.brand === filter.brand);
    }

    // Filter by location
    if (filter.location !== "all") {
      if (filter.location === "nearest" && filter.userCoords) {
        // Filter by distance
        const arr = list
          .map(c => {
            const lat = c.latitude ?? c.coords?.lat ?? c.lat;
            const lng = c.longitude ?? c.coords?.lng ?? c.longitude;
            return { 
              c, 
              distKm: distanceInKm(
                filter.userCoords.lat, 
                filter.userCoords.lng, 
                lat, 
                lng
              ) 
            };
          })
          .filter(x => x.distKm <= (filter.radiusKm ?? 50))
          .sort((a, b) => a.distKm - b.distKm)
          .map(x => ({ 
            ...x.c, 
            __distanceKm: Number(x.distKm.toFixed(2)) 
          }));

        return arr;
      } else if (filter.location !== "nearest") {
        // Filter by specific city
        list = list.filter(c => c.city === filter.location);
      }
    }

    return list;
  }, [cars, filter]);

  const openDetails = useCallback((car) => {
    setSelectedCar(car);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedCar(null);
  }, []);

  // Optimization: reduce stagger for large lists
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: filtered.length > 10 ? 0.01 : 0.03
      }
    }
  };

  return (
    <div 
      className={`${isEmbedded ? "py-4 px-4 sm:px-6 lg:px-8" : "min-h-screen py-8 px-4 sm:px-6 lg:px-8"} ${isEmbedded ? "" : "bg-gray-50 dark:bg-[#1a0f24]"} text-gray-900 dark:text-white transition-colors duration-300`}
      onClick={(e) => {
        // Stop propagation but not preventDefault to not block navigation
        e.stopPropagation();
      }}
    >
      <div className={`${isEmbedded ? "w-full" : "max-w-7xl"} mx-auto`}>
        {/* Filters */}
        <FiltersBar cars={cars} onFilter={handleFilter} />

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            {filter.location === "nearest" && filter.userCoords ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 text-indigo-700 rounded-xl font-semibold transition-colors duration-300">
                <Navigation className="w-5 h-5" />
                <span>Sorted by distance — {filter.radiusKm} km radius</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800/40 dark:text-white text-gray-700 rounded-xl font-semibold transition-colors duration-300">
                <Search className="w-5 h-5 dark:text-white" />
                <span>{filtered.length} {filtered.length === 1 ? "vehicle found" : "vehicles found"}</span>
              </div>
            )}
          </div>

          {/* Active filters summary */}
          <div className="flex flex-wrap gap-2">
            {filter.availability !== "all" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {filter.availability === "available" ? "Available only" : "Reserved only"}
              </span>
            )}
            {filter.location !== "all" && filter.location !== "nearest" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                City: {filter.location}
              </span>
            )}
            {filter.brand && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Brand: {filter.brand}
              </span>
            )}
          </div>
        </motion.div>

        {/* Cars Grid */}
        {filtered.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <CarCard car={car} onClick={openDetails} />
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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No vehicle found</h3>
            <p className="text-gray-500">
              Try modifying your search criteria
            </p>
          </motion.div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {selectedCar && (
            <Suspense fallback={null}>
              <DetailsModal 
                car={selectedCar} 
                onClose={closeDetails}
                isEmbedded={isEmbedded}
                onReserve={onCarSelect}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}