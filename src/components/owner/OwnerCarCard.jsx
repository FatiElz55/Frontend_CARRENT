// src/components/owner/OwnerCarCard.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Fuel, Settings, Trash2, Edit } from "lucide-react";

const OwnerCarCard = memo(function OwnerCarCard({ car, onDelete, onEdit }) {
  const isAvailable = car.availability === "available" || car.available === true || car.availability === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group bg-white/60 dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-gray-200/30 dark:border-purple-800/20 flex flex-col h-full"
    >
      {/* Owner at the top */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {car.owner ? car.owner.charAt(0).toUpperCase() : 'O'}
          </div>
          <span className="text-sm text-gray-600 dark:text-white font-medium truncate transition-colors duration-300" title={car.owner}>
            {car.owner}
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {car.mainImage ? (
          <img
            src={car.mainImage}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl"></div>
              <p className="text-sm text-gray-500">No image</p>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-20">
          {isAvailable ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              Reserved
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(car);
              }}
              className="p-2 bg-white/90 dark:bg-indigo-950/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-indigo-950 transition-colors"
              title="Edit car"
            >
              <Edit className="w-4 h-4 text-indigo-600 dark:text-white" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${car.name}"?`)) {
                  onDelete(car.id);
                }
              }}
              className="p-2 bg-white/90 dark:bg-indigo-950/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Delete car"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Top row: Car name on left, Location on right */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 transition-colors duration-300">
            {car.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-white transition-colors duration-300">
            <MapPin className="w-4 h-4 text-indigo-500 dark:text-white" />
            <span>{car.city}</span>
          </div>
        </div>

        {/* Three spec cards horizontally aligned */}
        <div className="flex gap-1.5 mb-3">
          {/* Seats card */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Users className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300">{car.seats} seats</span>
          </div>
          
          {/* Fuel card */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Fuel className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300">{car.fuel}</span>
          </div>
          
          {/* Transmission card */}
          <div className="flex-1 bg-purple-50/80 dark:bg-indigo-900/60 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/30 flex items-center justify-center gap-1.5 transition-colors duration-300">
            <Settings className="w-3 h-3 text-purple-600 dark:text-white flex-shrink-0" />
            <span className="text-[10px] text-gray-700 dark:text-white leading-tight transition-colors duration-300">{car.gearbox}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-gray-900 dark:text-white transition-colors duration-300">
          <p className="text-lg font-semibold">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-purple-200 dark:to-purple-300 bg-clip-text text-transparent align-middle">
              {car.pricePerDay}
            </span>
            <span className="ml-1 text-sm font-medium align-middle text-gray-600 dark:text-white transition-colors duration-300">MAD</span>
            <span className="ml-2 text-sm font-medium align-middle text-gray-500 dark:text-white transition-colors duration-300">per day</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default OwnerCarCard;


