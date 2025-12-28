package com.distributed.rmi.server;

import com.distributed.rmi.service.CarRentalService;
import com.distributed.rmi.service.CarRentalServiceImpl;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RMIServer {
    private static final String SERVICE_NAME = "CarRentalService";
    private static final int REGISTRY_PORT = 1099;
    
    public static void main(String[] args) {
        try {
            // Set RMI server hostname to localhost to avoid network IP issues
            System.setProperty("java.rmi.server.hostname", "localhost");
            
            // Create and export the RMI service
            CarRentalService service = new CarRentalServiceImpl();
            
            // Create RMI registry on port 1099 (or use existing one)
            Registry registry;
            try {
                registry = LocateRegistry.createRegistry(REGISTRY_PORT);
                System.out.println("RMI Registry created on port " + REGISTRY_PORT);
            } catch (RemoteException e) {
                // Registry already exists
                registry = LocateRegistry.getRegistry(REGISTRY_PORT);
                System.out.println("RMI Registry already exists on port " + REGISTRY_PORT);
            }
            
            // Bind the service to the registry
            registry.rebind(SERVICE_NAME, service);
            System.out.println("CarRentalService bound to RMI registry with name: " + SERVICE_NAME);
            System.out.println("RMI Server is running and ready to accept requests...");
            System.out.println("Registry URL: rmi://localhost:" + REGISTRY_PORT + "/" + SERVICE_NAME);
            System.out.println("Press Ctrl+C to stop the server...");
            
            // Keep the server running
            Object lock = new Object();
            synchronized (lock) {
                try {
                    lock.wait(); // Keep the main thread alive
                } catch (InterruptedException e) {
                    System.out.println("RMI Server shutting down...");
                }
            }
            
        } catch (RemoteException e) {
            System.err.println("Error starting RMI server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
