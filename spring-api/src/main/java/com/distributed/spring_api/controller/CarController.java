package com.distributed.spring_api.controller;

import com.distributed.rmi.model.Car;
import com.distributed.spring_api.service.RMIClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {
    
    @Autowired
    private RMIClientService rmiClientService;
    
    @GetMapping
    public ResponseEntity<?> getAllCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String availability) {
        try {
            List<Car> cars;
            if (brand != null || city != null || availability != null) {
                cars = rmiClientService.searchCars(brand, city, availability);
            } else {
                cars = rmiClientService.getAllCars();
            }
            return ResponseEntity.ok(cars);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching cars", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCarById(@PathVariable Long id) {
        try {
            Car car = rmiClientService.getCarById(id);
            if (car == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(car);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching car", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addCar(@RequestBody Car car) {
        try {
            Car createdCar = rmiClientService.addCar(car);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCar);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error adding car", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody Car car) {
        try {
            car.setId(id);
            Car updatedCar = rmiClientService.updateCar(car);
            return ResponseEntity.ok(updatedCar);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error updating car", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        try {
            boolean deleted = rmiClientService.deleteCar(id);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error deleting car", e.getMessage()));
        }
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getCarsByOwner(@PathVariable Long ownerId) {
        try {
            if (ownerId == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Validation error", "Owner ID cannot be null"));
            }
            List<Car> cars = rmiClientService.getCarsByOwner(ownerId);
            return ResponseEntity.ok(cars != null ? cars : new java.util.ArrayList<>());
        } catch (RemoteException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching owner cars", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Unexpected error", e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String error, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        return response;
    }
}
