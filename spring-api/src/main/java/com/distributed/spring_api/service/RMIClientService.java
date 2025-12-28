package com.distributed.spring_api.service;

import com.distributed.rmi.service.CarRentalService;
import com.distributed.rmi.model.User;
import com.distributed.rmi.model.Car;
import com.distributed.rmi.model.Reservation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.List;

@Service
public class RMIClientService {
    
    @Value("${rmi.server.host:localhost}")
    private String rmiServerHost;
    
    @Value("${rmi.server.port:1099}")
    private int rmiServerPort;
    
    @Value("${rmi.service.name:CarRentalService}")
    private String serviceName;
    
    private CarRentalService carRentalService;
    private Registry registry;
    
    @PostConstruct
    public void init() {
        connectToRMIServer();
    }
    
    private void connectToRMIServer() {
        try {
            // Explicitly use localhost to avoid network IP issues
            String host = "localhost".equals(rmiServerHost) ? "localhost" : rmiServerHost;
            registry = LocateRegistry.getRegistry(host, rmiServerPort);
            carRentalService = (CarRentalService) registry.lookup(serviceName);
            System.out.println("Connected to RMI server at " + host + ":" + rmiServerPort);
        } catch (RemoteException | NotBoundException e) {
            System.err.println("Error connecting to RMI server: " + e.getMessage());
            System.err.println("Make sure the RMI server is running on " + rmiServerHost + ":" + rmiServerPort);
            e.printStackTrace();
            // Don't throw exception on startup, allow lazy connection retry
            carRentalService = null;
        }
    }
    
    private void ensureConnected() throws RemoteException {
        if (carRentalService == null) {
            connectToRMIServer();
            if (carRentalService == null) {
                throw new RemoteException("RMI server is not available. Please ensure the RMI server is running.");
            }
        }
    }
    
    @PreDestroy
    public void cleanup() {
        // RMI connections are automatically cleaned up
    }
    
    public CarRentalService getService() throws RemoteException {
        ensureConnected();
        return carRentalService;
    }
    
    // User operations
    public User registerUser(User user) throws RemoteException {
        return getService().registerUser(user);
    }
    
    public User authenticateUser(String email, String password) throws RemoteException {
        return getService().authenticateUser(email, password);
    }
    
    public User getUserById(Long userId) throws RemoteException {
        return getService().getUserById(userId);
    }
    
    public User updateUser(User user) throws RemoteException {
        return getService().updateUser(user);
    }
    
    public boolean changePassword(Long userId, String currentPassword, String newPassword) throws RemoteException {
        return getService().changePassword(userId, currentPassword, newPassword);
    }
    
    public List<User> getAllUsers() throws RemoteException {
        return getService().getAllUsers();
    }
    
    // Car operations
    public List<Car> getAllCars() throws RemoteException {
        return getService().getAllCars();
    }
    
    public Car getCarById(Long carId) throws RemoteException {
        return getService().getCarById(carId);
    }
    
    public Car addCar(Car car) throws RemoteException {
        return getService().addCar(car);
    }
    
    public Car updateCar(Car car) throws RemoteException {
        return getService().updateCar(car);
    }
    
    public boolean deleteCar(Long carId) throws RemoteException {
        return getService().deleteCar(carId);
    }
    
    public List<Car> searchCars(String brand, String city, String availability) throws RemoteException {
        return getService().searchCars(brand, city, availability);
    }
    
    public List<Car> getCarsByOwner(Long ownerId) throws RemoteException {
        return getService().getCarsByOwner(ownerId);
    }
    
    // Reservation operations
    public Reservation createReservation(Reservation reservation) throws RemoteException {
        return getService().createReservation(reservation);
    }
    
    public Reservation getReservationById(Long reservationId) throws RemoteException {
        return getService().getReservationById(reservationId);
    }
    
    public List<Reservation> getReservationsByUser(Long userId) throws RemoteException {
        return getService().getReservationsByUser(userId);
    }
    
    public List<Reservation> getReservationsByCar(Long carId) throws RemoteException {
        return getService().getReservationsByCar(carId);
    }
    
    public boolean cancelReservation(Long reservationId) throws RemoteException {
        return getService().cancelReservation(reservationId);
    }
    
    public Reservation updateReservation(Reservation reservation) throws RemoteException {
        return getService().updateReservation(reservation);
    }
    
    public List<Reservation> getAllReservations() throws RemoteException {
        return getService().getAllReservations();
    }
}
