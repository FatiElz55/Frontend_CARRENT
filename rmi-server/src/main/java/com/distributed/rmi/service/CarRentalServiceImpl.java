package com.distributed.rmi.service;

import com.distributed.rmi.dao.UserDAO;
import com.distributed.rmi.dao.CarDAO;
import com.distributed.rmi.dao.ReservationDAO;
import com.distributed.rmi.model.User;
import com.distributed.rmi.model.Car;
import com.distributed.rmi.model.Reservation;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CarRentalServiceImpl extends UnicastRemoteObject implements CarRentalService {
    private static final long serialVersionUID = 1L;
    
    private final UserDAO userDAO;
    private final CarDAO carDAO;
    private final ReservationDAO reservationDAO;
    
    public CarRentalServiceImpl() throws RemoteException {
        super();
        this.userDAO = new UserDAO();
        this.carDAO = new CarDAO();
        this.reservationDAO = new ReservationDAO();
    }
    
    // User operations
    @Override
    public User registerUser(User user) throws RemoteException {
        try {
            // Check if user already exists
            User existing = userDAO.findByEmail(user.getEmail());
            if (existing != null) {
                throw new RemoteException("User with email " + user.getEmail() + " already exists");
            }
            return userDAO.create(user);
        } catch (SQLException e) {
            throw new RemoteException("Error registering user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User authenticateUser(String email, String password) throws RemoteException {
        try {
            User user = userDAO.findByEmail(email);
            if (user == null) {
                throw new RemoteException("User not found with email: " + email);
            }
            if (!user.getPassword().equals(password)) {
                throw new RemoteException("Invalid password");
            }
            return user;
        } catch (SQLException e) {
            throw new RemoteException("Error authenticating user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User getUserById(Long userId) throws RemoteException {
        try {
            if (userId == null) {
                throw new RemoteException("User ID cannot be null");
            }
            User user = userDAO.findById(userId);
            if (user == null) {
                throw new RemoteException("User not found with id: " + userId);
            }
            return user;
        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            throw new RemoteException("Error getting user: " + e.getMessage(), e);
        } catch (Exception e) {
            e.printStackTrace(); // Log any other exceptions
            throw new RemoteException("Unexpected error getting user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User updateUser(User user) throws RemoteException {
        try {
            if (user.getId() == null) {
                throw new RemoteException("User ID is required for update");
            }
            return userDAO.update(user);
        } catch (SQLException e) {
            throw new RemoteException("Error updating user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean changePassword(Long userId, String currentPassword, String newPassword) throws RemoteException {
        try {
            User user = userDAO.findById(userId);
            if (user == null) {
                throw new RemoteException("User not found with id: " + userId);
            }
            
            // Verify current password
            if (!user.getPassword().equals(currentPassword)) {
                throw new RemoteException("Current password is incorrect");
            }
            
            // Update password
            user.setPassword(newPassword);
            userDAO.update(user);
            return true;
        } catch (SQLException e) {
            throw new RemoteException("Error changing password: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<User> getAllUsers() throws RemoteException {
        try {
            return userDAO.findAll();
        } catch (SQLException e) {
            throw new RemoteException("Error getting all users: " + e.getMessage(), e);
        }
    }
    
    // Car operations
    @Override
    public List<Car> getAllCars() throws RemoteException {
        try {
            return carDAO.findAll();
        } catch (SQLException e) {
            throw new RemoteException("Error getting all cars: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Car getCarById(Long carId) throws RemoteException {
        try {
            Car car = carDAO.findById(carId);
            if (car == null) {
                throw new RemoteException("Car not found with id: " + carId);
            }
            return car;
        } catch (SQLException e) {
            throw new RemoteException("Error getting car: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Car addCar(Car car) throws RemoteException {
        try {
            if (car.getOwnerId() == null) {
                throw new RemoteException("Owner ID is required");
            }
            // Normalize price to 2 decimal places
            if (car.getPricePerDay() != null) {
                car.setPricePerDay(car.getPricePerDay().setScale(2, java.math.RoundingMode.HALF_UP));
            }
            return carDAO.create(car);
        } catch (SQLException e) {
            throw new RemoteException("Error adding car: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Car updateCar(Car car) throws RemoteException {
        try {
            if (car.getId() == null) {
                throw new RemoteException("Car ID is required for update");
            }
            // Normalize price to 2 decimal places
            if (car.getPricePerDay() != null) {
                car.setPricePerDay(car.getPricePerDay().setScale(2, java.math.RoundingMode.HALF_UP));
            }
            return carDAO.update(car);
        } catch (SQLException e) {
            throw new RemoteException("Error updating car: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean deleteCar(Long carId) throws RemoteException {
        try {
            return carDAO.delete(carId);
        } catch (SQLException e) {
            throw new RemoteException("Error deleting car: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Car> searchCars(String brand, String city, String availability) throws RemoteException {
        try {
            return carDAO.search(brand, city, availability);
        } catch (SQLException e) {
            throw new RemoteException("Error searching cars: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Car> getCarsByOwner(Long ownerId) throws RemoteException {
        try {
            if (ownerId == null) {
                throw new RemoteException("Owner ID cannot be null");
            }
            List<Car> cars = carDAO.findByOwner(ownerId);
            return cars != null ? cars : new ArrayList<>();
        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception
            throw new RemoteException("Error getting cars by owner: " + e.getMessage(), e);
        } catch (Exception e) {
            e.printStackTrace(); // Log any other exceptions
            throw new RemoteException("Unexpected error getting cars by owner: " + e.getMessage(), e);
        }
    }
    
    // Reservation operations
    @Override
    public Reservation createReservation(Reservation reservation) throws RemoteException {
        try {
            if (reservation.getUserId() == null) {
                throw new RemoteException("User ID is required");
            }
            if (reservation.getCarId() == null) {
                throw new RemoteException("Car ID is required");
            }
            
            // Check if car exists
            Car car = carDAO.findById(reservation.getCarId());
            if (car == null) {
                throw new RemoteException("Car not found");
            }
            
            // Log car availability for debugging
            System.out.println("Creating reservation for car ID: " + reservation.getCarId() + 
                             ", Car availability: " + car.getAvailability() + 
                             ", Dates: " + reservation.getStartDate() + " to " + reservation.getEndDate());
            
            // IMPORTANT: Only block booking if car is in maintenance
            // "reserved" or "available" status should NOT block bookings - calendar handles date blocking
            // Cars should always be bookable unless in maintenance or dates are already confirmed
            // We removed the check for "reserved" status because availability is now dynamic
            String availability = car.getAvailability();
            if (availability != null && "maintenance".equalsIgnoreCase(availability.trim())) {
                throw new RemoteException("Car is currently in maintenance");
            }
            
            // Log that we're allowing the booking
            System.out.println("Car availability check passed: " + availability + " - allowing booking");
            
            // Check for overlapping CONFIRMED reservations only (pending reservations don't block)
            if (reservation.getStartDate() != null && reservation.getEndDate() != null) {
                System.out.println("Checking for overlapping confirmed reservations with dates: " + 
                                 reservation.getStartDate() + " to " + reservation.getEndDate());
                boolean hasOverlap = reservationDAO.hasConfirmedReservationOverlap(
                    reservation.getCarId(), 
                    reservation.getStartDate(), 
                    reservation.getEndDate()
                );
                System.out.println("Overlap check result: " + hasOverlap);
                if (hasOverlap) {
                    System.out.println("OVERLAP DETECTED - blocking reservation");
                    throw new RemoteException("Car is already reserved for the selected dates");
                }
                System.out.println("No overlap detected - proceeding with reservation");
            }
            
            // Calculate days if not set
            if (reservation.getDays() == null && reservation.getStartDate() != null && reservation.getEndDate() != null) {
                long diffInMillis = reservation.getEndDate().getTime() - reservation.getStartDate().getTime();
                long diffInDays = diffInMillis / (1000 * 60 * 60 * 24);
                reservation.setDays((int) diffInDays);
            }
            
            // Set status to pending if not set (requires owner approval)
            if (reservation.getStatus() == null || reservation.getStatus().isEmpty()) {
                reservation.setStatus("pending");
            }
            
            // Create reservation with pending status (don't update car availability - it's now dynamic)
            Reservation created = reservationDAO.create(reservation);
            
            System.out.println("Reservation created successfully with ID: " + created.getId() + ", Status: " + created.getStatus());
            return created;
        } catch (SQLException e) {
            System.err.println("SQL Error creating reservation: " + e.getMessage());
            e.printStackTrace();
            throw new RemoteException("Error creating reservation: " + e.getMessage(), e);
        } catch (RemoteException e) {
            // Re-throw RemoteException as-is (these are business logic errors)
            System.err.println("Business logic error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // Catch any other unexpected errors
            System.err.println("Unexpected error creating reservation: " + e.getMessage());
            e.printStackTrace();
            throw new RemoteException("Unexpected error creating reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Reservation getReservationById(Long reservationId) throws RemoteException {
        try {
            Reservation reservation = reservationDAO.findById(reservationId);
            if (reservation == null) {
                throw new RemoteException("Reservation not found with id: " + reservationId);
            }
            return reservation;
        } catch (SQLException e) {
            throw new RemoteException("Error getting reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Reservation> getReservationsByUser(Long userId) throws RemoteException {
        try {
            return reservationDAO.findByUserId(userId);
        } catch (SQLException e) {
            throw new RemoteException("Error getting reservations by user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Reservation> getReservationsByCar(Long carId) throws RemoteException {
        try {
            return reservationDAO.findByCarId(carId);
        } catch (SQLException e) {
            throw new RemoteException("Error getting reservations by car: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean cancelReservation(Long reservationId) throws RemoteException {
        try {
            Reservation reservation = reservationDAO.findById(reservationId);
            if (reservation == null) {
                throw new RemoteException("Reservation not found");
            }
            
            boolean cancelled = reservationDAO.cancel(reservationId);
            
            // Update car availability back to available
            if (cancelled) {
                Car car = carDAO.findById(reservation.getCarId());
                if (car != null) {
                    car.setAvailability("available");
                    carDAO.update(car);
                }
            }
            
            return cancelled;
        } catch (SQLException e) {
            throw new RemoteException("Error cancelling reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Reservation updateReservation(Reservation reservation) throws RemoteException {
        try {
            if (reservation.getId() == null) {
                throw new RemoteException("Reservation ID is required for update");
            }
            return reservationDAO.update(reservation);
        } catch (SQLException e) {
            throw new RemoteException("Error updating reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Reservation> getAllReservations() throws RemoteException {
        try {
            return reservationDAO.findAll();
        } catch (SQLException e) {
            throw new RemoteException("Error getting all reservations: " + e.getMessage(), e);
        }
    }
}

