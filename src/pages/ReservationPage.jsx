import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Calendar, Clock, MapPin, CreditCard, 
  CheckCircle2, User, Phone, Mail, Shield,
  ChevronRight, ShieldCheck, Lock, Receipt,
  Navigation, Wifi, Baby, Package,
  Wallet, Smartphone, Home, Tag, ChevronDown
} from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CARS } from "../data/mockData";
import toast from "react-hot-toast";

// Separate component for summary
const ReservationSummary = ({ car, formData, days, totalPrice, step }) => {
  const insuranceCost = { basic: 50, premium: 100, full: 200 }[formData.insurance] || 0;
  const extrasCost = { gps: 25, wifi: 40, babySeat: 30, delivery: 150 };
  const extrasTotal = formData.extras.reduce((sum, extra) => sum + (extrasCost[extra] || 0), 0);
  const subTotal = days * (typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0);

  const extrasOptions = {
    gps: { label: "Premium GPS", price: 25 },
    wifi: { label: "Mobile WiFi", price: 40 },
    babySeat: { label: "Child Seat", price: 30 },
    delivery: { label: "Delivery", price: 150 }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-indigo-950/40 rounded-2xl shadow-sm border border-gray-200 dark:border-purple-800/30 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-purple-800/30">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reservation</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Step {step} of 3</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Vehicle */}
          <div className="flex items-center gap-4">
             <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              <img 
                src={car.mainImage} 
                alt={car.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-gray-900 dark:text-white truncate">{car.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <Tag className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                 <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{car.brand} • {car.city}</p>
              </div>
            </div>
          </div>
          
          {/* Price details */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Rental */}
              <div className="flex justify-between items-center">
                <div>
                   <p className="text-sm font-medium text-gray-900 dark:text-white">{typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0} MAD/day</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">{days || 0} day{days !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              {/* Insurance */}
              {formData.insurance && insuranceCost > 0 && (
                <div className="flex justify-between items-center">
                  <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-white">Insurance</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{formData.insurance}</p>
                  </div>
                   <p className="font-semibold text-indigo-600 dark:text-purple-400">+{insuranceCost} MAD</p>
                </div>
              )}
              
              {/* Options */}
              {formData.extras.length > 0 && (
                 <div className="border-t border-gray-100 dark:border-purple-800/30 pt-3">
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Additional options</p>
                  {formData.extras.map(extraId => {
                    const extra = extrasOptions[extraId];
                    if (!extra) return null;
                    return (
                      <div key={extraId} className="flex justify-between items-center text-sm mb-2">
                         <span className="text-gray-700 dark:text-gray-300">{extra.label}</span>
                         <span className="font-medium text-indigo-600 dark:text-purple-400">+{extra.price} MAD</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Total */}
             <div className="border-t border-gray-200 dark:border-purple-800/30 pt-4">
              <div className="flex justify-between items-center">
                <div>
                   <p className="font-bold text-gray-900 dark:text-white">Total</p>
                  {days > 0 && (
                     <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(totalPrice / days)} MAD/day average
                    </p>
                  )}
                </div>
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                   className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {totalPrice} MAD
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

// Component for steps
const StepIndicator = ({ steps, currentStep, onStepClick, isSubmitting }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex items-center">
              <motion.button
                onClick={() => !isSubmitting && onStepClick(step.number)}
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-purple-800/30 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-purple-500/50"
                    : isCompleted
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-purple-800 dark:text-gray-300 hover:text-purple-900 dark:hover:text-white"
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : isCompleted
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600/40"
                      : "bg-purple-800/20 dark:bg-gray-800 text-purple-800 dark:text-gray-300 border border-purple-800/30 dark:border-gray-700"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  )}
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] sm:text-xs font-semibold">Step {step.number}</span>
                  <span className="text-xs sm:text-sm font-semibold">{step.title}</span>
                </div>
              </motion.button>
              {index < steps.length - 1 && (
                <div className="w-4 sm:w-6 md:w-12 lg:w-16 h-px bg-purple-900/50 mx-1 sm:mx-2 md:mx-3 lg:mx-4"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component for individual steps
const StepContent = ({ step, formData, onFormChange, onToggleExtra, days, subTotal, blockedDates, setFormData, blockedDateWarning, setBlockedDateWarning }) => {
  const extrasOptions = [
    { id: "gps", label: "Premium GPS", price: 25, icon: Navigation },
    { id: "wifi", label: "Mobile WiFi", price: 40, icon: Wifi },
    { id: "babySeat", label: "Child Seat", price: 30, icon: Baby },
    { id: "delivery", label: "Home Delivery", price: 150, icon: Home }
  ];

  const insuranceOptions = [
    { id: "basic", label: "Basic", price: 50, desc: "Civil liability protection" },
    { id: "premium", label: "Premium", price: 100, desc: "Collision + Theft + Assistance" },
    { id: "full", label: "Full Coverage", price: 200, desc: "Complete coverage" }
  ];

  switch (step) {
    case 1:
      return (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select Dates</h2>
            <p className="text-gray-600 dark:text-gray-300">Choose your desired rental period</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-gray-400" />
                <span>Start Date</span>
              </label>
              <DatePicker
                selected={formData.startDate ? new Date(formData.startDate + 'T00:00:00') : null}
                onChange={(date) => {
                  if (!date) {
                    setFormData(prev => ({ ...prev, startDate: "" }));
                    setBlockedDateWarning('');
                    return;
                  }
                  
                  // Use local date components to avoid timezone shift
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const selectedDate = `${year}-${month}-${day}`;
                  
                  console.log('DatePicker date object:', date);
                  console.log('Start date selected:', selectedDate);
                  console.log('Blocked dates:', blockedDates);
                  console.log('Is blocked?', blockedDates.includes(selectedDate));
                  
                  // Check if selected date is blocked (shouldn't happen with excludeDates, but double-check)
                  if (blockedDates.includes(selectedDate)) {
                    console.warn(`Date ${selectedDate} is blocked!`);
                    toast.error("This date is already booked. Please choose another date.");
                    setBlockedDateWarning("⚠️ This date is already booked. Please select a different date.");
                    setFormData(prev => ({ ...prev, startDate: "" }));
                    return;
                  }
                  
                  // Clear warning if date is valid
                  setBlockedDateWarning('');
                  setFormData(prev => ({ ...prev, startDate: selectedDate }));
                  
                  // Clear end date if it's before the new start date
                  if (formData.endDate && formData.endDate < selectedDate) {
                    setFormData(prev => ({ ...prev, endDate: "" }));
                  }
                }}
                excludeDates={blockedDates.map(dateStr => {
                  const [year, month, day] = dateStr.split('-').map(Number);
                  return new Date(year, month - 1, day);
                })}
                minDate={new Date()}
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                wrapperClassName="w-full"
              />
              {blockedDateWarning && blockedDateWarning.includes('Start') ? (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                  {blockedDateWarning}
                </p>
              ) : blockedDates.length > 0 && !formData.startDate ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Note: Some dates are already booked and cannot be selected
                </p>
              ) : null}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-gray-400" />
                <span>End Date</span>
              </label>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate + 'T00:00:00') : null}
                onChange={(date) => {
                  if (!date) {
                    setFormData(prev => ({ ...prev, endDate: "" }));
                    setBlockedDateWarning('');
                    return;
                  }
                  
                  if (!formData.startDate) {
                    toast.error("Please select start date first");
                    return;
                  }
                  
                  // Use local date components to avoid timezone shift
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const selectedEndDate = `${year}-${month}-${day}`;
                  
                  // Check if selected date is blocked (shouldn't happen with excludeDates, but double-check)
                  if (blockedDates.includes(selectedEndDate)) {
                    toast.error("This date is already booked. Please choose another date.");
                    setBlockedDateWarning("⚠️ End date is already booked. Please select a different date.");
                    setFormData(prev => ({ ...prev, endDate: "" }));
                    return;
                  }
                  
                  const start = new Date(formData.startDate);
                  const end = new Date(selectedEndDate);
                  
                  // Reset times to avoid timezone issues
                  start.setHours(0, 0, 0, 0);
                  end.setHours(0, 0, 0, 0);
                  
                  // Check all dates in the selected range
                  const selectedDates = new Set();
                  const currentDate = new Date(start);
                  while (currentDate <= end) {
                    const dateString = currentDate.toISOString().split('T')[0];
                    selectedDates.add(dateString);
                    currentDate.setDate(currentDate.getDate() + 1);
                  }
                  
                  // Check for blocked dates in range
                  const blockedInRange = blockedDates.filter(blocked => selectedDates.has(blocked));
                  if (blockedInRange.length > 0) {
                    toast.error(`The following dates are already booked: ${blockedInRange.join(', ')}. Please choose different dates.`);
                    setBlockedDateWarning(`⚠️ Dates ${blockedInRange.join(', ')} are already booked. Please select different dates.`);
                    setFormData(prev => ({ ...prev, endDate: "" }));
                    return;
                  }
                  
                  // Clear warning if range is valid
                  setBlockedDateWarning('');
                  setFormData(prev => ({ ...prev, endDate: selectedEndDate }));
                }}
                excludeDates={blockedDates.map(dateStr => {
                  const [year, month, day] = dateStr.split('-').map(Number);
                  return new Date(year, month - 1, day);
                })}
                minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                wrapperClassName="w-full"
              />
              {blockedDateWarning && (blockedDateWarning.includes('End') || blockedDateWarning.includes('Dates')) && formData.endDate ? (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                  {blockedDateWarning}
                </p>
              ) : null}
            </div>
          </div>
          
          {days > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-5 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/80 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">{days} day{days !== 1 ? 's' : ''} selected</p>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400">
                      From {new Date(formData.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                      {' '}to {new Date(formData.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{subTotal} MAD</p>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-400">Rental cost</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      );

    case 2:
      return (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Additional Options</h2>
            <p className="text-gray-600 dark:text-gray-300">Customize your rental experience</p>
          </div>
          
          {/* Insurance */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance Protection</h3>
            </div>
            
            <div className="space-y-4">
              {insuranceOptions.map((option) => {
                const isSelected = formData.insurance === option.id;
                
                return (
                  <label
                    key={option.id}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 dark:border-purple-500 bg-indigo-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-purple-800/50 hover:border-gray-400 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                          isSelected ? 'border-indigo-500 dark:border-purple-500 bg-indigo-500 dark:bg-purple-600' : 'border-gray-400 dark:border-gray-600'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">{option.label}</span>
                            <span className="text-lg font-bold text-indigo-600 dark:text-purple-400">+{option.price} MAD</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{option.desc}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="insurance"
                        value={option.id}
                        checked={isSelected}
                        onChange={onFormChange}
                        className="sr-only"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* Additional Services */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Services</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {extrasOptions.map((extra) => {
                const Icon = extra.icon;
                const isSelected = formData.extras.includes(extra.id);
                
                return (
                  <label
                    key={extra.id}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-purple-800/50 hover:border-gray-400 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{extra.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+{extra.price} MAD</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-purple-500 dark:border-purple-500 bg-purple-500 dark:bg-purple-600' : 'border-gray-400 dark:border-gray-600'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleExtra(extra.id)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </motion.div>
      );

    case 3:
      return (
        <motion.div
          key="step3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300">Provide your details to finalize the booking</p>
          </div>
          
          <div className="space-y-6">
            {/* First and last name */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onFormChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                    placeholder="Your first name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onFormChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                placeholder="example@email.com"
              />
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Phone Number</span>
              </label>
              <div className="relative rounded-lg border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 focus-within:border-indigo-500 dark:focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-indigo-200 dark:focus-within:ring-purple-800/50 transition-colors overflow-visible">
                <PhoneInput
                  defaultCountry="ma"
                  value={formData.phone}
                  onChange={(phone) => onFormChange({ target: { name: "phone", value: phone } })}
                  hideDropdown={false}
                  disableDialCodePrefill={false}
                  className="w-full !text-base"
                  inputClassName="!w-full !h-12 !pl-3 !pr-4 !bg-transparent !text-base !font-normal !text-gray-900 dark:!text-white !placeholder-gray-400 dark:!placeholder-gray-400 !border-0 !shadow-none !focus:ring-0 !focus:border-0"
                  countrySelectorStyleProps={{
                    buttonClassName: "!h-12 !min-w-[60px] !px-3 !rounded-l-lg !border-r !border-gray-300 dark:!border-purple-800/50 !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600",
                    dropdownStyle: { 
                      zIndex: 60,
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      border: "1px solid rgba(17, 24, 39, 0.12)",
                      borderRadius: "16px",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.12)"
                    }
                  }}
                  dropdownClassName="!bg-white !text-gray-900 !border !border-gray-200 !shadow-2xl !mt-3 !rounded-2xl dark:!bg-[#1f2430] dark:!text-white dark:!border-purple-800/60"
                  inputProps={{ autoComplete: "tel" }}
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>Payment Method</span>
              </label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={onFormChange}
                  className="w-full appearance-none pr-12 pl-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                >
                  <option value="card">Credit Card</option>
                  <option value="cash">Cash Payment</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
              </div>
            </div>

            {/* Credit Card Fields - Show only when Credit Card is selected */}
            {formData.paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 mt-4"
              >
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Card Number</span>
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber || ""}
                    onChange={onFormChange}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                    required={formData.paymentMethod === "card"}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Cardholder Name</span>
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName || ""}
                    onChange={onFormChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                    required={formData.paymentMethod === "card"}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Expiry Date</span>
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry || ""}
                      onChange={onFormChange}
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                      required={formData.paymentMethod === "card"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>CVV</span>
                    </label>
                    <input
                      type="text"
                      name="cardCVV"
                      value={formData.cardCVV || ""}
                      onChange={onFormChange}
                      maxLength={4}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-purple-800/50 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-800/50 outline-none transition-colors"
                      required={formData.paymentMethod === "card"}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};

export default function ReservationPage({ isEmbedded = false, carId: propCarId }) {
  const { carId: paramCarId } = useParams();
  const carId = propCarId || paramCarId; // Use prop if embedded, otherwise use param
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]); // Array of date strings that are already booked
  const [blockedDateWarning, setBlockedDateWarning] = useState(''); // Warning message for blocked dates
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "card",
    cardNumber: "",
    cardholderName: "",
    cardExpiry: "",
    cardCVV: "",
    insurance: "", // DO NOT pre-select insurance
    extras: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Load car data from API and blocked dates
  useEffect(() => {
    const loadCar = async () => {
      try {
        const { carAPI, reservationAPI } = await import('../services/api');
        const response = await carAPI.getCarById(carId);
        
        // Map API response to frontend format
        const apiCar = response.data;
        
        // Check if current user is the owner of this car
        const currentUser = localStorage.getItem("carrent_current_user");
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            // Convert both to numbers for comparison
            const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
            const ownerId = typeof apiCar.ownerId === 'string' ? parseInt(apiCar.ownerId) : apiCar.ownerId;
            
            if (userId === ownerId) {
              toast.error("You cannot book your own car!");
              if (!isEmbedded) {
                navigate("/catalogue");
                return;
              } else {
                // If embedded in owner page, prevent further loading
                return;
              }
            }
          } catch (err) {
            console.error('Error checking owner:', err);
          }
        }
        
        const mappedCar = {
          id: apiCar.id,
          name: apiCar.name,
          brand: apiCar.brand,
          pricePerDay: typeof apiCar.pricePerDay === 'number' ? apiCar.pricePerDay : parseFloat(apiCar.pricePerDay) || 0,
          city: apiCar.city,
          availability: apiCar.availability,
          owner: apiCar.ownerName,
          ownerId: apiCar.ownerId,
          mainImage: apiCar.mainImageUrl || '',
          images: apiCar.imagesUrl || [],
          seats: apiCar.seats,
          fuel: apiCar.fuelType,
          gearbox: apiCar.gearbox,
          latitude: apiCar.latitude,
          longitude: apiCar.longitude
        };
        
        setCar(mappedCar);
        
        // Load existing reservations to block those dates
        try {
          console.log('Fetching reservations for car ID:', carId);
          const reservationsResponse = await reservationAPI.getReservationsByCar(carId);
          console.log('API Response:', reservationsResponse);
          const reservations = reservationsResponse.data || [];
          
          // Get all dates that are booked (only confirmed reservations block dates)
          const bookedDates = new Set();
          console.log('Total reservations found in database:', reservations.length);
          console.log('All reservations:', JSON.stringify(reservations, null, 2));
          
          if (reservations.length === 0) {
            console.log('No reservations found for this car - all dates available');
          }
          
          reservations.forEach((reservation, index) => {
            console.log(`\n=== Processing Reservation ${index + 1}/${reservations.length} ===`);
            console.log('Reservation ID:', reservation.id);
            console.log('Reservation Status:', reservation.status, '(type:', typeof reservation.status, ')');
            console.log('Start Date:', reservation.startDate, '(type:', typeof reservation.startDate, ')');
            console.log('End Date:', reservation.endDate, '(type:', typeof reservation.endDate, ')');
            
            // Only block CONFIRMED reservations - pending ones don't block dates
            // Explicitly check for 'confirmed' status (not null, not undefined, not empty string)
            const status = (reservation.status || '').toLowerCase().trim();
            console.log('Normalized status:', status, '(will block:', status === 'confirmed', ')');
            
            if (status === 'confirmed') {
              // Handle both Date objects and date strings
              // IMPORTANT: Parse dates in UTC to avoid timezone shifting issues
              let start, end;
              
              if (reservation.startDate instanceof Date) {
                // If it's already a Date object, use it directly
                start = new Date(reservation.startDate);
              } else if (typeof reservation.startDate === 'string') {
                // Handle ISO strings (with time) and date-only strings (YYYY-MM-DD)
                if (reservation.startDate.includes('T')) {
                  // ISO string with time (e.g., "2026-01-06T23:00:00.000Z")
                  // When Java serializes java.sql.Date, it may shift by timezone
                  // Parse the timestamp and check the date - if it's late in the day UTC
                  // but represents the next day, we need to adjust
                  const dateObj = new Date(reservation.startDate);
                  let year = dateObj.getUTCFullYear();
                  let month = dateObj.getUTCMonth();
                  let day = dateObj.getUTCDate();
                  let hours = dateObj.getUTCHours();
                  
                  // If the UTC timestamp is late in the day (23:00+) but the date in DB
                  // is the next day, the backend timezone is ahead of UTC
                  // For now, use the UTC date components as-is since java.sql.Date
                  // should represent midnight UTC of the stored date
                  // But if hours >= 20, it might represent the next day
                  if (hours >= 20) {
                    // Likely represents next day due to timezone shift
                    const nextDay = new Date(Date.UTC(year, month, day + 1));
                    year = nextDay.getUTCFullYear();
                    month = nextDay.getUTCMonth();
                    day = nextDay.getUTCDate();
                  }
                  
                  start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                  console.log(`  Timestamp "${reservation.startDate}" parsed as UTC date: ${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} (hours was ${hours})`);
                } else {
                  // Date-only string (YYYY-MM-DD): parse directly
                  const [year, month, day] = reservation.startDate.split('-').map(Number);
                  start = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
                }
              } else {
                start = new Date(reservation.startDate);
              }
              
              if (reservation.endDate instanceof Date) {
                end = new Date(reservation.endDate);
              } else if (typeof reservation.endDate === 'string') {
                if (reservation.endDate.includes('T')) {
                  // ISO string with time
                  const dateObj = new Date(reservation.endDate);
                  let year = dateObj.getUTCFullYear();
                  let month = dateObj.getUTCMonth();
                  let day = dateObj.getUTCDate();
                  let hours = dateObj.getUTCHours();
                  
                  // Same adjustment as start date
                  if (hours >= 20) {
                    const nextDay = new Date(Date.UTC(year, month, day + 1));
                    year = nextDay.getUTCFullYear();
                    month = nextDay.getUTCMonth();
                    day = nextDay.getUTCDate();
                  }
                  
                  end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
                  console.log(`  Timestamp "${reservation.endDate}" parsed as UTC date: ${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} (hours was ${hours})`);
                } else {
                  // Date-only string (YYYY-MM-DD): parse directly
                  const [year, month, day] = reservation.endDate.split('-').map(Number);
                  end = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
                }
              } else {
                end = new Date(reservation.endDate);
              }
              
              // Use UTC methods to extract date components consistently
              // This ensures we get the correct date regardless of timezone
              const datesAdded = [];
              const currentDate = new Date(start);
              const endDate = new Date(end);
              
              // Extract UTC date components from start and end for logging
              const startYear = start.getUTCFullYear();
              const startMonth = String(start.getUTCMonth() + 1).padStart(2, '0');
              const startDay = String(start.getUTCDate()).padStart(2, '0');
              const startDateStr = `${startYear}-${startMonth}-${startDay}`;
              
              const endYear = end.getUTCFullYear();
              const endMonth = String(end.getUTCMonth() + 1).padStart(2, '0');
              const endDay = String(end.getUTCDate()).padStart(2, '0');
              const endDateStr = `${endYear}-${endMonth}-${endDay}`;
              
              console.log(`  Parsed dates - Start: ${startDateStr}, End: ${endDateStr}`);
              
              while (currentDate <= endDate) {
                // Format as YYYY-MM-DD using UTC components to avoid timezone issues
                const year = currentDate.getUTCFullYear();
                const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getUTCDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;
                datesAdded.push(dateString);
                bookedDates.add(dateString);
                
                // Move to next day using UTC methods
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
              }
              
              console.log(`✓ Added ${datesAdded.length} blocked dates for reservation ${reservation.id}:`, datesAdded);
              console.log(`  Date range: ${startDateStr} to ${endDateStr}`);
            } else {
              console.log(`✗ Skipping reservation ${reservation.id} - status is "${reservation.status || 'null/undefined'}" (not confirmed)`);
            }
          });
          
          const finalBlockedDates = Array.from(bookedDates).sort();
          console.log('\n=== FINAL BLOCKED DATES ===');
          console.log('Total blocked dates:', finalBlockedDates.length);
          console.log('Blocked dates array:', finalBlockedDates);
          setBlockedDates(finalBlockedDates);
        } catch (err) {
          console.error('Error loading reservations:', err);
          setBlockedDates([]);
        }
        
        // Pre-fill personal information from localStorage if available
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            setFormData(prev => ({
              ...prev,
              firstName: user.name ? user.name.split(' ')[0] : '',
              lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
              email: user.email || ''
            }));
          } catch (err) {
            // Use defaults if parsing fails
          }
        }
      } catch (error) {
        console.error('Error loading car:', error);
        toast.error("Vehicle not found");
        if (!isEmbedded) {
          navigate("/catalogue");
        }
      }
    };
    
    if (carId) {
      loadCar();
    }
  }, [carId, navigate, isEmbedded]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (step < 3) {
      // Validate current step
      if (step === 1 && (!formData.startDate || !formData.endDate)) {
        toast.error("Please select rental dates");
        return;
      }
      
      if (step === 2 && !formData.insurance) {
        toast.error("Please choose an insurance option");
        return;
      }

      // Move to next step (no validation needed here for step 3 fields)
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Final validation before submission (step 3)
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all contact information fields");
      return;
    }
    
    // Validate phone number format
    const parsedPhone = parsePhoneNumberFromString(formData.phone || "");
    if (!parsedPhone || !parsedPhone.isValid()) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Validate insurance was selected
    if (!formData.insurance) {
      toast.error("Please choose an insurance option");
      return;
    }
    
    // Check if user is trying to book their own car
    const currentUser = localStorage.getItem("carrent_current_user");
    if (currentUser && car) {
      try {
        const user = JSON.parse(currentUser);
        const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        const ownerId = typeof car.ownerId === 'string' ? parseInt(car.ownerId) : car.ownerId;
        
        if (userId === ownerId) {
          toast.error("You cannot book your own car!");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        console.error('Error checking owner:', err);
      }
    }
    
    // Check if selected dates overlap with blocked dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const selectedDates = new Set();
      
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        selectedDates.add(dateString);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check for overlap
      const hasOverlap = blockedDates.some(blockedDate => selectedDates.has(blockedDate));
      if (hasOverlap) {
        toast.error("Some selected dates are already booked. Please choose different dates.");
        setIsSubmitting(false);
        return;
      }
    }
    
    // Validate credit card fields if payment method is card
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardholderName || !formData.cardExpiry || !formData.cardCVV) {
        toast.error("Please fill in all credit card details");
        return;
      }
      // Basic card number validation (should be 13-19 digits)
      const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
      if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
        toast.error("Please enter a valid card number");
        return;
      }
      // Basic expiry validation (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return;
      }
      // CVV validation (3-4 digits)
      if (formData.cardCVV.length < 3 || formData.cardCVV.length > 4) {
        toast.error("Please enter a valid CVV");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const currentUser = localStorage.getItem("carrent_current_user");
      if (!currentUser) {
        toast.error("Please log in to make a reservation");
        setIsSubmitting(false);
        return;
      }

      const user = JSON.parse(currentUser);
      
      // Format phone number before sending
      const parsedPhone = parsePhoneNumberFromString(formData.phone || "");
      const formattedPhone = parsedPhone && parsedPhone.isValid() 
        ? parsedPhone.formatInternational() 
        : formData.phone;

      // Create reservation via API
      const { reservationAPI } = await import('../services/api');
      
      // Ensure dates are in YYYY-MM-DD format (they should already be from DatePicker)
      const startDateStr = formData.startDate; // Already in YYYY-MM-DD format
      const endDateStr = formData.endDate; // Already in YYYY-MM-DD format
      
      console.log('Creating reservation with dates:', {
        startDate: startDateStr,
        endDate: endDateStr,
        carId: car.id,
        userId: user.id,
        blockedDates: blockedDates
      });
      
      const reservationData = {
        userId: user.id,
        carId: car.id,
        startDate: startDateStr,
        endDate: endDateStr,
        days: days,
        insuranceType: formData.insurance || 'basic',
        extras: formData.extras || [],
        totalPrice: totalPrice,
        status: 'pending'
      };

      try {
        console.log('Sending reservation data to API:', JSON.stringify(reservationData, null, 2));
        await reservationAPI.createReservation(reservationData);
        
        toast.success(
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="font-semibold">Booking request submitted!</p>
              <p className="text-sm opacity-90">Waiting for owner approval. You'll be notified once approved.</p>
            </div>
          </div>,
          { duration: 4000 }
        );
        
        // Redirect after success
        setTimeout(() => {
          setIsSubmitting(false);
          if (isEmbedded) {
            // If embedded, switch to bookings tab in owner page
            const currentUser = localStorage.getItem("carrent_current_user");
            if (currentUser) {
              try {
                const user = JSON.parse(currentUser);
                if (user.role === "owner" || user.role === "OWNER") {
                  if (user.id) {
                    localStorage.setItem(`carrent_owner_active_tab_${user.id}`, "bookings");
                  }
                  window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "bookings" }));
                }
              } catch (err) {
                // Fall through to regular navigation
              }
            }
          } else {
            navigate("/bookings");
          }
        }, 1500);
      } catch (error) {
        console.error('Error creating reservation:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Extract the actual error message from the nested exception if present
        let errorMessage = error.response?.data?.message || error.message || 'Failed to create reservation';
        
        // Handle nested RemoteException messages
        if (typeof errorMessage === 'string' && errorMessage.includes('RemoteException')) {
          // Try to extract the inner message
          const match = errorMessage.match(/java\.rmi\.RemoteException:\s*(.+?)(?:\n|$)/);
          if (match && match[1]) {
            errorMessage = match[1].trim();
          }
        }
        
        toast.error(`Error: ${errorMessage}`);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
      toast.error(err.response?.data?.message || "Error creating reservation. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\s/g, "");
      formattedValue = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    }
    
    // Format expiry date as MM/YY
    if (name === "cardExpiry") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length >= 2) {
        formattedValue = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2, 4);
      } else {
        formattedValue = digitsOnly;
      }
    }
    
    // Only allow digits for CVV
    if (name === "cardCVV") {
      formattedValue = value.replace(/\D/g, "");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const toggleExtra = (extra) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter(e => e !== extra)
        : [...prev.extras, extra]
    }));
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (isEmbedded) {
        // If embedded, go back to catalogue (home tab)
        const currentUser = localStorage.getItem("carrent_current_user");
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            if (user.role === "owner" || user.role === "OWNER") {
              if (user.id) {
                localStorage.setItem(`carrent_owner_active_tab_${user.id}`, "home");
              }
              window.dispatchEvent(new CustomEvent("owner-tab-change", { detail: "home" }));
            }
          } catch (err) {
            // Fall through to regular navigation
          }
        }
      } else {
        navigate(-1);
      }
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculations
  const days = formData.startDate && formData.endDate
    ? Math.max(
        1,
        Math.ceil(
          (new Date(formData.endDate).setHours(0, 0, 0, 0) -
            new Date(formData.startDate).setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;
  
  // Ensure pricePerDay is a number for calculations
  const carPricePerDay = car ? (typeof car.pricePerDay === 'number' ? car.pricePerDay : parseFloat(car.pricePerDay) || 0) : 0;
  
  const insuranceCost = { basic: 50, premium: 100, full: 200 }[formData.insurance] || 0;
  const extrasCost = { gps: 25, wifi: 40, babySeat: 30, delivery: 150 };
  const extrasTotal = formData.extras.reduce((sum, extra) => sum + (extrasCost[extra] || 0), 0);
  const subTotal = days * carPricePerDay;
  const totalPrice = subTotal + insuranceCost + extrasTotal;

  const steps = [
    { number: 1, title: "Dates", icon: Calendar },
    { number: 2, title: "Options", icon: Package },
    { number: 3, title: "Payment", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a0f24] transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-indigo-950/40 border-b border-gray-200 dark:border-purple-800/30 shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-center">
              <StepIndicator 
                steps={steps} 
                currentStep={step} 
                onStepClick={handleStepClick}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
           <div className="md:col-span-2 space-y-8">
            {/* Step form */}
            <form onSubmit={handleSubmit}>
              <StepContent 
                step={step}
                formData={formData}
                onFormChange={handleFormChange}
                onToggleExtra={toggleExtra}
                days={days}
                subTotal={subTotal}
                blockedDates={blockedDates}
                setFormData={setFormData}
                blockedDateWarning={blockedDateWarning}
                setBlockedDateWarning={setBlockedDateWarning}
              />
            </form>

            {/* Actions */}
            <div className="bg-white dark:bg-indigo-950/40 rounded-2xl border border-gray-200 dark:border-purple-800/30 p-6 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-3">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="px-6 py-3 border border-gray-300 dark:border-purple-800/50 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50"
                  >
                    Previous
                  </motion.button>
                )}
                
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || 
                    (step === 1 && (!formData.startDate || !formData.endDate)) ||
                    (step === 2 && !formData.insurance)
                  }
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-indigo-500 dark:bg-purple-600 cursor-wait'
                      : 'bg-indigo-600 dark:bg-purple-600 hover:bg-indigo-700 dark:hover:bg-purple-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : step < 3 ? (
                    <>
                      <span>Continue to step {step + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Finalize booking</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="md:col-span-1">
            <ReservationSummary 
              car={car}
              formData={formData}
              days={days}
              totalPrice={totalPrice}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}