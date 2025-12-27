// src/components/owner/AddCarModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { BRANDS, CITIES } from "../../data/mockData";
import "./AddCarModal.css";

function AddCarModal({ isOpen, onClose, onSave, carToEdit, ownerName }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    city: "",
    seats: "",
    fuel: "",
    gearbox: "",
    mainImage: "",
    images: [],
    description: "",
    latitude: "",
    longitude: ""
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (carToEdit) {
      setFormData({
        name: carToEdit.name || "",
        brand: carToEdit.brand || "",
        pricePerDay: carToEdit.pricePerDay || "",
        city: carToEdit.city || "",
        seats: carToEdit.seats || "",
        fuel: carToEdit.fuel || "",
        gearbox: carToEdit.gearbox || "",
        mainImage: carToEdit.mainImage || "",
        images: carToEdit.images || [],
        description: carToEdit.description || "",
        latitude: carToEdit.latitude || "",
        longitude: carToEdit.longitude || ""
      });
      if (carToEdit.images && carToEdit.images.length > 0) {
        setImagePreviews(carToEdit.images);
      }
    } else {
      // Reset form for new car
      setFormData({
        name: "",
        brand: "",
        pricePerDay: "",
        city: "",
        seats: "",
        fuel: "",
        gearbox: "",
        mainImage: "",
        images: [],
        description: "",
        latitude: "",
        longitude: ""
      });
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [carToEdit, isOpen]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (imagePreviews.length === 0) {
          // First image is main image
          setFormData(prev => ({ ...prev, mainImage: base64String }));
        }
        setImagePreviews(prev => [...prev, base64String]);
        setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newImages }));
    if (index === 0 && newPreviews.length > 0) {
      setFormData(prev => ({ ...prev, mainImage: newPreviews[0] }));
    } else if (newPreviews.length === 0) {
      setFormData(prev => ({ ...prev, mainImage: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.pricePerDay || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }

    const carData = {
      ...formData,
      id: carToEdit ? carToEdit.id : Date.now(),
      owner: ownerName,
      availability: carToEdit?.availability || "available", // Keep existing availability or default to available
      pricePerDay: Number(formData.pricePerDay),
      seats: Number(formData.seats) || 5,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined
    };

    onSave(carData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white dark:bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/30 dark:border-purple-800/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto add-car-modal"
        >
          <div className="sticky top-0 bg-white/90 dark:bg-indigo-950/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-purple-800/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {carToEdit ? "Edit Car" : "Add New Car"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Car Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Brand *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Price per Day (MAD) *
                </label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Seats
                </label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  max="9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Fuel Type
                </label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuel: e.target.value }))}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Transmission
                </label>
                <select
                  value={formData.gearbox}
                  onChange={(e) => setFormData(prev => ({ ...prev, gearbox: e.target.value }))}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Car Images
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-xs text-center py-1">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <Upload className="w-5 h-5 mr-2 text-gray-600 dark:text-white" />
                <span className="text-sm text-gray-600 dark:text-white">Upload Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-semibold"
              >
                {carToEdit ? "Update Car" : "Add Car"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AddCarModal;

