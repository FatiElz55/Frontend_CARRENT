package com.distributed.rmi.service;

import com.distributed.rmi.model.User;
import com.distributed.rmi.model.Car;
import com.distributed.rmi.model.Reservation;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

/**
 * Remote interface for Car Rental Service (RMI Client side)
 * Must match the server-side interface exactly
 */
public interface CarRentalService extends Remote {
    
    // User operations
    User registerUser(User user) throws RemoteException;
    User authenticateUser(String email, String password) throws RemoteException;
    User getUserById(Long userId) throws RemoteException;
    User updateUser(User user) throws RemoteException;
    boolean changePassword(Long userId, String currentPassword, String newPassword) throws RemoteException;
    List<User> getAllUsers() throws RemoteException;
    
    // Car operations
    List<Car> getAllCars() throws RemoteException;
    Car getCarById(Long carId) throws RemoteException;
    Car addCar(Car car) throws RemoteException;
    Car updateCar(Car car) throws RemoteException;
    boolean deleteCar(Long carId) throws RemoteException;
    List<Car> searchCars(String brand, String city, String availability) throws RemoteException;
    List<Car> getCarsByOwner(Long ownerId) throws RemoteException;
    
    // Reservation operations
    Reservation createReservation(Reservation reservation) throws RemoteException;
    Reservation getReservationById(Long reservationId) throws RemoteException;
    List<Reservation> getReservationsByUser(Long userId) throws RemoteException;
    List<Reservation> getReservationsByCar(Long carId) throws RemoteException;
    boolean cancelReservation(Long reservationId) throws RemoteException;
    Reservation updateReservation(Reservation reservation) throws RemoteException;
    List<Reservation> getAllReservations() throws RemoteException;
}

